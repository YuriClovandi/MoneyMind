# 🚀 Guia de Deploy no Heroku - MoneyMind

## 📋 Pré-requisitos

- ✅ Conta no Heroku (heroku.com)
- ✅ Heroku CLI instalado
- ✅ Git instalado
- ✅ Domínio `moneymind1.me` configurado no Namecheap
- ✅ Projeto Supabase configurado

---

## 🔧 Configuração Inicial

### 1. **Login no Heroku CLI**

```bash
heroku login
```

### 2. **Criar App no Heroku**

```bash
# Criar novo app
heroku create moneymind

# Ou usar um nome específico
heroku create moneymind-app
```

Anote o nome do app criado (será usado nas configurações).

---

## 📝 Configurar Variáveis de Ambiente

### 3. **Configurar Variáveis no Heroku**

Substitua os valores pelos seus dados reais:

```bash
# Substitua 'moneymind' pelo nome do seu app Heroku
APP_NAME="moneymind"

# Configurações básicas
heroku config:set NODE_ENV=production -a $APP_NAME

# Supabase (substitua pelos seus valores)
heroku config:set SUPABASE_URL="https://seu-projeto.supabase.co" -a $APP_NAME
heroku config:set SUPABASE_ANON_KEY="sua-chave-anon" -a $APP_NAME
heroku config:set SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role" -a $APP_NAME

# JWT Secret (gere uma chave forte)
heroku config:set JWT_SECRET=$(openssl rand -hex 32) -a $APP_NAME

# URLs
heroku config:set FRONTEND_URL="https://moneymind1.me" -a $APP_NAME
heroku config:set REACT_APP_API_URL="https://moneymind1.me/api" -a $APP_NAME
heroku config:set HEROKU_APP_NAME=$APP_NAME -a $APP_NAME

# ⚠️ IMPORTANTE: REACT_APP_API_URL deve ser definida ANTES do build!
# Isso garante que o frontend seja construído com a URL correta
```

### 4. **Verificar Variáveis Configuradas**

```bash
heroku config
```

---

## 🌐 Configurar Domínio Customizado

### 5. **Adicionar Domínio no Heroku**

```bash
# Adicionar domínio sem www
heroku domains:add moneymind1.me

# Adicionar domínio com www (opcional)
heroku domains:add www.moneymind1.me
```

### 6. **Configurar DNS no Namecheap**

Acesse seu painel do Namecheap e configure os seguintes registros DNS:

#### **Opção 1: Usando CNAME (Recomendado)**

| Tipo | Host | Valor | TTL |
|------|------|-------|-----|
| CNAME Record | @ | `moneymind1.herokuapp.com` | Automatic |
| CNAME Record | www | `moneymind1.herokuapp.com` | Automatic |

#### **Opção 2: Usando A Record + CNAME**

Se CNAME não funcionar para o domínio raiz:

| Tipo | Host | Valor | TTL |
|------|------|-------|-----|
| A Record | @ | `75.101.147.0` | Automatic |
| A Record | @ | `75.101.149.69` | Automatic |
| A Record | @ | `54.81.115.210` | Automatic |
| A Record | @ | `54.80.22.178` | Automatic |
| CNAME Record | www | `moneymind1.herokuapp.com` | Automatic |

**⚠️ IMPORTANTE**: Substitua `moneymind1` pelo nome do seu app Heroku!

### 7. **Verificar Domínios**

```bash
# Listar domínios configurados
heroku domains

# Deve mostrar:
# moneymind1.me (DNS Target: moneymind1.herokuapp.com)
```

---

## 🔒 Configurar SSL/HTTPS

O Heroku fornece SSL automático via Let's Encrypt.

### 8. **Verificar Status do SSL**

```bash
heroku certs:info
```

O SSL é ativado automaticamente quando você adiciona um domínio customizado.

### 9. **Forçar HTTPS (Opcional mas Recomendado)**

O backend já está configurado para aceitar HTTPS. Certifique-se de que:

- ✅ Domínio está funcionando
- ✅ SSL está ativo
- ✅ Variáveis de ambiente estão corretas

---

## 🚀 Fazer Deploy

### 10. **Configurar Git (se ainda não fez)**

```bash
# Inicializar Git (se necessário)
git init

# Adicionar remote do Heroku
heroku git:remote -a moneymind

# Verificar remotes
git remote -v
```

