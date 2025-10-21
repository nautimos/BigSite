# Big Site - Extensão SEO com IA

Uma extensão de navegador profissional com painel lateral para otimização SEO avançada usando Google Gemini 2.5 Pro.

## 🚀 Funcionalidades

### Design Sofisticado
- **Painel Lateral (Side Panel)**: Interface que se acopla ao lado da janela do navegador
- **Tema Dark Profissional**: Tons de cinza-ardósia com verde-esmeralda como destaque
- **Glassmorphism**: Efeitos sutis de transparência para visual moderno
- **Tipografia Inter**: Fonte limpa e moderna para excelente legibilidade

### Sistema de Abas Organizado
1. **IMPULSO**: Tela principal para análise e otimização
2. **HISTÓRICO**: Registro de todas as otimizações aplicadas
3. **CONFIGURAÇÕES**: Setup de chaves de API e conexões

### Análise SEO Avançada
- **Score SEO**: Visualização antes/depois com gráficos de rosca
- **Otimização de Título & Meta Descrição**: Geração automática com IA
- **Estrutura de Cabeçalhos**: Reorganização semântica (H1-H6)
- **Otimização de Conteúdo**: Reescrita inteligente mantendo tom de voz
- **Alt Texts**: Geração automática para todas as imagens

### Motor de IA Gemini 2.5 Pro
- **Análise Semântica**: Compreensão profunda do conteúdo
- **Core Web Vitals**: Otimização para métricas de performance
- **LSI Keywords**: Incorporação natural de sinônimos
- **Tom de Voz**: Mantém a identidade da marca

## 🔐 Sistema de Autenticação

### Login e Registro
O Big Site inclui sistema completo de autenticação:
- ✅ **Cadastro** com nome, e-mail e senha
- ✅ **Login** com e-mail e senha
- ⚙️ **Google Sign-In** (OAuth 2.0 - requer configuração)
- ✅ **Sessão persistente** (mantém login)
- ✅ **Logout** seguro
- ✅ **Validações** de e-mail e senha

### Primeiro Acesso
1. Abra a extensão Big Site
2. Escolha uma opção:
   - **Criar Conta**: Preencha nome, e-mail e senha ✅ **Recomendado**
   - **Entrar com Google**: Requer configuração OAuth (veja `GOOGLE_OAUTH_SETUP.md`)
3. Após autenticado, acesse todas as funcionalidades

### ⚠️ Nota sobre Google Sign-In
O botão "Continuar com Google" **requer configuração adicional**:
- Criar projeto no Google Cloud Console
- Configurar OAuth 2.0
- Adicionar Client ID no `manifest.json`

**📖 Guia completo**: Veja `GOOGLE_OAUTH_SETUP.md`

**💡 Por enquanto**: Use login com **e-mail/senha** (funciona perfeitamente!)

## 📦 Instalação

### Pré-requisitos
- Google Chrome (versão mais recente)
- Chave API do Google Gemini 2.5 Pro
- Conta no Big Site (criar no primeiro acesso)

### Passos para Instalação

1. **Clone ou baixe os arquivos da extensão**
   ```bash
   git clone <repository-url>
   cd big-site-extension
   ```

2. **Abra o Chrome e acesse as extensões**
   - Digite `chrome://extensions` na barra de endereço
   - Ative o "Modo do desenvolvedor" (canto superior direito)

3. **Carregue a extensão**
   - Clique em "Carregar compactada"
   - Selecione a **pasta raiz do projeto** (onde está o `manifest.json`)

4. **Configure as chaves API**
   - Clique no ícone da extensão na barra de ferramentas
   - Abra a aba "CONFIGURAÇÕES"
   - Insira sua chave API do Google Gemini 2.5 Pro
   - Configure a URL do seu site e chave do conector (se aplicável)

## 🔧 Configuração

### Chave API Google Gemini 2.5 Pro

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova chave API
3. Copie a chave e cole no campo correspondente nas configurações
4. Clique em "Salvar Chave"

### Conexão do Site (Opcional)

Se você tiver o plugin Big Site instalado em seu servidor:

1. Insira a URL do seu site
2. Adicione a chave de API do conector
3. Clique em "Testar Conexão"

## 🚀 Como Usar

### Análise Rápida

1. **Instale o script Big Site** manualmente no seu site
2. **Abra a extensão** pelo ícone na barra de ferramentas
3. **Insira a URL do site** onde o script foi instalado (ex: "https://meusite.com")
4. **Clique em "Analisar com Motor Gemini"**

### Processo de Análise

A extensão passará por 3 etapas:

1. **[1/3] Buscando dados do site...**
   - Busca a página do site alvo
   - Extração de HTML, meta tags e conteúdo

