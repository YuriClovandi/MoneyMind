import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { supabase } from '../services/supabase';
import { ApiResponse, Expense } from '../types';

export const expenseController = {
  async getExpenses(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        } as ApiResponse);
      }

      const { page = 1, limit = 50, category, startDate, endDate } = req.query;

      console.log('Parâmetros da consulta:', { page, limit, category, startDate, endDate, userId: req.user.id });

      let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', req.user.id)
        .order('date', { ascending: false });

      if (category) {
        query = query.eq('category', category);
        console.log('Filtro por categoria aplicado:', category);
      }

      if (startDate) {
        query = query.gte('date', startDate);
        console.log('Filtro por data início aplicado:', startDate);
      }

      if (endDate) {
        query = query.lte('date', endDate);
        console.log('Filtro por data fim aplicado:', endDate);
      }

      // Aplicar paginação apenas se especificado
      if (limit !== 'all') {
        const from = (Number(page) - 1) * Number(limit);
        const to = from + Number(limit) - 1;
        query = query.range(from, to);
        console.log('Paginação aplicada:', { from, to });
      }

      const { data: expenses, error } = await query;

      if (error) {
        console.error('Erro na consulta de despesas:', error);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar despesas',
          error: error.message
        } as ApiResponse);
      }

      console.log(`Despesas encontradas para usuário ${req.user.id}:`, expenses?.length || 0, 'itens');
      console.log('Primeira despesa:', expenses?.[0]);

      res.json({
        success: true,
        data: expenses,
        message: 'Despesas recuperadas com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  },

  async createExpense(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: errors.array()
        } as ApiResponse);
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        } as ApiResponse);
      }

      const { description, amount, category, date } = req.body;

      const { data: expense, error } = await supabase
        .from('expenses')
        .insert({
          user_id: req.user.id,
          description,
          amount,
          category,
          date
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao criar despesa',
          error: error.message
        } as ApiResponse);
      }

      res.status(201).json({
        success: true,
        data: expense,
        message: 'Despesa criada com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  },

  async getExpense(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        } as ApiResponse);
      }

      const { id } = req.params;

      const { data: expense, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

      if (error || !expense) {
        return res.status(404).json({
          success: false,
          message: 'Despesa não encontrada'
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: expense,
        message: 'Despesa recuperada com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro ao buscar despesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  },

  async updateExpense(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: errors.array()
        } as ApiResponse);
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        } as ApiResponse);
      }

      const { id } = req.params;
      const { description, amount, category, date } = req.body;

      // Verificar se a despesa pertence ao usuário
      const { data: existingExpense, error: checkError } = await supabase
        .from('expenses')
        .select('id')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

      if (checkError || !existingExpense) {
        return res.status(404).json({
          success: false,
          message: 'Despesa não encontrada'
        } as ApiResponse);
      }

      const { data: expense, error } = await supabase
        .from('expenses')
        .update({
          description,
          amount,
          category,
          date,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao atualizar despesa',
          error: error.message
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: expense,
        message: 'Despesa atualizada com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  },

  async deleteExpense(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        } as ApiResponse);
      }

      const { id } = req.params;

      // Verificar se a despesa pertence ao usuário e deletar
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id);

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Erro ao deletar despesa',
          error: error.message
        } as ApiResponse);
      }

      res.json({
        success: true,
        message: 'Despesa deletada com sucesso'
      } as ApiResponse);

    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
};
