import { Request, Response } from 'express';
import { supabase } from '../services/supabase';
import { ApiResponse } from '../types';

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        } as ApiResponse);
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, name, balance, created_at, updated_at')
        .eq('id', req.user.id)
        .single();

      if (error || !user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: user,
        message: 'Perfil recuperado com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        } as ApiResponse);
      }

      const { name } = req.body;

      const { data: user, error } = await supabase
        .from('users')
        .update({
          name,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.user.id)
        .select('id, email, name, balance, updated_at')
        .single();

      if (error || !user) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao atualizar perfil',
          error: error?.message
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: user,
        message: 'Perfil atualizado com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  },

  async updateBalance(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        } as ApiResponse);
      }

      const { balance } = req.body;

      if (typeof balance !== 'number' || balance < 0) {
        return res.status(400).json({
          success: false,
          message: 'Saldo deve ser um número positivo'
        } as ApiResponse);
      }

      const { data: user, error } = await supabase
        .from('users')
        .update({
          balance,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.user.id)
        .select('id, email, name, balance, updated_at')
        .single();

      if (error || !user) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao atualizar saldo',
          error: error?.message
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: { balance: user.balance },
        message: 'Saldo atualizado com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
};
