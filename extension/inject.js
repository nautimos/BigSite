// Script injetado para capturar dados da página
(function() {
  // Helper function to get meta tag content
  const getMeta = (name, property = false) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    return document.querySelector(selector)?.content || '';
  };

  const pageData = {
    url: window.location.href,
    title: document.title,
    metaDescription: getMeta('description'),
    
    // Basic meta tags
    keywords: getMeta('keywords'),
    author: getMeta('author'),
    robots: getMeta('robots'),
    viewport: getMeta('viewport'),
    
    // Open Graph tags
    ogTitle: getMeta('og:title', true),
    ogDescription: getMeta('og:description', true),
    ogImage: getMeta('og:image', true),
    ogUrl: getMeta('og:url', true),
    ogType: getMeta('og:type', true),
    
    // Twitter Card tags
    twitterCard: getMeta('twitter:card'),
    twitterTitle: getMeta('twitter:title'),
    twitterDescription: getMeta('twitter:description'),
    twitterImage: getMeta('twitter:image'),
    
    // Canonical URL
    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    
    // Language
    lang: document.documentElement.lang || '',
    
    // Headings
    h1: document.querySelector('h1')?.textContent || '',
    headings: [],
    
    // Content
    content: document.body?.innerText || '',
    html: document.body?.innerHTML || '',
    wordCount: (document.body?.innerText || '').split(/\s+/).filter(word => word.length > 0).length,
    
    // Images
    images: [],
    
    // Links
    internalLinks: 0,
    externalLinks: 0,
    
    // Schema.org structured data
    structuredData: []
  };

  // Capturar estrutura de cabeçalhos
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    pageData.headings.push({
      tag: heading.tagName.toLowerCase(),
      text: heading.textContent.trim()
    });
  });

  // Capturar imagens com mais detalhes
  document.querySelectorAll('img').forEach(img => {
    pageData.images.push({
      src: img.src,
      alt: img.alt || '',
      title: img.title || '',
      width: img.width || 0,
      height: img.height || 0,
      loading: img.loading || ''
    });
  });

  // Contar links internos e externos
  const hostname = window.location.hostname;
  document.querySelectorAll('a[href]').forEach(link => {
    try {
      const linkUrl = new URL(link.href, window.location.href);
      if (linkUrl.hostname === hostname) {
        pageData.internalLinks++;
      } else {
        pageData.externalLinks++;
      }
    } catch (e) {
      // Invalid URL, skip
    }
  });

  // Capturar dados estruturados (JSON-LD)
  document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
    try {
      pageData.structuredData.push(JSON.parse(script.textContent));
    } catch (e) {
      // Invalid JSON, skip
    }
  });

  return pageData;
})();