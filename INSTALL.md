# 🚀 Guia de Instalação Rápida - Big Site Extension

## Passo 1: Preparar a Extensão

A extensão já está criada na pasta `extension/` com todos os arquivos necessários:

```
extension/
├── manifest.json          # Configuração da extensão
├── background.js          # Script em background
├── sidepanel.html         # Interface do painel lateral
├── sidepanel.js           # Lógica da interface
├── content.js             # Script para páginas
├── inject.js              # Script injetado
└── icons/                 # Ícones da extensão
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## Passo 2: Instalar no Chrome

1. **Abra o Chrome** e digite `chrome://extensions` na barra de endereço
2. **Ative o "Modo do desenvolvedor"** (botão no canto superior direito)
3. **Clique em "Carregar compactada"** (botão superior esquerdo)
4. **Selecione a pasta raiz do projeto** (onde está o `manifest.json`)
5. **Extensão instalada!** O ícone do foguete verde aparecerá na barra de ferramentas

## Passo 3: Configurar a Chave API

1. **Clique no ícone da extensão** (foguete verde)
2. **Abra a aba "CONFIGURAÇÕES"**
3. **Obtenha sua chave API do Gemini:**
   - Acesse: https://makersuite.google.com/app/apikey
   - Clique em "Create API Key"
   - Copie a chave gerada
4. **Cole a chave** no campo "Chave de API (Google Gemini 2.5 Pro)"
5. **Clique em "Salvar Chave"**

## Passo 4: Testar a Extensão

1. **Abra a página de teste:** `file:///path/to/project/test-page.html`
2. **Clique no ícone da extensão** para abrir o painel lateral
3. **Na aba "IMPULSO":**
   - Insira uma palavra-chave (ex: "desenvolvedor web profissional")
   - Clique em "Analisar com Motor Gemini"
4. **Aguarde o processamento** e veja os resultados!

## Funcionalidades Demonstradas

### ✅ Interface Profissional
- Painel lateral com tema dark sofisticado
- Sistema de abas organizado
- Animações e transições suaves

### ✅ Análise SEO Completa
- Score SEO com visualização gráfica
- Otimização de título e meta descrição
- Reestruturação de cabeçalhos (H1-H6)
- Otimização de conteúdo com IA
- Geração automática de alt texts

### ✅ Sistema de Implementação
- Aplicação direta das otimizações
- Histórico de mudanças
- Configurações persistentes

## 🎯 Dicas de Uso

### Para Melhores Resultados:

1. **Palavra-chave especÍfica:** Use termos long-tail (ex: "desenvolvedor full stack salvador" em vez de apenas "desenvolvedor")

2. **Página com conteúdo:** A extensão funciona melhor em páginas com texto substancial

3. **Revise as sugestões:** Sempre verifique se as otimizações mantêm o sentido original

### Navegação:
- **IMPULSO:** Onde a mágica acontece - análise e otimização
- **HISTÓRICO:** Veja todas as otimizações anteriores
- **CONFIGURAÇÕES:** Gerencie suas chaves API

## 🔧 Backend API

O backend Next.js já está configurado em:
- **Endpoint:** `http://localhost:3000/api/seo/analyze`
- **Tecnologia:** Next.js 15 + ZAI SDK + Gemini 2.5 Pro
- **Prompt System:** Engineered para resultados estruturados em JSON

## 🚀 Ready to Go!

Sua extensão **Big Site** está pronta para uso! 

**Próximos passos:**
- Teste em diferentes páginas
- Experimente várias palavras-chave
- Explore o histórico de otimizações
- Configure múltiplos sites

---

**Big Site** - SEO avançado com o poder da IA! 🌟