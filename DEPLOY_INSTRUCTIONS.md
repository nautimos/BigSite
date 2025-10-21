# 🚀 Deploy do BigSite na Vercel

## Opção 1: Deploy via Vercel Dashboard (Mais Fácil)

### Passo 1: Criar Repositório no GitHub
1. Acesse: https://github.com/new
2. Nome do repositório: `BigSite`
3. Visibilidade: **Public**
4. Clique em **"Create repository"**

### Passo 2: Fazer Push do Código
Execute no terminal:

```powershell
cd C:\Users\tiago\Downloads\BigSite

# Configurar Git
git config user.name "Seu Nome"
git config user.email "seu@email.com"

# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/BigSite.git

# Fazer push
git branch -M main
git push -u origin main
```

### Passo 3: Importar na Vercel
1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Conecte com GitHub
4. Selecione o repositório **BigSite**
5. Clique em **"Import"**

### Passo 4: Configurar Variáveis de Ambiente
Antes de fazer deploy, adicione:

- **Nome**: `DATABASE_URL`
- **Valor**: `postgresql://postgres.uwqzzignzgxqsvxaovgg:WmVu22B2lG5IU2M4@aws-1-us-east-1.pooler.supabase.com:5432/postgres`

### Passo 5: Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Copie a URL de produção (ex: `https://bigsite-xyz.vercel.app`)

---

## Opção 2: Deploy via Vercel CLI

```powershell
# Login na Vercel (abra o link que aparecer)
vercel login

# Deploy
vercel

# Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? Seu usuário/team
# - Link to existing project? No
# - Project name? BigSite
# - Directory? ./
# - Override settings? No

# Adicionar variável de ambiente
vercel env add DATABASE_URL

# Paste value:
postgresql://postgres.uwqzzignzgxqsvxaovgg:WmVu22B2lG5IU2M4@aws-1-us-east-1.pooler.supabase.com:5432/postgres

# Deploy em produção
vercel --prod
```

---

## ⚙️ Configurações Importantes

### Build Settings (já configuradas)
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` ou `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Environment Variables Necessárias
```
DATABASE_URL=postgresql://postgres.uwqzzignzgxqsvxaovgg:WmVu22B2lG5IU2M4@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

---

## 📝 Após o Deploy

### 1. Copie a URL de Produção
Exemplo: `https://bigsite.vercel.app`

### 2. Atualize a Extensão
Edite: `public/chrome-extension/popup.html`

Substitua:
```javascript
backendApiUrl: 'http://127.0.0.1:3000'
```

Por:
```javascript
backendApiUrl: 'https://bigsite.vercel.app'
```

### 3. Recarregue a Extensão
1. Vá em `chrome://extensions`
2. Clique em 🔄 **Recarregar** na extensão Big Site
3. Teste login/cadastro!

---

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código commitado e pushed
- [ ] Projeto importado na Vercel
- [ ] `DATABASE_URL` configurada
- [ ] Deploy concluído
- [ ] URL de produção copiada
- [ ] Extensão atualizada com nova URL
- [ ] Extensão recarregada
- [ ] Login/cadastro testado

---

## 🆘 Problemas Comuns

### "Error connecting to database"
- Verifique se `DATABASE_URL` está configurada corretamente
- Confirme que o Supabase está acessível

### "Build failed"
- Veja os logs do build na Vercel
- Verifique se todas as dependências estão em `package.json`

### "502 Bad Gateway"
- Aguarde alguns segundos após o deploy
- Recarregue a página

---

**URL de Deploy da Vercel**: https://vercel.com/new
**Senha temporária do Supabase**: WmVu22B2lG5IU2M4
