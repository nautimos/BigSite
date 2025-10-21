# 🔐 Configuração do Google OAuth para Big Site

## ⚠️ Status Atual
O Google Sign-In **requer configuração** antes de funcionar. Por enquanto, use **login com e-mail/senha**.

## 💡 Precisa Publicar na Chrome Store?

**NÃO!** Você pode configurar OAuth **durante o desenvolvimento**, sem publicar.

### **Duas Opções:**

1. **Desenvolvimento (ID Temporário)** - Funciona, mas ID muda ao reinstalar
2. **Desenvolvimento com Key Fixa** - ✅ **Recomendado** - ID permanente
3. **Publicado na Chrome Store** - ID permanente automático

**Vamos usar a Opção 2: Key Fixa** (mais estável)

---

## 📋 Guia Completo de Configuração

### **Passo 0: Gerar Key Permanente (Recomendado)**

#### **Opção A: Script Automático** ✅ **Mais Fácil**

```bash
# Na pasta do projeto
node generate_extension_key.js
```

O script irá:
1. ✅ Gerar `extension-key.pem` (chave privada)
2. ✅ Gerar a "key" em Base64
3. ✅ Calcular o Extension ID
4. ✅ Mostrar instruções

**Copie a "key" exibida e cole no `manifest.json`**

#### **Opção B: Sem Key (ID Temporário)**

Se preferir não usar key:
1. Carregue a extensão no Chrome
2. Vá em `chrome://extensions`
3. Copie o ID exibido
4. ⚠️ Lembre-se: O ID mudará se reinstalar

---

### **Passo 1: Criar Projeto no Google Cloud Console**

1. Acesse: https://console.cloud.google.com
2. Clique em **"Select a project"** → **"New Project"**
3. Nome do projeto: `Big Site Extension`
4. Clique em **"Create"**

---

### **Passo 2: Ativar Google+ API**

1. No menu lateral, vá em **"APIs & Services"** → **"Library"**
2. Pesquise por: `Google+ API`
3. Clique em **"Enable"**

---

### **Passo 3: Criar Credenciais OAuth 2.0**

1. Vá em **"APIs & Services"** → **"Credentials"**
2. Clique em **"Create Credentials"** → **"OAuth client ID"**
3. **Tipo de aplicativo**: Selecione **"Extensão do Chrome"** (Chrome Extension)
4. Nome: `  Big Site Chrome Extension`
5. ID do aplicativo: 
   - Vá em `chrome://extensions`
   - Ative "Developer mode" (Modo do desenvolvedor)
   - Veja o ID da extensão (ex: `abcdefghijklmnopqrstuvwxyz123456`)
   - Cole aqui no campo "Application ID"
6. Clique em **"Create"** (Criar)

---

### **Passo 4: Copiar Client ID**

1. Após criar, copie o **Client ID** gerado
2. Formato: `787487178481-jni4bg67qjlki3va8kuno0ca9tmm306k.apps.googleusercontent.com`

---

### **Passo 5: Configurar manifest.json**

Abra `manifest.json` e substitua:

```json
"oauth2": {
  "client_id": "787487178481-jni4bg67qjlki3va8kuno0ca9tmm306k.apps.googleusercontent.com",
  "scopes": [
    "openid",
    "email",
    "profile"
  ]
}
```

Por:

```json
"oauth2": {
  "client_id": "123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com",
  "scopes": [
    "openid",
    "email",
    "profile"
  ]
}
```

*(Cole seu Client ID real)*

---

### **Passo 6: Recarregar Extensão**

1. Vá em `chrome://extensions`
2. Clique no botão **"Reload"** da extensão Big Site
3. Teste o botão "Continuar com Google"

---

## ✅ Teste de Funcionamento

Após configurar:

1. Abra a extensão Big Site
2. Clique em **"Continuar com Google"**
3. Popup do Google deve aparecer
4. Selecione sua conta Google
5. Autorize o acesso
6. ✅ Login realizado com sucesso!

---

## 🔧 Solução de Problemas

### **Erro: "OAuth2 not granted"**
- ✅ Verifique se o Client ID está correto no manifest.json
- ✅ Verifique se a Google+ API está ativada
- ✅ Recarregue a extensão

### **Erro: "Invalid client ID"**
- ✅ O Client ID deve terminar com `.apps.googleusercontent.com`
- ✅ Verifique se copiou o Client ID completo

### **Erro: "Redirect URI mismatch"**
- ✅ Use o tipo "Chrome App" ao criar as credenciais
- ✅ O ID do aplicativo deve corresponder ao ID da extensão

### **Popup não aparece**
- ✅ Verifique se popups não estão bloqueados
- ✅ Tente em uma janela anônima
- ✅ Limpe cache e cookies

---

## 🌐 Para Publicar na Chrome Web Store

Quando publicar a extensão:

1. O ID da extensão mudará
2. Atualize o ID do aplicativo no Google Cloud Console
3. Gere novo Client ID
4. Atualize manifest.json com novo Client ID

---

## 💡 Alternativa Temporária

**Enquanto não configura OAuth:**

✅ Use login com **e-mail e senha**
✅ Funciona perfeitamente sem configuração adicional
✅ Dados armazenados localmente

---

## 📝 Referências

- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)
- [Google Cloud Console](https://console.cloud.google.com)
- [OAuth 2.0 para Chrome Extensions](https://developer.chrome.com/docs/extensions/mv3/tut_oauth/)

---

## 🆘 Suporte

Se tiver problemas:
1. Verifique o console do DevTools (F12)
2. Procure por mensagens de erro detalhadas
3. Siga as instruções exibidas no console
