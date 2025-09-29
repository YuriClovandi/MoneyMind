import axios from 'axios';

const api = axios.create({
  // Coloque a URL do seu back-end aqui quando estiver pronto
  // Ex: baseURL: 'http://localhost:3333/api'
  baseURL: 'https://api.moneymind.com',
});

export default api;