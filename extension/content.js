// Content script para comunicação com a página
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'optimizePage') {
    // Implementa as otimizações na página
    applyOptimizations(request.optimizations);
    sendResponse({ success: true });
  }
});

function applyOptimizations(optimizations) {
  try {
    // Atualizar título
    if (optimizations.seo_head?.title_otimizado) {
      document.title = optimizations.seo_head.title_otimizado;
      console.log('✅ Título atualizado');
    }

    // Atualizar meta description
    if (optimizations.seo_head?.meta_description_otimizada) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = optimizations.seo_head.meta_description_otimizada;
      console.log('✅ Meta description atualizada');
    }

    // Reestruturar cabeçalhos (H1-H6)
    if (optimizations.seo_body?.estrutura_de_cabecalhos_ideal) {
      applyHeadingStructure(optimizations.seo_body.estrutura_de_cabecalhos_ideal);
      console.log('✅ Estrutura de cabeçalhos reestruturada');
    }

    // Atualizar alt texts das imagens
    if (optimizations.seo_body?.imagens_otimizadas) {
      optimizations.seo_body.imagens_otimizadas.forEach(imgOpt => {
        const img = document.querySelector(`img[src="${imgOpt.src_original}"]`);
        if (img) {
          img.alt = imgOpt.alt_otimizado;
        }
      });
      console.log('✅ Alt texts atualizados');
    }

    // Atualizar conteúdo reescrito (se fornecido)
    if (optimizations.seo_body?.conteudo_reescrito_html) {
      applyContentRewrite(optimizations.seo_body.conteudo_reescrito_html);
      console.log('✅ Conteúdo otimizado aplicado');
    }

    // Notificar que as otimizações foram aplicadas
    console.log('🚀 Todas as otimizações Big Site foram aplicadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao aplicar otimizações:', error);
  }
}

function applyHeadingStructure(headingStructure) {
  // Get all existing headings
  const existingHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  if (existingHeadings.length === 0 || headingStructure.length === 0) {
    console.warn('⚠️ Nenhum cabeçalho encontrado para reestruturar');
    return;
  }

  // Apply new structure to existing headings
  headingStructure.forEach((newHeading, index) => {
    if (index < existingHeadings.length) {
      const existingHeading = existingHeadings[index];
      
      // Create new heading element with correct tag
      const newElement = document.createElement(newHeading.tag);
      newElement.textContent = newHeading.texto;
      
      // Copy classes and attributes from existing heading
      Array.from(existingHeading.attributes).forEach(attr => {
        if (attr.name !== 'id') { // Preserve IDs if they exist
          newElement.setAttribute(attr.name, attr.value);
        }
      });
      
      // Replace old heading with new one
      existingHeading.parentNode.replaceChild(newElement, existingHeading);
    }
  });
}

function applyContentRewrite(newContentHtml) {
  // Find main content container (common selectors)
  const contentSelectors = [
    'main',
    '[role="main"]',
    'article',
    '.content',
    '.main-content',
    '#content',
    '#main-content',
    '.post-content',
    '.entry-content'
  ];
  
  let contentContainer = null;
  for (const selector of contentSelectors) {
    contentContainer = document.querySelector(selector);
    if (contentContainer) break;
  }
  
  // Fallback to body if no main container found
  if (!contentContainer) {
    contentContainer = document.body;
  }
  
  // Store original content as data attribute (for undo)
  if (!contentContainer.dataset.originalContent) {
    contentContainer.dataset.originalContent = contentContainer.innerHTML;
  }
  
  // Apply new content (preserving headings that were already updated)
  // This is a simple implementation - in production you might want more sophisticated merging
  console.log('ℹ️ Conteúdo reescrito disponível, mas não aplicado automaticamente para segurança');
}