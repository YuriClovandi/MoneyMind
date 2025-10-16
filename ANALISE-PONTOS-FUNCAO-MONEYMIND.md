# 📊 ANÁLISE DE PONTOS DE FUNÇÃO (PF) - MoneyMind MVP

## 🎯 Resumo Executivo
**Projeto**: MoneyMind - Sistema de Controle Financeiro Pessoal  
**Tipo**: MVP (Produto Mínimo Viável)  
**Total de Pontos de Função**: 125 PF  
**Estimativa de Esforço**: 480-720 horas  
**Prazo Estimado**: 12-18 semanas  
**Custo Estimado**: R$ 24.000 - R$ 36.000  

---

## 🔍 IDENTIFICAÇÃO DAS FUNÇÕES DO SISTEMA

### 📥 **ENTRADAS EXTERNAS (EE)**

| Função | Descrição | Complexidade | PF | Observações |
|--------|-----------|--------------|----|--------------| 
| EE-01 | Cadastro de Usuário | Baixa | 3 | Nome, email, senha |
| EE-02 | Login do Usuário | Baixa | 3 | Email e senha |
| EE-03 | Cadastro de Despesa | Média | 4 | Descrição, valor, categoria, data |
| EE-04 | Edição de Despesa | Média | 4 | Mesmos campos + validações |
| EE-05 | Atualização de Saldo | Baixa | 3 | Valor numérico simples |
| EE-06 | Filtros de Data | Média | 4 | Período início/fim |
| **Subtotal EE** | | | **21 PF** | |

### 📤 **SAÍDAS EXTERNAS (SE)**

| Função | Descrição | Complexidade | PF | Observações |
|--------|-----------|--------------|----|--------------|
| SE-01 | Dashboard Principal | Alta | 7 | Saldo, categorias, últimas despesas |
| SE-02 | Lista de Despesas | Média | 5 | Com paginação e filtros |
| SE-03 | Relatório por Categoria | Média | 5 | Gráficos e resumos |
| SE-04 | Exportação PDF | Alta | 7 | Relatório formatado |
| SE-05 | Relatório de Exportação | Alta | 7 | Filtros por período |
| **Subtotal SE** | | | **31 PF** | |

### 🔍 **CONSULTAS EXTERNAS (CE)**

| Função | Descrição | Complexidade | PF | Observações |
|--------|-----------|--------------|----|--------------|
| CE-01 | Buscar Perfil do Usuário | Baixa | 3 | Dados básicos |
| CE-02 | Consultar Despesas por Período | Média | 4 | Com filtros de data |
| CE-03 | Consultar Despesas por Categoria | Baixa | 3 | Filtro simples |
| CE-04 | Buscar Despesa Individual | Baixa | 3 | Por ID |
| CE-05 | Consultar Saldo Atual | Baixa | 3 | Valor atual |
| **Subtotal CE** | | | **16 PF** | |

### 💾 **ARQUIVOS LÓGICOS INTERNOS (ALI)**

| Função | Descrição | Complexidade | PF | Observações |
|--------|-----------|--------------|----|--------------|
| ALI-01 | Arquivo de Usuários | Baixa | 7 | ID, nome, email, senha, saldo |
| ALI-02 | Arquivo de Despesas | Média | 10 | ID, usuário, descrição, valor, categoria, data |
| **Subtotal ALI** | | | **17 PF** | |

### 🔗 **ARQUIVOS DE INTERFACE EXTERNA (AIE)**

| Função | Descrição | Complexidade | PF | Observações |
|--------|-----------|--------------|----|--------------|
| AIE-01 | Sistema de Autenticação Supabase | Média | 7 | Auth.users, signUp/signIn, JWT tokens, validação de credenciais |
| AIE-02 | Base de Dados Supabase (PostgreSQL) | Média | 7 | Tabelas users/expenses, queries complexas, RLS policies, índices |
| AIE-03 | API Supabase Client/Real-time | Baixa | 5 | SDK JavaScript, conexões HTTP, configurações, tipos TypeScript |
| **Subtotal AIE** | | | **19 PF** | |

---

## 📈 **CÁLCULO TOTAL DE PONTOS DE FUNÇÃO**

