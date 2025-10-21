/**
 * Gemini API Helper - Solução robusta para trabalhar com Google Gemini
 * Testa múltiplos modelos e endpoints automaticamente
 */

interface GeminiModel {
  name: string;
  displayName: string;
  endpoint: string;
  supported: boolean;
}

/**
 * Lista de modelos Gemini em ordem de preferência
 * Modelos OFICIAIS conforme: https://ai.google.dev/gemini-api/docs/models
 * Testamos automaticamente até encontrar um que funcione
 */
const GEMINI_MODELS: GeminiModel[] = [
  {
    name: 'gemini-2.5-pro',
    displayName: 'Gemini 2.5 Pro',
    endpoint: 'v1beta',
    supported: true
  },
  {
    name: 'gemini-2.5-flash',
    displayName: 'Gemini 2.5 Flash',
    endpoint: 'v1beta',
    supported: true
  }
];

/**
 * Lista todos os modelos disponíveis na API key do usuário
 */
export async function listAvailableModels(apiKey: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.status}`);
    }
    
    const data = await response.json();
    const models = data.models?.map((m: any) => m.name.replace('models/', '')) || [];
    
    console.log('📋 Modelos disponíveis:', models);
    return models;
  } catch (error) {
    console.error('Erro ao listar modelos:', error);
    return [];
  }
}

/**
 * Testa qual modelo Gemini funciona com a API key fornecida
 */
export async function findWorkingGeminiModel(apiKey: string): Promise<{ model: string; endpoint: string } | null> {
  console.log('🔍 Procurando modelo Gemini que funcione...');
  
  // Primeiro, lista os modelos disponíveis
  const availableModels = await listAvailableModels(apiKey);
  
  // Testa cada modelo na ordem de preferência
  for (const modelConfig of GEMINI_MODELS) {
    if (!modelConfig.supported) continue;
    
    try {
      console.log(`🧪 Testando modelo: ${modelConfig.name}...`);
      
      const testUrl = `https://generativelanguage.googleapis.com/${modelConfig.endpoint}/models/${modelConfig.name}:generateContent?key=${apiKey}`;
      
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Test'
            }]
          }],
          generationConfig: {
            maxOutputTokens: 10
          }
        })
      });
      
      if (response.ok) {
        console.log(`✅ Modelo funcionando: ${modelConfig.name}`);
        return {
          model: modelConfig.name,
          endpoint: modelConfig.endpoint
        };
      } else {
        const error = await response.json();
        console.log(`❌ Modelo ${modelConfig.name} falhou:`, error.error?.message || 'Unknown error');
      }
    } catch (error) {
      console.log(`❌ Erro ao testar ${modelConfig.name}:`, error);
    }
  }
  
  console.error('❌ Nenhum modelo Gemini funcionou!');
  return null;
}

/**
 * Faz uma chamada direta à API do Gemini (sem SDK)
 * Usa o modelo que funcionar automaticamente
 */
export async function callGeminiDirectly(
  apiKey: string,
  prompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  // Encontra um modelo que funcione
  const workingModel = await findWorkingGeminiModel(apiKey);
  
  if (!workingModel) {
    throw new Error('Nenhum modelo Gemini disponível. Verifique sua API key.');
  }
  
  console.log(`🤖 Usando modelo: ${workingModel.model}`);
  
  const url = `https://generativelanguage.googleapis.com/${workingModel.endpoint}/models/${workingModel.model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.3,
        maxOutputTokens: options.maxTokens || 4000
      }
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API Error: ${error.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('No response from Gemini');
  }
  
  return text;
}

/**
 * Verifica se uma API key do Gemini é válida
 */
export async function verifyGeminiApiKey(apiKey: string): Promise<{
  valid: boolean;
  model?: string;
  endpoint?: string;
  error?: string;
}> {
  try {
    const workingModel = await findWorkingGeminiModel(apiKey);
    
    if (workingModel) {
      return {
        valid: true,
        model: workingModel.model,
        endpoint: workingModel.endpoint
      };
    } else {
      return {
        valid: false,
        error: 'Nenhum modelo Gemini disponível para esta API key'
      };
    }
  } catch (error: any) {
    return {
      valid: false,
      error: error.message
    };
  }
}
