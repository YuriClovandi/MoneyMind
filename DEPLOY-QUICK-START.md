# ⚡ Deploy Rápido - MoneyMind no Heroku

## 🚀 Passos Rápidos

### 1. **Login e Criar App**

```bash
heroku login
heroku create moneymind
```

Anote o nome do app criado (exemplo: `moneymind-12345`)

### 2. **Configurar Variáveis de Ambiente**

```bash
# Substitua pelos seus valores reais
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=https://seu-projeto.supabase.co
heroku config:set SUPABASE_ANON_KEY=sua-chave-anon
heroku config:set SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Gerar JWT Secret forte
heroku config:set JWT_SECRET=$(openssl rand -hex 32)

# URLs (substitua 'moneymind' pelo nome do seu app)
heroku config:set FRONTEND_URL=https://moneymind1.me
heroku config:set REACT_APP_API_URL=https://moneymind1.me/api
heroku config:set HEROKU_APP_NAME=moneymind
```

### 3. **Configurar Domínio**

```bash
heroku domains:add moneymind1.me
heroku domains:add www.moneymind1.me
```

### 4. **Configurar DNS no Namecheap**

No painel do Namecheap:

| Tipo | Host | Valor | TTL |
|------|------|-------|-----|
| CNAME | @ | `moneymind.herokuapp.com` | Automatic |
| CNAME | www | `moneymind.herokuapp.com` | Automatic |

**⚠️ Substitua `moneymind` pelo nome do seu app Heroku!**

### 5. **Deploy**

```bash
# Adicionar remote (se necessário)
heroku git:remote -a moneymind

# Commit
git add .
git commit -m "Deploy inicial"

# Deploy
git push heroku main
```

### 6. **Verificar**

```bash
# Ver logs
heroku logs --tail

# Testar
curl https://moneymind1.me/api/health
```

---

## ✅ Checklist

- [ ] App criado no Heroku
- [ ] Variáveis configuradas
- [ ] Domínio adicionado
- [ ] DNS configurado
- [ ] Deploy realizado
- [ ] Health check OK

---

**Pronto! 🎉**

Para mais detalhes, veja `DEPLOY-HEROKU.md`