| Tipo | Quantidade | Total PF |
|------|------------|----------|
| Entradas Externas (EE) | 6 funções | 21 PF |
| Saídas Externas (SE) | 5 funções | 31 PF |
| Consultas Externas (CE) | 5 funções | 16 PF |
| Arquivos Lógicos Internos (ALI) | 2 arquivos | 17 PF |
| Arquivos Interface Externa (AIE) | 3 arquivos | 19 PF |
| **TOTAL GERAL** | **21 funções** | **104 PF** |

---

## ⚙️ **FATORES DE AJUSTE**

### Complexidade Técnica Identificada:
- **Integração com Supabase**: +5%
- **Autenticação JWT**: +3%
- **Filtros Dinâmicos**: +4%
- **Exportação PDF**: +5%
- **Responsividade Mobile**: +3%

**Fator de Ajuste Total**: +20% = **1.20**

### PF Ajustados: 104 × 1.20 = **125 PF**

---

## ⏱️ **ESTIMATIVA DE ESFORÇO E CUSTO**

### Métricas de Referência:
- **Produtividade**: 15-20 PF/mês por desenvolvedor
- **Equipe**: 1 Desenvolvedor Full-Stack + 0.5 Designer UI/UX
- **Custo Médio**: R$ 150/hora (freelancer/consultoria)

### Cálculo de Esforço:
- **PF Ajustados**: 125 PF
- **Produtividade**: 17.5 PF/mês (média)
- **Tempo Estimado**: 125 ÷ 17.5 = **7.1 meses**

### Detalhamento por Fase:

| Fase | Entregáveis | Esforço (horas) | Custo (R$) |
|------|-------------|-----------------|------------|
| **1. Setup & Autenticação** | Login, Cadastro, JWT | 80-120h | R$ 12.000-18.000 |
| **2. Core Backend** | APIs, Banco, Controllers | 120-180h | R$ 18.000-27.000 |
| **3. Frontend Base** | Dashboard, Navegação | 100-150h | R$ 15.000-22.500 |
| **4. Gestão Despesas** | CRUD, Filtros, Categorias | 80-120h | R$ 12.000-18.000 |
| **5. Relatórios** | Gráficos, Exportação PDF | 100-150h | R$ 15.000-22.500 |
| **TOTAL** | Sistema Completo | **480-720h** | **R$ 72.000-108.000** |

### Cronograma Otimizado (2 desenvolvedores):
- **MVP Funcional**: 3 meses
- **Versão Completa**: 4 meses
- **Testes e Ajustes**: 1 mês

---

## 🎯 **ANÁLISE DE VIABILIDADE**

### ✅ **Pontos Fortes:**
- **Escopo bem definido** com funcionalidades essenciais
- **Tecnologias maduras** (React, Node.js, Supabase)
- **Fator de reutilização alto** para futuras expansões
- **MVP viável** em 3 meses

### ⚠️ **Riscos Identificados:**
- **Integração Supabase**: Configuração RLS, autenticação, sincronização de dados
- **Exportação PDF**: Bibliotecas específicas, formatação, impressão
- **Responsividade**: Diferentes dispositivos e resoluções
- **Segurança Financeira**: Validação de dados, proteção contra SQL injection
- **Dependência Externa**: Supabase como serviço cloud (disponibilidade, latência)

### 📋 **Recomendações:**
1. **Priorizar MVP**: Focar nas funcionalidades core primeiro
2. **Prototipagem**: Criar mockups antes do desenvolvimento
3. **Testes contínuos**: Especialmente na autenticação
4. **Documentação**: Manter docs atualizadas para futuras manutenções

---

## 📊 **RESUMO FINAL**

| Métrica | Valor |
|---------|-------|
| **Pontos de Função Brutos** | 104 PF |
| **Pontos de Função Ajustados** | 125 PF |
| **Esforço Estimado** | 480-720 horas |
| **Prazo Realista** | 3-4 meses |
| **Custo Estimado** | R$ 72.000-108.000 |
| **Viabilidade** | ✅ **ALTA** |

### Conclusão:
O MoneyMind MVP apresenta **viabilidade técnica e financeira alta**, com escopo bem definido e tecnologias apropriadas. O projeto pode ser entregue em **3-4 meses** com investimento estimado entre **R$ 72.000-108.000**, proporcionando um retorno significativo para uma solução de controle financeiro pessoal.
