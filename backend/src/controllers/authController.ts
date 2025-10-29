import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { supabase, supabaseAdmin } from '../services/supabase';
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

      console.log('🔐 Tentando fazer login:', { email });

      // Autenticar com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('❌ Erro no Supabase Auth:', {
          message: authError.message,
          status: authError.status,
          name: authError.name
        });

        // Tratar erros específicos do Supabase
        if (authError.message.includes('Invalid login credentials')) {
          return res.status(401).json({
            success: false,
            message: 'Email ou senha incorretos',
            error: authError.message
          } as ApiResponse);
        }

        if (authError.message.includes('Email not confirmed')) {
          return res.status(403).json({
            success: false,
            message: 'Por favor, confirme seu email antes de fazer login',
            error: authError.message
          } as ApiResponse);
        }

        return res.status(401).json({
          success: false,
          message: 'Erro ao autenticar: ' + authError.message,
          error: authError.message
        } as ApiResponse);
      }

      if (!authData.user) {
        console.error('❌ Usuário não retornado do Supabase Auth');
        return res.status(401).json({
          success: false,
          message: 'Erro ao autenticar: usuário não encontrado'
        } as ApiResponse);
      }

      console.log('✅ Autenticação no Supabase Auth bem-sucedida:', {
        userId: authData.user.id,
        email: authData.user.email,
        emailConfirmed: authData.user.email_confirmed_at ? 'Sim' : 'Não'
      });

      // Buscar dados do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name, balance')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        console.error('❌ Erro ao buscar usuário na tabela users:', {
          error: userError.message,
          code: userError.code,
          userId: authData.user.id
        });

        // Se o usuário não existe na tabela users mas existe no auth.users,
        // criar automaticamente o registro (sync)
        if (userError.code === 'PGRST116') {
          console.log('⚠️ Usuário existe no Auth mas não na tabela users. Criando registro...');
          
          // Usar supabaseAdmin para bypass de RLS ao criar o registro
          const { data: newUserData, error: createError } = await supabaseAdmin
            .from('users')
            .insert({
              id: authData.user.id,
              email: authData.user.email || email,
              name: authData.user.user_metadata?.name || 'Usuário',
              balance: 0
            })
            .select('id, email, name, balance')
            .single();

          if (createError || !newUserData) {
            console.error('❌ Erro ao criar registro do usuário:', createError);
            return res.status(500).json({
              success: false,
              message: 'Erro ao sincronizar perfil do usuário',
              error: createError?.message
            } as ApiResponse);
          }

          console.log('✅ Registro criado com sucesso:', newUserData);

          // Gerar token JWT
          const token = generateToken({
            userId: newUserData.id,
            email: newUserData.email
          });

          return res.json({
            success: true,
            data: {
              user: newUserData,
              token
            },
            message: 'Login realizado com sucesso (perfil sincronizado)'
          } as ApiResponse);
        }

        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar dados do usuário',
          error: userError.message
        } as ApiResponse);
      }

      if (!userData) {
        console.error('❌ Usuário não encontrado na tabela users');
        return res.status(401).json({
          success: false,
          message: 'Usuário não encontrado no sistema'
        } as ApiResponse);
      }

      console.log('✅ Usuário encontrado:', { userId: userData.id, email: userData.email });

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
      console.error('❌ Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      } as ApiResponse);
    }
  }
};