### 11. **Fazer Commit das Mudanças**

```bash
# Adicionar todos os arquivos
git add .

# Commit
git commit -m "Preparar para deploy no Heroku"
```

### 12. **Deploy para Heroku**

```bash
# Deploy principal
git push heroku main

# Ou se sua branch for 'master'
git push heroku master
```

### 13. **Acompanhar Logs**

```bash
# Ver logs em tempo real
heroku logs --tail

# Ver logs específicos
heroku logs --tail --app moneymind
```

---

## ✅ Verificar Deploy

### 14. **Testar a Aplicação**

1. **Health Check**:
   ```bash
   curl https://moneymind1.me/api/health
   ```
   Deve retornar: `{"message":"MoneyMind API está funcionando!",...}`

2. **Acessar no Navegador**:
   - https://moneymind1.me
   - https://moneymind1.herokuapp.com

3. **Verificar Frontend**:
   - Deve carregar a página de login
   - Console do navegador sem erros

4. **Testar API**:
   - Tentar fazer login/cadastro
   - Verificar se as requisições estão funcionando

---

## 🔄 Atualizações Futuras

Sempre que fizer mudanças:

```bash
# 1. Commit local
git add .
git commit -m "Descrição das mudanças"

# 2. Deploy
git push heroku main

# 3. Verificar logs
heroku logs --tail
```

---

## 🐛 Troubleshooting

### **Problema: Build falha**

```bash
# Ver logs detalhados
heroku logs --tail

# Verificar se todas as dependências estão instaladas
heroku run npm install
```

### **Problema: Domínio não funciona**

1. Verificar DNS:
   ```bash
   # Verificar se DNS está propagado
   nslookup moneymind1.me
   
   # Deve retornar o IP do Heroku ou o CNAME
   ```

2. Verificar domínios:
   ```bash
   heroku domains
   ```

3. Aguardar propagação DNS (pode levar até 48h, geralmente 15-30 min)

### **Problema: Erro 500 na API**

1. Verificar logs:
   ```bash
   heroku logs --tail
   ```

2. Verificar variáveis de ambiente:
   ```bash
   heroku config
   ```

3. Verificar se Supabase está acessível

### **Problema: CORS**

Certifique-se de que:
- ✅ `FRONTEND_URL` está configurada como `https://moneymind1.me`
- ✅ `REACT_APP_API_URL` está configurada
- ✅ Frontend está sendo servido do mesmo domínio

### **Problema: Frontend não carrega**

1. Verificar se build foi feito:
   ```bash
   heroku run ls frontend/build
   ```

2. Rebuild:
   ```bash
   git push heroku main --force
   ```

---

## 📊 Comandos Úteis do Heroku

```bash
# Ver informações do app
heroku info

# Ver variáveis de ambiente
heroku config

# Editar variável
heroku config:set NOME_VAR=valor

# Remover variável
heroku config:unset NOME_VAR

# Abrir app no navegador
heroku open

# Abrir console
heroku run bash

# Reiniciar app
heroku restart

# Verificar status
heroku ps

# Ver logs
heroku logs
heroku logs --tail
heroku logs --num 100  # últimas 100 linhas
```

---

## 🔐 Segurança em Produção

1. ✅ **Nunca commite** arquivos `.env` no Git
2. ✅ Use `JWT_SECRET` forte (32+ caracteres aleatórios)
3. ✅ Configure CORS corretamente
4. ✅ Use HTTPS sempre (Heroku faz isso automaticamente)
5. ✅ Monitore logs regularmente
6. ✅ Configure backups no Supabase

---

## 📱 Checklist Final

Antes de considerar o deploy completo:

- [ ] App criado no Heroku
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio adicionado no Heroku
- [ ] DNS configurado no Namecheap
- [ ] SSL ativo (automático)
- [ ] Deploy realizado com sucesso
- [ ] Health check funcionando
- [ ] Frontend carregando corretamente
- [ ] API respondendo
- [ ] Login/Cadastro funcionando
- [ ] Logs sem erros críticos

---

**🎉 Pronto! Seu MoneyMind está no ar em https://moneymind1.me!**

Se precisar de ajuda, verifique os logs com `heroku logs --tail`.

