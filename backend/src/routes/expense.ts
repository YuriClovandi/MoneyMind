import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { expenseController } from '../controllers/expenseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Middleware de autenticação
router.use(authenticateToken);

// Validações
const expenseValidation = [
  body('description').trim().notEmpty().withMessage('Descrição é obrigatória'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
  body('category').trim().notEmpty().withMessage('Categoria é obrigatória'),
  body('date').isISO8601().withMessage('Data inválida')
];

// Routes
router.get('/', expenseController.getExpenses);
router.post('/', expenseValidation, expenseController.createExpense);
router.get('/:id', expenseController.getExpense);
router.put('/:id', expenseValidation, expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;
