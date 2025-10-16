import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erro:', error);

  const response: ApiResponse = {
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  };

  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        response.message = 'Recurso não encontrado';
        break;
      case '23505':
        response.message = 'Dados já existem';
        break;
      default:
        response.message = error.message || 'Erro no banco de dados';
    }
  }

  res.status(error.status || 500).json(response);
};
