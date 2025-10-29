import dotenv from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';

// Carregar variáveis de ambiente PRIMEIRO
dotenv.config({ path: join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import expenseRoutes from './routes/expense';

const app = express();
const PORT = process.env.PORT || 3333;
const isProduction = process.env.NODE_ENV === 'production';

// Configurar CORS - permitir domínio customizado e Heroku
const allowedOrigins = [
  'http://localhost:3000',
  'https://moneymind1.me',
  'https://www.moneymind1.me'
];

// Adicionar URL do Heroku se existir
if (process.env.HEROKU_APP_NAME) {
  allowedOrigins.push(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`);
}

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Permitir React Router
}));

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (Postman, mobile apps, etc)
    if (!origin) return callback(null, true);
    
    // Permitir se estiver na lista ou em produção sem origin específico
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // Em produção, aceitar qualquer origin do domínio configurado
      if (isProduction && origin.includes('moneymind1.me')) {
        callback(null, true);
      } else {
        callback(new Error('Não permitido pelo CORS'));
      }
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'MoneyMind API está funcionando!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Servir arquivos estáticos do frontend em produção
if (isProduction) {
  const frontendBuildPath = join(__dirname, '../../frontend/build');
  
  if (existsSync(frontendBuildPath)) {
    // Servir arquivos estáticos (CSS, JS, imagens, etc)
    app.use(express.static(frontendBuildPath));
    
    // Para todas as rotas que não são /api, servir o index.html (SPA)
    app.get('*', (req, res) => {
      // Não servir index.html para rotas da API
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'Rota não encontrada' });
      }
      res.sendFile(join(frontendBuildPath, 'index.html'));
    });
    
    console.log('✅ Frontend estático configurado para produção');
  } else {
    console.warn('⚠️ Frontend build não encontrado. Execute: npm run build:all');
  }
}

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  if (isProduction) {
    console.log(`🌐 Acesse: https://moneymind1.me ou https://${process.env.HEROKU_APP_NAME}.herokuapp.com`);
  }
});
