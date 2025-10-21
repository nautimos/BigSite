// Side Panel JavaScript
class BigSiteExtension {
    constructor() {
        this.currentTab = 'impulso';
        this.isAnalyzing = false;
        this.currentOptimizations = null;
        this.history = [];
        this.currentUser = null;
        
        this.init();
    }

    async init() {
        // Check if user is logged in
        await this.checkAuth();
        
        this.setupEventListeners();
        this.setupAuthListeners();
        
        if (this.currentUser) {
            // SOLUÇÃO INTELIGENTE: Aplicada também no init
            console.log('User already logged in, showing main app...');
            this.showMainApp();
            setTimeout(() => this.showMainApp(), 100);
            setTimeout(() => this.forceShowMainApp(), 500);
            setTimeout(() => {
                this.loadStoredData();
                this.updateConnectionStatus();
                this.switchTab('impulso');
            }, 600);
        }
    }

    async checkAuth() {
        try {
            const data = await chrome.storage.local.get(['currentUser']);
            if (data.currentUser) {
                this.currentUser = data.currentUser;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking auth:', error);
            return false;
        }
    }

    setupAuthListeners() {
        // Show/Hide forms
        document.getElementById('showRegisterBtn')?.addEventListener('click', () => {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        });

        document.getElementById('showLoginBtn')?.addEventListener('click', () => {
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        });

        // Login
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            this.handleLogin();
        });

        // Register
        document.getElementById('registerBtn')?.addEventListener('click', () => {
            this.handleRegister();
        });