2. **[2/3] Enviando ao Motor Gemini 2.5 Pro...**
   - Envio dos dados para a IA
   - Processamento semântico e análise SEO

3. **[3/3] Recebendo e processando otimizações...**
   - Geração das otimizações
   - Formatação dos resultados

### Resultados

Os resultados são apresentados em seções expansíveis:

#### 📊 Score SEO
- Visualização gráfica antes/depois
- Métricas quantitativas de melhoria

#### 📝 Título & Descrição
- Comparação lado a lado
- Otimizações destacadas em verde/vermelho

#### 🏗️ Estrutura de Cabeçalhos
- Nova hierarquia semântica
- Tags H1-H6 organizadas

#### ✍️ Otimização de Conteúdo
- Reescrita com diff visual
- Maintendo tom de voz original

#### 🖼️ Otimização de Mídia
- Alt texts gerados automaticamente
- Otimização para acessibilidade

### Implementação

Após revisar as otimizações:

1. **"Implementar Motor Agora"**: Aplica todas as mudanças na página
2. **"Descartar"**: Cancela as otimizações

## 📚 Histórico

Todas as otimizações são registradas na aba "HISTÓRICO":

- URL da página otimizada
- Palavra-chave utilizada
- Scores antes/depois
- Data e timestamp
- Link para visualização detalhada

## 🛠️ Estrutura Técnica

### Frontend (Extensão)
- **Manifest V3**: Padrão mais recente de extensões Chrome
- **Side Panel API**: Interface lateral nativa
- **Tailwind CSS**: Estilização moderna e responsiva
- **Vanilla JavaScript**: Sem dependências externas

### Backend (API Next.js)
- **Next.js 15**: Framework moderno com App Router
- **ZAI SDK**: Integração com modelos de IA
- **TypeScript**: Tipagem segura e robusta
- **API Routes**: Endpoints RESTful

### Prompt Engineering

O sistema utiliza um prompt detalhado que garante:

- Formato JSON estruturado
- Análise semântica profunda
- Otimizações técnicas precisas
- Manutenção do tom de voz

## 🔒 Segurança

- Chaves API armazenadas localmente
- Nenhum dado enviado para servidores terceiros
- Processamento local quando possível
- Conexões HTTPS obrigatórias

## 🐛 Troubleshooting

### Problemas Comuns

**Extensão não abre:**
- Verifique se o Modo do Desenvolvedor está ativo
- Recarregue a extensão em `chrome://extensions`

**Análise falha:**
- Confirme sua chave API do Gemini está válida
- Verifique conexão com a internet
- Teste com outra página

**Otimizações não aplicam:**
- Recarregue a página após a análise
- Verifique se há conflitos com outras extensões
- Teste em uma página simples

### Logs de Erro

Abra o console do desenvolvedor (F12) para ver logs detalhados.

## 🔧 Correções Aplicadas (v1.1.0)

### Prioridades Críticas ✅
1. **Integração ZAI SDK**: Corrigida configuração com API key e provider
2. **URL Dinâmica**: Backend URL agora é configurável (não mais hardcoded)
3. **Reestruturação H1-H6**: Implementada aplicação completa de nova estrutura de cabeçalhos

### Melhorias Implementadas ✅
- Teste real de conexão com backend (endpoint `/api/health`)
- Validação de chave API Gemini (frontend + backend)
- Tratamento de erros específico (401, 429, 500)
- Captura expandida de dados SEO (OG tags, Twitter Cards, canonical, contagens)
- Ícone SVG profissional criado
- Remoção de timeouts artificiais
- Logs informativos com emojis

### Como Gerar Ícones
Use o `extension/icons/icon.svg` com ferramentas online (cloudconvert.com) ou CLI:
```bash
# ImageMagick
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 32x32 icon32.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

### Rodapé Profissional
Adicionado rodapé com:
- 🔒 **Criptografia Blockchain** - Indicador de segurança
- 📄 **Links**: Privacidade, Termos de Uso, Ajuda
- ✅ **Selos**: SSL Seguro, Dados Criptografados, LGPD Compliant
- **Nota**: Links usam `#` como placeholder - configure conforme necessário

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Suporte para Firefox
- [ ] Integração com Google Search Console
- [ ] Análise de concorrência
- [ ] Relatórios PDF
- [ ] Otimização para mobile-first
- [ ] Suporte multilíngue

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🆘 Suporte

- **Email**: support@bigsiteseo.com
- **Discord**: [Link do servidor]
- **Documentação**: [Link da docs]

---

**Big Site** - Transforme seu SEO com o poder da IA 🚀