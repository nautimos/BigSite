# 🔍 Debug da API Gemini - Guia Completo

## ❓ Se receber erro "Nenhum modelo Gemini disponível"

### 📋 **PASSO 1: Verificar Logs no Console**

1. Abra a extensão Big Site
2. Pressione **F12** para abrir DevTools
3. Vá na aba **Console**
4. Clique em "Salvar Chave"
5. **COPIE TODOS OS LOGS** que aparecerem

### 🔍 **O Que Procurar nos Logs**

Os logs mostrarão exatamente o que está acontecendo:

```
🔑 Testando API key: AIzaSy...
📋 Listando modelos disponíveis na sua API key...
📊 Modelos disponíveis: [...]
🧪 Testando gemini-1.5-pro-latest...
📡 URL: https://...
📨 Status gemini-1.5-pro-latest: 404/200/400
❌ gemini-1.5-pro-latest erro: ...
```

---

## ✅ **Checklist de Verificação**

### **1. API Key Correta?**
- [ ] Começa com `AIza`
- [ ] Copiou completa (sem espaços)
- [ ] Criada em: https://makersuite.google.com/app/apikey

### **2. Permissões da API Key**
- [ ] Generative Language API ativada
- [ ] Sem restrições de IP
- [ ] Sem restrições de domínio

### **3. Quota Disponível**
- [ ] Acesse: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
- [ ] Verifique se tem quota disponível
- [ ] Limite: 15 RPM (Requests Per Minute) grátis

---

## 🐛 **Erros Comuns e Soluções**

### **Erro: "API key not valid"**
```
❌ Causa: API key inválida ou expirada
✅ Solução: Crie nova key em https://makersuite.google.com/app/apikey
```

### **Erro: "models/gemini-xxx not found"**
```
❌ Causa: Modelo não disponível na sua região/quota
✅ Solução: O sistema agora testa vários modelos automaticamente
```

### **Erro: "PERMISSION_DENIED"**
```
❌ Causa: Generative Language API não ativada
✅ Solução: 
   1. Acesse: https://console.cloud.google.com/apis/library
   2. Procure "Generative Language API"
   3. Clique "Enable"
```

### **Erro: "RESOURCE_EXHAUSTED"**
```
❌ Causa: Quota excedida
✅ Solução: Aguarde alguns minutos ou crie nova API key
```

### **Erro: "Failed to fetch"**
```
❌ Causa: Problema de rede ou CORS
✅ Solução: 
   1. Verifique conexão com internet
   2. Recarregue a extensão
   3. Verifique se firewall não está bloqueando
```

---

## 🧪 **Teste Manual da API Key**

Você pode testar sua API key diretamente no navegador:

### **Método 1: Via Console do Navegador**

1. Abra uma nova aba
2. Pressione F12
3. Vá em Console
4. Cole este código (substitua SUA_API_KEY):

```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models?key=SUA_API_KEY')
  .then(r => r.json())
  .then(d => console.log('Modelos disponíveis:', d.models.map(m => m.name)))
  .catch(e => console.error('Erro:', e));
```

### **Método 2: Via cURL (Terminal)**

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=SUA_API_KEY"
```

---

## 📊 **Modelos Testados Automaticamente**

O sistema testa nesta ordem:

1. ✅ **gemini-1.5-pro-latest** - Pro mais recente
2. ✅ **gemini-1.5-pro** - Pro estável
3. ✅ **gemini-1.5-flash-latest** - Flash mais recente
4. ✅ **gemini-1.5-flash** - Flash estável
5. ✅ **gemini-1.5-flash-8b** - Flash 8B compacto

---

## 🔧 **Solução de Problemas Avançada**

### **Se NENHUM modelo funcionar:**

1. **Teste a API Key manualmente** (métodos acima)
2. **Verifique região**: Alguns modelos não estão disponíveis em todas regiões
3. **Crie nova API Key**: Às vezes a key está corrompida
4. **Verifique billing**: Algumas keys precisam billing ativado

### **Se apenas alguns modelos falharem:**

- Normal! O sistema escolhe automaticamente um que funcione
- Modelos `-latest` podem não estar disponíveis para todas keys
- O sistema faz fallback automático

---

## 📞 **Precisa de Ajuda?**

### **Me envie estas informações:**

1. **Todos os logs** do console (após clicar "Salvar Chave")
2. **Resultado do teste manual** da API key
3. **Região** onde você está
4. **Tipo de conta** Google (pessoal ou workspace)

### **Exemplo de logs úteis:**

```
🔑 Testando API key: AIzaSyXXX...
📋 Listando modelos disponíveis...
📊 Modelos disponíveis: ["gemini-1.5-flash", "gemini-1.5-pro"]
🧪 Testando gemini-1.5-pro-latest...
📨 Status gemini-1.5-pro-latest: 404
❌ gemini-1.5-pro-latest erro: Model not found
🧪 Testando gemini-1.5-pro...
📨 Status gemini-1.5-pro: 200
✅ gemini-1.5-pro respondeu: {...}
```

---

## ✅ **Sucesso!**

Se você ver esta mensagem:
```
✅ Gemini 1.5 Pro conectado! API funcionando perfeitamente!
```

Significa que tudo está configurado corretamente! 🎉
