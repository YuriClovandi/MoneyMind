#!/bin/bash

# Script para configurar tudo no Heroku de uma vez
# Uso: ./SETUP-HEROKU.sh

echo "🚀 Configurando MoneyMind no Heroku..."

# Verificar se está logado
heroku whoami || {
    echo "❌ Você precisa estar logado no Heroku!"
    echo "Execute: heroku login"
    exit 1
}

# Nome do app (altere se necessário)
APP_NAME="moneymind"

echo "📝 Configurando variáveis de ambiente..."

# Ler valores do usuário
read -p "Digite sua SUPABASE_URL: " SUPABASE_URL
read -p "Digite sua SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -p "Digite sua SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY

# Gerar JWT Secret
JWT_SECRET=$(openssl rand -hex 32)

# Configurar variáveis
heroku config:set NODE_ENV=production -a $APP_NAME
heroku config:set SUPABASE_URL="$SUPABASE_URL" -a $APP_NAME
heroku config:set SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" -a $APP_NAME
heroku config:set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" -a $APP_NAME
heroku config:set JWT_SECRET="$JWT_SECRET" -a $APP_NAME
heroku config:set FRONTEND_URL=https://moneymind1.me -a $APP_NAME
heroku config:set REACT_APP_API_URL=https://moneymind1.me/api -a $APP_NAME
heroku config:set HEROKU_APP_NAME=$APP_NAME -a $APP_NAME

echo "✅ Variáveis configuradas!"

# Adicionar domínios
echo "🌐 Configurando domínios..."
heroku domains:add moneymind1.me -a $APP_NAME
heroku domains:add www.moneymind1.me -a $APP_NAME

echo "✅ Domínios adicionados!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o DNS no Namecheap:"
echo "   CNAME @ -> ${APP_NAME}.herokuapp.com"
echo "   CNAME www -> ${APP_NAME}.herokuapp.com"
echo ""
echo "2. Faça o deploy:"
echo "   git push heroku main"
echo ""
echo "3. Verifique os logs:"
echo "   heroku logs --tail -a $APP_NAME"

