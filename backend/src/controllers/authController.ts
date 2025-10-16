import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { supabase } from '../services/supabase';
import { generateToken } from '../utils/jwt';
import { RegisterRequest, AuthRequest, ApiResponse } from '../types';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: errors.array()
        } as ApiResponse);
      }

      const { name, email, password }: RegisterRequest = req.body;

      // Verificar se o usuário já existe
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      // Se não é erro de "não encontrado", então pode ser outro erro
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar usuário existente:', checkError);
        return res.status(500).json({
          success: false,
          message: 'Erro ao verificar usuário existente',
          error: checkError.message
        } as ApiResponse);
      }

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Usuário já existe com este email'
        } as ApiResponse);
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 12);

      // Criar usuário no Supabase Auth
      console.log('Tentando criar usuário no Supabase Auth:', { email, name });
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (authError) {
        console.error('Erro no Supabase Auth:', authError);
        return res.status(400).json({
          success: false,
          message: 'Erro ao criar usuário no sistema de autenticação',
          error: authError.message
        } as ApiResponse);
      }

      console.log('Usuário criado no Auth:', authData);

      if (!authData.user) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao criar usuário'
        } as ApiResponse);
      }

      // Criar perfil do usuário na tabela users
      console.log('Tentando criar perfil na tabela users:', {
        id: authData.user.id,
        email,
        name
      });
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          balance: 0,
          password_hash: hashedPassword
        })
        .select()
        .single();

      if (userError) {
        console.error('Erro ao criar perfil na tabela users:', userError);
        return res.status(500).json({
          success: false,
          message: 'Erro ao criar perfil do usuário na base de dados',
          error: userError.message,
          details: userError
        } as ApiResponse);
      }

      console.log('Perfil criado com sucesso:', userData);

      // Gerar token JWT
      const token = generateToken({
        userId: userData.id,
        email: userData.email
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            balance: userData.balance
          },
          token
        },
        message: 'Usuário criado com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      } as ApiResponse);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: errors.array()
        } as ApiResponse);
      }

      const { email, password }: AuthRequest = req.body;

      // Autenticar com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData.user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha inválidos'
        } as ApiResponse);
      }

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name, balance')
        .eq('id', authData.user.id)
        .single();

      if (userError || !userData) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não encontrado'
        } as ApiResponse);
      }

      // Gerar token JWT
      const token = generateToken({
        userId: userData.id,
        email: userData.email
      });

      res.json({
        success: true,
        data: {
          user: userData,
          token
        },
        message: 'Login realizado com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
};