        document.getElementById('showRegisterBtn').addEventListener('click', () => {
            this.showRegister();
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Enter key on login
        document.getElementById('loginPassword')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        // Enter key on register
        document.getElementById('registerPasswordConfirm')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleRegister();
        });
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('E-mail inválido', 'error');
            return;
        }

        try {
            // Get backend URL
            const data = await chrome.storage.local.get(['backendApiUrl']);
            const backendUrl = data.backendApiUrl || 'http://127.0.0.1:3000';

            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                this.currentUser = result.user;
                await chrome.storage.local.set({ currentUser: result.user });
                this.showNotification('Login realizado com sucesso!', 'success');
                
                // SOLUÇÃO INTELIGENTE: Aplicada também no login normal
                this.showMainApp();
                setTimeout(() => this.showMainApp(), 100);
                setTimeout(() => this.forceShowMainApp(), 500);
                setTimeout(() => {
                    this.loadStoredData();
                    this.updateConnectionStatus();
                    this.switchTab('impulso');
                }, 600);
            } else {
                this.showNotification(result.error || 'Erro ao fazer login', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Erro ao conectar com servidor', 'error');
        }
    }

    async handleRegister() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        if (!name || !email || !password || !passwordConfirm) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('E-mail inválido', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('A senha deve ter no mínimo 6 caracteres', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            this.showNotification('As senhas não coincidem', 'error');
            return;
        }

        try {
            // Get backend URL
            const data = await chrome.storage.local.get(['backendApiUrl']);
            const backendUrl = data.backendApiUrl || 'http://127.0.0.1:3000';

            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const result = await response.json();

            if (result.success) {
                this.currentUser = result.user;
                await chrome.storage.local.set({ currentUser: result.user });
                this.showNotification('Conta criada com sucesso!', 'success');
                
                // SOLUÇÃO INTELIGENTE: Aplicada também no registro
                this.showMainApp();
                setTimeout(() => this.showMainApp(), 100);
                setTimeout(() => this.forceShowMainApp(), 500);
                setTimeout(() => {
                    this.loadStoredData();
                    this.updateConnectionStatus();
                    this.switchTab('impulso');
                }, 600);
            } else {
                this.showNotification(result.error || 'Erro ao criar conta', 'error');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showNotification('Erro ao conectar com servidor', 'error');
        }
    }

    async handleLogout() {
        try {
            await chrome.storage.local.remove(['currentUser']);
            this.currentUser = null;

            // SOLUÇÃO ROBUSTA: Garantir que volta para tela de login
            this.showAuthScreen();
            setTimeout(() => this.showAuthScreen(), 100);
            setTimeout(() => this.forceShowAuthScreen(), 500);
            
            this.showNotification('Logout realizado com sucesso', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Erro ao fazer logout', 'error');
        }
    }

    showMainApp() {
        console.log('showMainApp called');
        console.log('authScreen element:', document.getElementById('authScreen'));
        console.log('mainApp element:', document.getElementById('mainApp'));
        
        const authScreen = document.getElementById('authScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (authScreen) {
            authScreen.classList.add('hidden');
            console.log('authScreen hidden');
        } else {
            console.error('authScreen element not found!');
        }
        
        if (mainApp) {
            mainApp.classList.remove('hidden');
            console.log('mainApp shown');
        } else {
            console.error('mainApp element not found!');
        }
        
        // Update user info in header
        if (this.currentUser) {
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            
            if (userName) userName.textContent = this.currentUser.name;
            if (userEmail) userEmail.textContent = this.currentUser.email;
            
            console.log('User info updated:', this.currentUser.name, this.currentUser.email);
        } else {
            console.warn('currentUser is not set');
        }
    }

    forceShowMainApp() {
        console.log('FORCE SHOW MAIN APP - Aggressive mode');
        
        // Método 1: Por ID direto
        const authScreen = document.getElementById('authScreen');
        const mainApp = document.getElementById('mainApp');
        
        // Método 2: Por query selector como fallback
        const authScreenQuery = document.querySelector('#authScreen');
        const mainAppQuery = document.querySelector('#mainApp');
        
        // Força esconder auth screen de todas as formas possíveis
        [authScreen, authScreenQuery].forEach(elem => {
            if (elem) {
                elem.classList.add('hidden');
                elem.style.display = 'none !important';
                elem.style.visibility = 'hidden';
                elem.style.opacity = '0';
                elem.style.position = 'absolute';
                elem.style.left = '-9999px';
                console.log('Auth screen forcefully hidden');
            }
        });
        
        // Força mostrar main app de todas as formas possíveis
        [mainApp, mainAppQuery].forEach(elem => {
            if (elem) {
                elem.classList.remove('hidden');
                elem.style.display = 'flex';
                elem.style.visibility = 'visible';
                elem.style.opacity = '1';
                elem.style.position = 'relative';
                elem.style.left = '0';
                console.log('Main app forcefully shown');
            }
        });
        
        // Atualiza informações do usuário
        if (this.currentUser) {
            const userNameElems = [
                document.getElementById('userName'),
                document.querySelector('#userName')
            ];
            const userEmailElems = [
                document.getElementById('userEmail'),
                document.querySelector('#userEmail')
            ];
            
            userNameElems.forEach(elem => {
                if (elem) elem.textContent = this.currentUser.name;
            });
            userEmailElems.forEach(elem => {
                if (elem) elem.textContent = this.currentUser.email;
            });
            
            console.log('User info forcefully updated');
        }
        
        // Força redraw do DOM
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        console.log('DOM reflow triggered');
    }

    forceShowAuthScreen() {
        console.log('FORCE SHOW AUTH SCREEN - Aggressive mode');
        
        // Método 1: Por ID direto
        const authScreen = document.getElementById('authScreen');
        const mainApp = document.getElementById('mainApp');
        
        // Método 2: Por query selector como fallback
        const authScreenQuery = document.querySelector('#authScreen');
        const mainAppQuery = document.querySelector('#mainApp');
        
        // Força esconder main app de todas as formas possíveis
        [mainApp, mainAppQuery].forEach(elem => {
            if (elem) {
                elem.classList.add('hidden');
                elem.style.display = 'none !important';
                elem.style.visibility = 'hidden';
                elem.style.opacity = '0';
                elem.style.position = 'absolute';
                elem.style.left = '-9999px';
                console.log('Main app forcefully hidden');
            }
        });
        
        // Força mostrar auth screen de todas as formas possíveis
        [authScreen, authScreenQuery].forEach(elem => {
            if (elem) {
                elem.classList.remove('hidden');
                elem.style.display = 'block';
                elem.style.visibility = 'visible';
                elem.style.opacity = '1';
                elem.style.position = 'relative';
                elem.style.left = '0';
                console.log('Auth screen forcefully shown');
            }
        });
        
        // Limpar formulários
        ['loginEmail', 'loginPassword', 'registerName', 'registerEmail', 'registerPassword', 'registerPasswordConfirm'].forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.value = '';
        });
        
        // Força redraw do DOM
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        console.log('DOM reflow triggered for auth screen');
    }

    showAuthScreen() {
        const mainApp = document.getElementById('mainApp');
        const authScreen = document.getElementById('authScreen');
        
        if (mainApp) {
            mainApp.classList.add('hidden');
            mainApp.style.display = 'none';
        }
        if (authScreen) {
            authScreen.classList.remove('hidden');
            authScreen.style.display = 'block';
        }
        
        // Clear form fields
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerPasswordConfirm').value = '';
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Função de debug para limpar todo o cache
    async clearAllCache() {
        console.log('🧹 Limpando todo o cache...');
        
        // Limpar storage local
        await chrome.storage.local.clear();
        console.log('✅ Storage local limpo');
        
        // Limpar variáveis locais
        this.currentUser = null;
        this.currentOptimizations = null;
        this.history = [];
        
        console.log('✅ Cache completamente limpo');
        this.showNotification('🧹 Cache limpo! Recarregue a extensão.', 'success');
        
        // Forçar volta para tela de login
        setTimeout(() => {
            this.forceShowAuthScreen();
        }, 100);
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Analyze button
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.startAnalysis();
        });

        // Implement button
        document.getElementById('implementBtn').addEventListener('click', () => {
            this.implementOptimizations();
        });

        // Discard button
        document.getElementById('discardBtn').addEventListener('click', () => {
            this.discardOptimizations();
        });

        // Settings buttons
        document.getElementById('testConnectionBtn').addEventListener('click', () => {
            this.testSiteConnection();
        });

        document.getElementById('saveGeminiKeyBtn').addEventListener('click', () => {
            this.saveGeminiKey();
        });

        document.getElementById('saveBackendUrlBtn').addEventListener('click', () => {
            this.saveBackendUrl();
        });

        // Novo botão para testar backend
        document.getElementById('testBackendBtn')?.addEventListener('click', () => {
            this.testBackendConnection();
        });

        document.getElementById('generateScriptBtn').addEventListener('click', () => {
            this.generateInstallationScript();
        });

        document.getElementById('copyApiKeyBtn')?.addEventListener('click', () => {
            this.copyToClipboard(document.getElementById('connectorApiKey').value, 'Chave API copiada!');
        });

        document.getElementById('copyScriptBtn')?.addEventListener('click', () => {
            this.copyToClipboard(document.getElementById('generatedScript').value, 'Script copiado!');
        });

        // Modal links - Termos de Uso
        document.getElementById('termsLinkLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('termsModal');
        });
        document.getElementById('termsLinkRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('termsModal');
        });
        document.getElementById('termsLinkFooter')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('termsModal');
        });

        // Modal links - Política de Privacidade
        document.getElementById('privacyLinkLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('privacyModal');
        });
        document.getElementById('privacyLinkRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('privacyModal');
        });
        document.getElementById('privacyLinkFooter')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('privacyModal');
        });

        // Modal links - Ajuda
        document.getElementById('helpLinkFooter')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('helpModal');
        });

        // Modal close buttons
        document.getElementById('closeTermsModal')?.addEventListener('click', () => {
            this.hideModal('termsModal');
        });
        document.getElementById('closeTermsModalBtn')?.addEventListener('click', () => {
            this.hideModal('termsModal');
        });

        document.getElementById('closePrivacyModal')?.addEventListener('click', () => {
            this.hideModal('privacyModal');
        });
        document.getElementById('closePrivacyModalBtn')?.addEventListener('click', () => {
            this.hideModal('privacyModal');
        });

        document.getElementById('closeHelpModal')?.addEventListener('click', () => {
            this.hideModal('helpModal');
        });
        document.getElementById('closeHelpModalBtn')?.addEventListener('click', () => {
            this.hideModal('helpModal');
        });

        // Close modals when clicking outside
        ['termsModal', 'privacyModal', 'helpModal'].forEach(modalId => {
            document.getElementById(modalId)?.addEventListener('click', (e) => {
                if (e.target.id === modalId) {
                    this.hideModal(modalId);
                }
            });
        });
    }

    showModal(modalId) {
        document.getElementById(modalId)?.classList.remove('hidden');
    }

    hideModal(modalId) {
        document.getElementById(modalId)?.classList.add('hidden');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('tab-active');
                btn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-700');
            } else {
                btn.classList.remove('tab-active');
                btn.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-700');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');

        this.currentTab = tabName;
    }

    async loadStoredData() {
        try {
            const data = await chrome.storage.local.get([
                'geminiApiKey', 
                'siteUrl', 
                'connectorApiKey', 
                'generatedScript',
                'backendApiUrl', 
                'history'
            ]);
            
            if (data.geminiApiKey) {
                document.getElementById('geminiApiKey').value = data.geminiApiKey;
            }
            if (data.siteUrl) {
                document.getElementById('siteUrl').value = data.siteUrl;
            }
            if (data.connectorApiKey && data.generatedScript) {
                // Show previously generated script
                document.getElementById('connectorApiKey').value = data.connectorApiKey;
                document.getElementById('generatedScript').value = data.generatedScript;
                document.getElementById('generatedScriptSection').classList.remove('hidden');
            }
            if (data.backendApiUrl) {
                document.getElementById('backendApiUrl').value = data.backendApiUrl;
            } else {
                // Set default value
                document.getElementById('backendApiUrl').value = 'http://127.0.0.1:3000';
            }
            if (data.history) {
                this.history = data.history;
                this.updateHistoryDisplay();
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }

    async saveGeminiKey() {
        const apiKey = document.getElementById('geminiApiKey').value.trim();
        
        if (!apiKey) {
            this.showNotification('Por favor, insira uma chave de API válida', 'error');
            return;
        }

        // Validate API key format
        if (!apiKey.startsWith('AIza')) {
            this.showNotification('Formato de chave inválido. Chaves Gemini começam com "AIza"', 'error');
            return;
        }

        this.showNotification('🔍 Detectando modelo Gemini compatível...', 'info');
        console.log('🔑 Testando API key:', apiKey.substring(0, 15) + '...');

        try {
            // PRIMEIRO: Listar modelos disponíveis
            console.log('📋 Listando modelos disponíveis na sua API key...');
            
            try {
                const listResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
                );
                
                if (listResponse.ok) {
                    const listData = await listResponse.json();
                    const availableModels = listData.models?.map(m => m.name.replace('models/', '')) || [];
                    console.log('📊 Modelos disponíveis:', availableModels);
                    
                    if (availableModels.length === 0) {
                        this.showNotification('⚠️ API key válida mas nenhum modelo disponível. Verifique permissões.', 'warning');
                        return;
                    }
                } else {
                    const errorData = await listResponse.json();
                    console.error('❌ Erro ao listar modelos:', errorData);
                    
                    if (errorData.error?.message?.includes('API key not valid')) {
                        this.showNotification('❌ API key inválida! Verifique se copiou corretamente.', 'error');
                        return;
                    }
                }
            } catch (listError) {
                console.warn('⚠️ Não foi possível listar modelos, tentando testar diretamente:', listError);
            }

            // Sistema inteligente: testa vários modelos até encontrar um que funcione
            // Modelos OFICIAIS conforme documentação: https://ai.google.dev/gemini-api/docs/models
            const modelsToTest = [
                { name: 'gemini-2.5-pro', endpoint: 'v1beta', display: 'Gemini 2.5 Pro' },
                { name: 'gemini-2.5-flash', endpoint: 'v1beta', display: 'Gemini 2.5 Flash' }
            ];

            let workingModel = null;
            let lastError = null;

            for (const model of modelsToTest) {
                console.log(`🧪 Testando ${model.name}...`);
                
                const testUrl = `https://generativelanguage.googleapis.com/${model.endpoint}/models/${model.name}:generateContent?key=${apiKey}`;
                console.log(`📡 URL: ${testUrl.replace(apiKey, 'API_KEY_HIDDEN')}`);
                
                try {
                    const testResponse = await fetch(testUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: "Hi"
                                }]
                            }],
                            generationConfig: {
                                maxOutputTokens: 10
                            }
                        })
                    });

                    console.log(`📨 Status ${model.name}: ${testResponse.status}`);
                    
                    if (testResponse.ok) {
                        const responseData = await testResponse.json();
                        console.log(`✅ ${model.name} respondeu:`, responseData);
                        workingModel = model;
                        break;
                    } else {
                        const errorData = await testResponse.json();
                        lastError = errorData.error?.message || 'Unknown error';
                        console.log(`❌ ${model.name} erro:`, lastError);
                    }
                } catch (e) {
                    lastError = e.message;
                    console.log(`❌ ${model.name} exceção:`, e);
                }
            }

            if (workingModel) {
                // API key válida e modelo encontrado!
                await chrome.storage.local.set({ 
                    geminiApiKey: apiKey,
                    geminiApiVerified: true,
                    geminiApiModel: workingModel.name,
                    geminiApiEndpoint: workingModel.endpoint,
                    geminiApiLastTest: new Date().toISOString()
                });
                
                this.showNotification(`✅ ${workingModel.display} conectado! API funcionando perfeitamente!`, 'success');
                this.updateConnectionStatus();
                
                console.log('🤖 Gemini API Info:');
                console.log(`- Model: ${workingModel.name}`);
                console.log(`- Endpoint: ${workingModel.endpoint}`);
                console.log('- Status: Active');
                console.log('- Last verified:', new Date().toLocaleString());
            } else {
                // Nenhum modelo funcionou
                console.error('💥 Nenhum modelo funcionou!');
                console.error('🔍 Último erro:', lastError);
                this.showNotification(`❌ Nenhum modelo disponível. Último erro: ${lastError || 'Desconhecido'}`, 'error');
            }
            
        } catch (error) {
            console.error('Error testing Gemini API key:', error);
            
            if (error.message.includes('Failed to fetch')) {
                this.showNotification('❌ Erro de rede. Verifique sua conexão com a internet.', 'error');
            } else {
                this.showNotification(`❌ Erro ao verificar chave: ${error.message}`, 'error');
            }
        }
    }

    async saveBackendUrl() {
        const backendUrl = document.getElementById('backendApiUrl').value.trim();
        
        if (!backendUrl) {
            this.showNotification('Por favor, insira uma URL válida', 'error');
            return;
        }

        // Validate URL format
        try {
            const url = new URL(backendUrl);
            if (!['http:', 'https:'].includes(url.protocol)) {
                throw new Error('Invalid protocol');
            }
        } catch (error) {
            this.showNotification('URL inválida. Use http:// ou https://', 'error');
            return;
        }

        try {
            await chrome.storage.local.set({ backendApiUrl: backendUrl });
            this.showNotification('URL do backend salva com sucesso!', 'success');
        } catch (error) {
            console.error('Error saving backend URL:', error);
            this.showNotification('Erro ao salvar URL', 'error');
        }
    }

    async testBackendConnection() {
        const backendUrl = document.getElementById('backendApiUrl').value.trim() || 'http://127.0.0.1:3000';
        
        this.showNotification('Testando conexão com backend...', 'info');

        try {
            // Test backend API health endpoint
            const response = await fetch(`${backendUrl}/api/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });

            if (response.ok) {
                const data = await response.json();
                this.showNotification(`✅ Backend conectado! Status: ${data.status || 'OK'}`, 'success');
                this.updateConnectionStatus();
            } else {
                this.showNotification(`❌ Backend respondeu com erro: ${response.status}`, 'error');
            }
        } catch (error) {
            console.error('Error testing backend connection:', error);
            if (error.name === 'TimeoutError') {
                this.showNotification('❌ Timeout: Backend não respondeu em 5 segundos', 'error');
            } else if (error.message.includes('Failed to fetch')) {
                this.showNotification('❌ Não foi possível conectar ao backend. Verifique se está rodando.', 'error');
            } else {
                this.showNotification(`❌ Erro ao testar conexão: ${error.message}`, 'error');
            }
        }
    }

    async testSiteConnection() {
        const siteUrl = document.getElementById('siteUrl').value.trim();
        
        if (!siteUrl) {
            this.showNotification('Por favor, insira a URL do site onde você instalou o script', 'error');
            return;
        }

        // Validate URL format
        try {
            const url = new URL(siteUrl);
            if (!['http:', 'https:'].includes(url.protocol)) {
                throw new Error('Invalid protocol');
            }
        } catch (error) {
            this.showNotification('URL inválida. Use http:// ou https://', 'error');
            return;
        }

        this.showNotification('🔍 Verificando se o script Big Site está instalado...', 'info');

        try {
            // Get stored connector API key
            const data = await chrome.storage.local.get(['connectorApiKey']);
            const apiKey = data.connectorApiKey;

            if (!apiKey) {
                this.showNotification('⚠️ Você precisa gerar o script primeiro! Clique em "Gerar Script de Instalação"', 'error');
                return;
            }

            // Tenta injetar um script na página para verificar se o Big Site está instalado
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Criar uma nova aba com o site do usuário
            const tab = await chrome.tabs.create({ url: siteUrl, active: false });
            
            // Aguardar a página carregar
            await new Promise((resolve) => {
                chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                    if (tabId === tab.id && info.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(listener);
                        resolve();
                    }
                });
            });

            // Injetar script para verificar se Big Site está instalado
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    // Verificar se o objeto BigSiteConfig existe (criado pelo nosso script)
                    return {
                        hasBigSite: typeof window.BigSiteConfig !== 'undefined',
                        config: window.BigSiteConfig || null
                    };
                }
            });

            // Fechar a aba de teste
            chrome.tabs.remove(tab.id);

            const result = results[0].result;
            
            if (result.hasBigSite) {
                // Verificar se a API key corresponde
                if (result.config && result.config.apiKey === apiKey) {
                    this.showNotification('✅ Script Big Site detectado e configurado corretamente!', 'success');
                    
                    // Salvar URL do site como configurado
                    await chrome.storage.local.set({ 
                        configuredSiteUrl: siteUrl,
                        siteConnected: true 
                    });
                } else {
                    this.showNotification('⚠️ Script Big Site detectado mas com API key diferente!', 'warning');
                }
            } else {
                this.showNotification('❌ Script Big Site NÃO encontrado! Por favor, instale o script no site.', 'error');
            }
        } catch (error) {
            console.error('Error testing site connection:', error);
            
            if (error.message.includes('Cannot access')) {
                this.showNotification('❌ Não foi possível acessar o site. Verifique se a URL está correta e acessível.', 'error');
            } else {
                this.showNotification(`❌ Erro ao verificar script no site: ${error.message}`, 'error');
            }
        }
    }

    // Alias para compatibilidade (será removido em versão futura)
    async testConnection() {
        // Redireciona para a função correta baseado no contexto
        console.warn('testConnection() está deprecado. Use testSiteConnection() ou testBackendConnection()');
        await this.testSiteConnection();
    }

    async updateConnectionStatus() {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        if (!statusDot || !statusText) {
            console.warn('Status elements not found');
            return;
        }
        
        // Verificar múltiplos critérios de conexão
        const data = await chrome.storage.local.get([
            'currentUser', 
            'geminiApiKey', 
            'geminiApiVerified',
            'geminiApiLastTest',
            'backendApiUrl'
        ]);
        
        // Determinar status detalhado
        const hasUser = !!(this.currentUser || data.currentUser);
        const hasApiKey = !!data.geminiApiKey;
        const apiVerified = !!data.geminiApiVerified;
        
        // Remove todas as classes de cor primeiro
        statusDot.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-emerald-500');
        
        if (hasUser && apiVerified) {
            // Tudo conectado e verificado!
            statusDot.classList.add('bg-emerald-500');
            statusText.textContent = '✅ Totalmente Conectado';
            statusText.title = 'Usuário logado e Gemini API verificada';
            console.log('📡 Status: Totalmente conectado (User + Gemini verificado)');
            
        } else if (hasUser && hasApiKey && !apiVerified) {
            // Usuário logado mas API não verificada
            statusDot.classList.add('bg-yellow-500');
            statusText.textContent = '⚠️ API Não Verificada';
            statusText.title = 'Salve a chave API novamente para verificar';
            console.log('⚠️ Status: Parcialmente conectado (API não verificada)');
            
        } else if (hasUser && !hasApiKey) {
            // Apenas usuário logado
            statusDot.classList.add('bg-yellow-500');
            statusText.textContent = '👤 Usuário Conectado';
            statusText.title = 'Configure a API Gemini para análise SEO';
            console.log('👤 Status: Apenas usuário conectado');
            
        } else if (!hasUser && apiVerified) {
            // Apenas API verificada (sem usuário)
            statusDot.classList.add('bg-emerald-500');
            statusText.textContent = '🤖 Gemini Conectado';
            statusText.title = 'API Gemini verificada e funcionando';
            console.log('🤖 Status: Apenas Gemini conectado');
            
        } else if (!hasUser && hasApiKey && !apiVerified) {
            // API não verificada e sem usuário
            statusDot.classList.add('bg-yellow-500');
            statusText.textContent = '⚠️ API Não Verificada';
            statusText.title = 'Faça login e verifique a API';
            console.log('⚠️ Status: API não verificada');
            
        } else {
            // Nada conectado
            statusDot.classList.add('bg-red-500');
            statusText.textContent = '❌ Desconectado';
            statusText.title = 'Faça login e configure a API';
            console.log('❌ Status: Totalmente desconectado');
        }
        
        // Se API foi testada, mostrar última verificação
        if (data.geminiApiLastTest) {
            const lastTest = new Date(data.geminiApiLastTest);
            console.log('🕐 Última verificação da API:', lastTest.toLocaleString());
        }
    }

    async startAnalysis() {
        const targetSiteUrl = document.getElementById('targetSiteUrl').value.trim();
        
        if (!targetSiteUrl) {
            this.showNotification('Por favor, insira a URL do site com o script instalado', 'error');
            return;
        }

        // Validate URL format
        try {
            new URL(targetSiteUrl);
        } catch (error) {
            this.showNotification('URL inválida. Use o formato: https://meusite.com', 'error');
            return;
        }

        // Verificar se temos a chave API e se ela foi validada
        const apiData = await chrome.storage.local.get(['geminiApiKey', 'geminiApiVerified']);
        
        if (!apiData.geminiApiKey) {
            this.showNotification('❌ Configure sua chave API do Gemini nas Configurações', 'error');
            this.switchTab('configuracoes');
            return;
        }

        if (!apiData.geminiApiVerified) {
            this.showNotification('⚠️ Chave API não verificada. Salvando novamente para validar...', 'warning');
            this.switchTab('configuracoes');
            return;
        }

        console.log('🚀 Iniciando análise SEO REAL com Google Gemini Pro...');
        console.log('📍 Site alvo:', targetSiteUrl);
        console.log('🔑 API Key verificada:', apiData.geminiApiKey.substring(0, 10) + '...');

        this.isAnalyzing = true;
        this.showLoadingState();
        this.showNotification('🤖 Conectando com Google Gemini Pro...', 'info');

        try {
            // Update loading steps
            this.updateLoadingStep(1);
            console.log('📊 Etapa 1/3: Capturando dados do site...');
            
            // Fetch page data from target site
            const pageData = await this.fetchPageDataFromSite(targetSiteUrl);
            console.log('✅ Dados capturados:', {
                url: pageData.url,
                title: pageData.title,
                htmlLength: pageData.html?.length || 0
            });
            
            // Update loading steps
            this.updateLoadingStep(2);
            console.log('🧠 Etapa 2/3: Enviando para análise com Gemini Pro...');
            this.showNotification('🔍 Gemini Pro analisando SEO do site...', 'info');
            
            // Send to backend for analysis (without focus keyword - site-wide analysis)
            const analysisResult = await this.analyzeWithGemini(pageData, null, apiData.geminiApiKey);
            console.log('✅ Análise recebida do Gemini:', analysisResult);
            
            // Update loading steps
            this.updateLoadingStep(3);
            console.log('📝 Etapa 3/3: Processando resultados da IA...');
            
            // Process and display results immediately
            this.displayResults(analysisResult);
            this.hideLoadingState();
            this.isAnalyzing = false;
            
            this.showNotification('✅ Análise SEO concluída com sucesso pelo Gemini Pro!', 'success');
            console.log('🎉 Análise completa! Resultados exibidos.');
            
        } catch (error) {
            console.error('❌ Erro na análise:', error);
            this.showNotification(`❌ Erro: ${error.message}`, 'error');
            this.hideLoadingState();
            this.isAnalyzing = false;
        }
    }

    async fetchPageDataFromSite(targetUrl) {
        try {
            // Get backend URL
            const data = await chrome.storage.local.get(['backendApiUrl']);
            const backendUrl = data.backendApiUrl || 'http://127.0.0.1:3000';
            
            // Backend will fetch and parse the target site
            const response = await fetch(`${backendUrl}/api/seo/fetch-page`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetUrl: targetUrl
                })
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar dados do site: ${response.status}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Falha ao buscar dados do site');
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching page data:', error);
            
            if (error.message.includes('Failed to fetch')) {
                this.showNotification('Não foi possível conectar ao backend. Verifique se está rodando.', 'error');
            } else {
                this.showNotification(`Erro ao buscar site: ${error.message}`, 'error');
            }
            
            throw error;
        }
    }

    async getPageData() {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'getPageData' }, (response) => {
                if (response.success) {
                    resolve(response.data);
                } else {
                    reject(new Error(response.error));
                }
            });
        });
    }

    async analyzeWithGemini(pageData, focusKeyword, apiKey) {
        try {
            // Get backend URL from storage
            const data = await chrome.storage.local.get(['backendApiUrl']);
            const backendUrl = data.backendApiUrl || 'http://127.0.0.1:3000';
            
            const response = await fetch(`${backendUrl}/api/seo/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pageData,
                    focusKeyword,
                    geminiApiKey: apiKey
                })
            });

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Analysis failed');
            }

            return result.data;
        } catch (error) {
            console.error('Error calling backend API:', error);
            
            // Show specific error message to user
            if (error.message.includes('Failed to fetch')) {
                this.showNotification('Não foi possível conectar ao backend. Verifique se está rodando e a URL está correta.', 'error');
            } else {
                this.showNotification(`Erro na análise: ${error.message}`, 'error');
            }
            
            // Return null instead of mock data to properly handle errors
            throw error;
        }
    }

    getMockAnalysisResult() {
        return {
            analise_inicial: {
                score_antes: 45,
                palavra_chave_detectada: "desenvolvimento web",
                resumo_dos_problemas: "Título não otimizado, falta de estrutura semântica e alt texts ausentes"
            },
            seo_head: {
                title_otimizado: "Desenvolvedor Full Stack em Salvador | Serviços Profissionais",
                meta_description_otimizada: "Desenvolvedor full stack em Salvador especializado em aplicações web modernas. Contate para projetos personalizados."
            },
            seo_body: {
                estrutura_de_cabecalhos_ideal: [
                    { tag: "h1", texto: "Desenvolvedor Full Stack em Salvador" },
                    { tag: "h2", texto: "Serviços Oferecidos" },
                    { tag: "h3", texto: "Desenvolvimento Frontend" },
                    { tag: "h3", texto: "Desenvolvimento Backend" },
                    { tag: "h2", texto: "Portfólio" }
                ],
                conteudo_reescrito_html: "<p>Sou um <strong>desenvolvedor full stack em Salvador</strong> com experiência em criar soluções web completas e modernas.</p>",
                imagens_otimizadas: [
                    {
                        src_original: "https://example.com/image1.jpg",
                        alt_otimizado: "Desenvolvedor full stack trabalhando em projeto web em Salvador"
                    }
                ]
            },
            score_final_estimado: 98
        };
    }

    showLoadingState() {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        this.updateLoadingStep(1);
    }

    hideLoadingState() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
    }

    updateLoadingStep(step) {
        const steps = document.querySelectorAll('.step-item');
        const loadingText = document.getElementById('loadingText');
        
        steps.forEach((stepEl, index) => {
            if (index < step) {
                stepEl.classList.remove('opacity-50');
                stepEl.querySelector('i').classList.remove('fa-circle');
                stepEl.querySelector('i').classList.add('fa-check-circle', 'text-emerald-400');
            } else {
                stepEl.classList.add('opacity-50');
                stepEl.querySelector('i').classList.remove('fa-check-circle', 'text-emerald-400');
                stepEl.querySelector('i').classList.add('fa-circle');
            }
        });

        const messages = [
            'Capturando dados da página',
            'Enviando ao Motor Gemini 2.5 Pro',
            'Recebendo e processando otimizações'
        ];
        
        if (step <= messages.length) {
            loadingText.textContent = messages[step - 1];
        }
    }

    displayResults(results) {
        this.currentOptimizations = results;
        
        // Update scores
        this.updateScoreDisplay(results.analise_inicial.score_antes, results.score_final_estimado);
        
        // Display optimization sections
        this.displayOptimizationSections(results);
    }

    updateScoreDisplay(beforeScore, afterScore) {
        // Update before score
        document.getElementById('scoreBeforeText').textContent = beforeScore;
        const beforeCircle = document.getElementById('scoreBefore');
        const beforeOffset = 226 - (226 * beforeScore / 100);
        beforeCircle.style.strokeDashoffset = beforeOffset;
        
        // Update after score
        document.getElementById('scoreAfterText').textContent = afterScore;
        const afterCircle = document.getElementById('scoreAfter');
        const afterOffset = 226 - (226 * afterScore / 100);
        afterCircle.style.strokeDashoffset = afterOffset;
    }

    displayOptimizationSections(results) {
        const container = document.getElementById('optimizationResults');
        container.innerHTML = '';

        // Title & Description section
        const titleSection = this.createAccordionSection('Título & Descrição', 'fa-heading', [
            {
                label: 'Title',
                before: document.title,
                after: results.seo_head.title_otimizado
            },
            {
                label: 'Meta Description',
                before: document.querySelector('meta[name="description"]')?.content || '',
                after: results.seo_head.meta_description_otimizada
            }
        ]);
        container.appendChild(titleSection);

        // Headings structure section
        const headingsSection = this.createHeadingsSection(results.seo_body.estrutura_de_cabecalhos_ideal);
        container.appendChild(headingsSection);

        // Content optimization section
        const contentSection = this.createContentSection(results.seo_body.conteudo_reescrito_html);
        container.appendChild(contentSection);

        // Images optimization section
        if (results.seo_body.imagens_otimizadas.length > 0) {
            const imagesSection = this.createImagesSection(results.seo_body.imagens_otimizadas);
            container.appendChild(imagesSection);
        }
    }

    createAccordionSection(title, icon, items) {
        const section = document.createElement('div');
        section.className = 'glass-morphism rounded-xl overflow-hidden';
        
        section.innerHTML = `
            <button class="accordion-header w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700 transition-colors duration-200">
                <div class="flex items-center">
                    <i class="fas ${icon} mr-3 text-emerald-400"></i>
                    <h3 class="font-semibold text-white">${title}</h3>
                </div>
                <i class="fas fa-chevron-down text-slate-400 transition-transform duration-200"></i>
            </button>
            <div class="accordion-content hidden px-6 pb-4">
                <div class="space-y-4">
                    ${items.map(item => `
                        <div class="border-l-2 border-slate-600 pl-4">
                            <div class="text-sm font-medium text-slate-300 mb-2">${item.label}</div>
                            <div class="space-y-2">
                                <div>
                                    <span class="text-xs text-red-400">Antes:</span>
                                    <p class="text-sm text-slate-400 diff-removed">${item.before || '(vazio)'}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-emerald-400">Depois:</span>
                                    <p class="text-sm text-white diff-added">${item.after}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add accordion functionality
        const header = section.querySelector('.accordion-header');
        const content = section.querySelector('.accordion-content');
        const chevron = header.querySelector('.fa-chevron-down');
        
        header.addEventListener('click', () => {
            content.classList.toggle('hidden');
            chevron.classList.toggle('rotate-180');
        });

        return section;
    }

    createHeadingsSection(headings) {
        const section = document.createElement('div');
        section.className = 'glass-morphism rounded-xl overflow-hidden';
        
        section.innerHTML = `
            <button class="accordion-header w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700 transition-colors duration-200">
                <div class="flex items-center">
                    <i class="fas fa-list-ul mr-3 text-emerald-400"></i>
                    <h3 class="font-semibold text-white">Estrutura de Cabeçalhos</h3>
                </div>
                <i class="fas fa-chevron-down text-slate-400 transition-transform duration-200"></i>
            </button>
            <div class="accordion-content hidden px-6 pb-4">
                <div class="space-y-2">
                    ${headings.map(heading => `
                        <div class="flex items-center space-x-3">
                            <span class="px-2 py-1 bg-slate-700 text-xs font-mono rounded text-emerald-400">${heading.tag.toUpperCase()}</span>
                            <span class="text-sm text-white">${heading.texto}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add accordion functionality
        const header = section.querySelector('.accordion-header');
        const content = section.querySelector('.accordion-content');
        const chevron = header.querySelector('.fa-chevron-down');
        
        header.addEventListener('click', () => {
            content.classList.toggle('hidden');
            chevron.classList.toggle('rotate-180');
        });

        return section;
    }

    createContentSection(content) {
        const section = document.createElement('div');
        section.className = 'glass-morphism rounded-xl overflow-hidden';
        
        section.innerHTML = `
            <button class="accordion-header w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700 transition-colors duration-200">
                <div class="flex items-center">
                    <i class="fas fa-file-alt mr-3 text-emerald-400"></i>
                    <h3 class="font-semibold text-white">Otimização de Conteúdo (IA)</h3>
                </div>
                <i class="fas fa-chevron-down text-slate-400 transition-transform duration-200"></i>
            </button>
            <div class="accordion-content hidden px-6 pb-4">
                <div class="bg-slate-800 rounded-lg p-4">
                    <div class="text-sm text-white leading-relaxed">${content}</div>
                </div>
            </div>
        `;

        // Add accordion functionality
        const header = section.querySelector('.accordion-header');
        const contentDiv = section.querySelector('.accordion-content');
        const chevron = header.querySelector('.fa-chevron-down');
        
        header.addEventListener('click', () => {
            contentDiv.classList.toggle('hidden');
            chevron.classList.toggle('rotate-180');
        });

        return section;
    }

    createImagesSection(images) {
        const section = document.createElement('div');
        section.className = 'glass-morphism rounded-xl overflow-hidden';
        
        section.innerHTML = `
            <button class="accordion-header w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700 transition-colors duration-200">
                <div class="flex items-center">
                    <i class="fas fa-images mr-3 text-emerald-400"></i>
                    <h3 class="font-semibold text-white">Otimização de Mídia (Alt Texts)</h3>
                </div>
                <i class="fas fa-chevron-down text-slate-400 transition-transform duration-200"></i>
            </button>
            <div class="accordion-content hidden px-6 pb-4">
                <div class="space-y-3">
                    ${images.map(img => `
                        <div class="border-l-2 border-slate-600 pl-4">
                            <div class="text-xs text-slate-400 mb-1 truncate">${img.src_original}</div>
                            <div class="space-y-1">
                                <div>
                                    <span class="text-xs text-red-400">Antes:</span>
                                    <p class="text-sm text-slate-400 diff-removed">${img.alt_otimizado ? '(vazio)' : 'alt=""'}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-emerald-400">Depois:</span>
                                    <p class="text-sm text-white diff-added">${img.alt_otimizado}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add accordion functionality
        const header = section.querySelector('.accordion-header');
        const content = section.querySelector('.accordion-content');
        const chevron = header.querySelector('.fa-chevron-down');
        
        header.addEventListener('click', () => {
            content.classList.toggle('hidden');
            chevron.classList.toggle('rotate-180');
        });

        return section;
    }

    async implementOptimizations() {
        if (!this.currentOptimizations) return;

        try {
            const targetSiteUrl = document.getElementById('targetSiteUrl').value.trim();
            
            if (!targetSiteUrl) {
                this.showNotification('Por favor, insira a URL do site primeiro', 'error');
                return;
            }

            // Get connector API key
            const data = await chrome.storage.local.get(['connectorApiKey', 'backendApiUrl']);
            const apiKey = data.connectorApiKey;
            const backendUrl = data.backendApiUrl || 'http://127.0.0.1:3000';

            if (!apiKey) {
                this.showNotification('Por favor, gere o script de instalação primeiro nas Configurações', 'error');
                this.switchTab('configuracoes');
                return;
            }

            // Send optimizations to backend to apply on target site
            const response = await fetch(`${backendUrl}/api/seo/implement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetUrl: targetSiteUrl,
                    apiKey: apiKey,
                    optimizations: this.currentOptimizations
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('✅ Otimizações enviadas ao site com sucesso!', 'success');
                this.addToHistory(this.currentOptimizations);
                this.discardOptimizations();
            } else {
                this.showNotification(`Erro: ${result.error}`, 'error');
            }

        } catch (error) {
            console.error('Error implementing optimizations:', error);
            
            if (error.message.includes('Failed to fetch')) {
                this.showNotification('Não foi possível conectar ao backend', 'error');
            } else {
                this.showNotification('Erro ao implementar otimizações', 'error');
            }
        }
    }

    discardOptimizations() {
        this.currentOptimizations = null;
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('targetSiteUrl').value = '';
    }

    async addToHistory(optimizations) {
        const historyItem = {
            id: Date.now(),
            url: document.getElementById('targetSiteUrl').value,
            keyword: 'Análise Geral',
            scoreBefore: optimizations.analise_inicial.score_antes,
            scoreAfter: optimizations.score_final_estimado,
            timestamp: new Date().toISOString(),
            optimizations: optimizations
        };

        this.history.unshift(historyItem);
        
        // Keep only last 50 items
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        await chrome.storage.local.set({ history: this.history });
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = `
                <div class="text-center py-8 text-slate-400">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>Nenhuma otimização realizada ainda</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = this.history.map(item => `
            <div class="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors duration-200">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-3">
                        <div class="text-sm font-medium text-white">${item.keyword}</div>
                        <div class="flex items-center space-x-2">
                            <span class="text-xs text-red-400">${item.scoreBefore}</span>
                            <i class="fas fa-arrow-right text-xs text-slate-500"></i>
                            <span class="text-xs text-emerald-400">${item.scoreAfter}</span>
                        </div>
                    </div>
                    <div class="text-xs text-slate-400">
                        ${new Date(item.timestamp).toLocaleDateString('pt-BR')}
                    </div>
                </div>
                <div class="text-xs text-slate-400 truncate">${item.url}</div>
            </div>
        `).join('');
    }

    async generateInstallationScript() {
        try {
            // Generate unique API key
            const apiKey = this.generateUniqueKey();
            
            // Get backend URL
            const data = await chrome.storage.local.get(['backendApiUrl']);
            const backendUrl = data.backendApiUrl || 'http://127.0.0.1:3000';
            
            // Generate the installation script
            const script = `<!-- Big Site SEO Connector -->
<script>
(function() {
  window.BigSiteConfig = {
    apiKey: '${apiKey}',
    backendUrl: '${backendUrl}',
    version: '1.0.0'
  };

  // BigSite API Handler
  window.BigSiteAPI = {
    // Apply SEO optimizations
    applyOptimizations: function(optimizations) {
      if (optimizations.seo_head) {
        // Update title
        if (optimizations.seo_head.title_otimizado) {
          document.title = optimizations.seo_head.title_otimizado;
        }
        // Update meta description
        if (optimizations.seo_head.meta_description_otimizada) {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
          }
          meta.content = optimizations.seo_head.meta_description_otimizada;
        }
      }

      if (optimizations.seo_body) {
        // Update headings structure
        if (optimizations.seo_body.estrutura_de_cabecalhos_ideal) {
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          optimizations.seo_body.estrutura_de_cabecalhos_ideal.forEach((newH, idx) => {
            if (headings[idx]) {
              const newEl = document.createElement(newH.tag);
              newEl.textContent = newH.texto;
              newEl.className = headings[idx].className;
              headings[idx].parentNode.replaceChild(newEl, headings[idx]);
            }
          });
        }

        // Update image alt texts
        if (optimizations.seo_body.imagens_otimizadas) {
          optimizations.seo_body.imagens_otimizadas.forEach(imgOpt => {
            const img = document.querySelector(\`img[src="\${imgOpt.src_original}"]\`);
            if (img) img.alt = imgOpt.alt_otimizado;
          });
        }
      }

      console.log('✅ BigSite: Otimizações aplicadas com sucesso!');
    },

    // Send page data to BigSite
    reportPageData: function() {
      return {
        url: window.location.href,
        title: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content || '',
        html: document.body.innerHTML,
        timestamp: new Date().toISOString()
      };
    }
  };

  // Listen for messages from BigSite Extension
  window.addEventListener('message', function(event) {
    if (event.data.type === 'BIGSITE_OPTIMIZE') {
      window.BigSiteAPI.applyOptimizations(event.data.optimizations);
    }
  });

  console.log('🚀 BigSite Connector inicializado - v1.0.0');
})();
</script>`;

            // Store the API key
            await chrome.storage.local.set({ 
                connectorApiKey: apiKey,
                generatedScript: script 
            });

            // Display the script
            document.getElementById('connectorApiKey').value = apiKey;
            document.getElementById('generatedScript').value = script;
            document.getElementById('generatedScriptSection').classList.remove('hidden');

            this.showNotification('Script de instalação gerado com sucesso!', 'success');

        } catch (error) {
            console.error('Error generating script:', error);
            this.showNotification('Erro ao gerar script', 'error');
        }
    }

    generateUniqueKey() {
        // Generate a unique API key (format: BS_xxxxx...)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = 'BS_';
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }

    async copyToClipboard(text, successMessage) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification(successMessage || 'Copiado para a área de transferência!', 'success');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showNotification('Erro ao copiar', 'error');
        }
    }

    async getStoredKey(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key]);
            });
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
        
        if (type === 'success') {
            notification.classList.add('bg-emerald-500', 'text-white');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
        } else {
            notification.classList.add('bg-slate-700', 'text-white');
        }
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-3"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
    const extension = new BigSiteExtension();
    
    // Expor para debug no console
    window.bigsite = extension;
    console.log('🚀 Big Site Extension iniciada!');
    console.log('💡 Dica: Use window.bigsite.clearAllCache() no console para limpar o cache');
});