import { NextRequest, NextResponse } from 'next/server';
import { callGeminiDirectly, findWorkingGeminiModel } from '@/lib/gemini-helper';

export async function POST(request: NextRequest) {
  try {
    const { pageData, focusKeyword, geminiApiKey } = await request.json();

    // Validate required parameters
    if (!pageData || !geminiApiKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // focusKeyword is now optional - if not provided, analyze site generally

    // Validate Gemini API key format
    if (!geminiApiKey.startsWith('AIza')) {
      return NextResponse.json(
        { error: 'Invalid Gemini API key format' },
        { status: 400 }
      );
    }

    // Validate page data
    if (!pageData.url || !pageData.html) {
      return NextResponse.json(
        { error: 'Invalid page data: missing url or html' },
        { status: 400 }
      );
    }

    // Encontra automaticamente o melhor modelo Gemini disponível
    console.log('🔍 Detectando modelo Gemini compatível...');
    const workingModel = await findWorkingGeminiModel(geminiApiKey);
    
    if (!workingModel) {
      return NextResponse.json(
        { error: 'Nenhum modelo Gemini disponível. Verifique sua API key.' },
        { status: 400 }
      );
    }

    console.log('🤖 Iniciando análise SEO com Google Gemini');
    console.log('📊 Modelo detectado:', workingModel.model);
    console.log('🌐 Endpoint:', workingModel.endpoint);
    console.log('🔑 API Key:', geminiApiKey.substring(0, 10) + '...');
    console.log('🌐 URL analisada:', pageData.url);

    // Construct the detailed prompt for Gemini
    const keywordSection = focusKeyword 
      ? `* **Palavra-Chave em Foco:** ${focusKeyword}` 
      : `* **Análise:** Geral do site (sem palavra-chave específica)`;
    
    const systemPrompt = `[INÍCIO DO PROMPT DO SISTEMA]

Você é o "Motor Big Site", o especialista em SEO mais avançado do mundo, treinado em análise semântica, Core Web Vitals e psicologia do usuário. Sua missão é desconstruir e reescrever cirurgicamente o conteúdo de uma página web para alcançar a perfeição técnica e de relevância.

**REGRAS RÍGIDAS:**
1. **Formato de Saída:** Sua resposta DEVE ser um único bloco de código JSON. NENHUM texto ou explicação deve vir antes ou depois do JSON.
2. **Tom de Voz:** Analise o HTML para identificar o tom de voz da marca (ex: formal, casual, técnico) e MANTENHA-O em todo o conteúdo gerado.
3. **Limites de Caracteres:** <title> (máx. 60 caracteres), <meta description> (máx. 160 caracteres).
4. **Hierarquia:** O conteúdo DEVE ter apenas um <h1>. As tags <h2> e <h3> devem seguir uma hierarquia lógica.
5. **Alt Text:** As descrições alt devem ser descritivas para acessibilidade, mas também incluir contexto semântico relacionado${focusKeyword ? ' à palavra-chave' : ''} quando natural.

**DADOS DE ENTRADA:**

* **URL Alvo:** ${pageData.url}
${keywordSection}
* **HTML Bruto (Corpo):**
\`\`\`html
${pageData.html}
\`\`\`

**TAREFA: ANALISE OS DADOS E GERE O JSON DE OTIMIZAÇÃO**

Com base estritamente nos dados de entrada e nas regras, gere o objeto JSON com a seguinte estrutura exata:

{
  "analise_inicial": {
    "score_antes": [Número de 0-100, sua estimativa do score SEO atual],
    "palavra_chave_detectada": "[Sua análise da palavra-chave principal atual]",
    "resumo_dos_problemas": "[Breve resumo dos 3 piores problemas de SEO encontrados]"
  },
  "seo_head": {
    "title_otimizado": "[Gere o <title> perfeito aqui, focado na palavra-chave]",
    "meta_description_otimizada": "[Gere a <meta description> perfeita aqui, com um CTA sutil]"
  },
  "seo_body": {
    "estrutura_de_cabecalhos_ideal": [
      { "tag": "h1", "texto": "[O único H1 otimizado]" },
      { "tag": "h2", "texto": "[Primeiro H2 otimizado]" },
      { "tag": "h3", "texto": "[Primeiro H3 sob o H2 acima]" },
      { "tag": "h2", "texto": "[Segundo H2 otimizado]" }
    ],
    "conteudo_reescrito_html": "[Aqui você reescreve o HTML do corpo principal. Use <p>, <strong>, <ul>, etc. Incorpore a palavra-chave e sinônimos (LSI) de forma natural. Corrija gramática. Melhore a legibilidade. Mantenha o tom de voz original.]",
    "imagens_otimizadas": [
      {
        "src_original": "[URL da imagem]",
        "alt_otimizado": "[Gere o alt text descritivo e otimizado aqui]"
      }
    ]
  },
  "score_final_estimado": [Número de 0-100, sua estimativa do score após estas mudanças]
}

[FIM DO PROMPT DO SISTEMA]`;

    console.log('📤 Enviando prompt detalhado para Gemini...');
    const startTime = Date.now();

    // Chamada direta ao Gemini (sem SDK)
    const messageContent = await callGeminiDirectly(
      geminiApiKey,
      systemPrompt,
      {
        temperature: 0.3,
        maxTokens: 4000
      }
    );

    const responseTime = Date.now() - startTime;
    console.log(`✅ Resposta recebida do Gemini em ${responseTime}ms`);
    console.log('📝 Tamanho da resposta:', messageContent.length, 'caracteres');
    console.log('🧠 Processando análise SEO do Gemini...');

    // Extract JSON from the response
    let jsonMatch = messageContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                   messageContent.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const jsonString = jsonMatch[1] || jsonMatch[0];
    const analysisResult = JSON.parse(jsonString);

    // Add metadata
    analysisResult.metadata = {
      analyzed_at: new Date().toISOString(),
      url: pageData.url,
      focus_keyword: focusKeyword,
      original_title: pageData.title,
      original_description: pageData.metaDescription,
      model_used: workingModel.model,
      api_provider: 'Google AI',
      api_endpoint: workingModel.endpoint,
      response_time_ms: responseTime
    };

    console.log('🎉 Análise SEO concluída com sucesso!');
    console.log(`📈 Score antes: ${analysisResult.analise_inicial.score_antes}`);
    console.log(`📈 Score estimado depois: ${analysisResult.score_final_estimado}`);
    console.log(`🚀 Retornando resultados otimizados com ${workingModel.model}...`);

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      api_info: {
        model: workingModel.model,
        endpoint: workingModel.endpoint,
        provider: 'Google AI Studio',
        response_time: `${responseTime}ms`
      }
    });

  } catch (error: any) {
    console.error('SEO Analysis Error:', error);
    
    // Specific error handling
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired API key',
          details: 'Please check your Gemini API key in settings'
        },
        { status: 401 }
      );
    }

    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { 
          error: 'API quota exceeded',
          details: 'You have reached your Gemini API quota limit'
        },
        { status: 429 }
      );
    }

    if (error.message?.includes('JSON')) {
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response',
          details: 'The AI returned an invalid response format'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze page',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}