import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { targetUrl } = await request.json();

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'URL do site é obrigatória' },
        { status: 400 }
      );
    }

    // Validate URL format
    let url: URL;
    try {
      url = new URL(targetUrl);
    } catch (error) {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      );
    }

    // Fetch the page HTML
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Big Site SEO Bot/1.0'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ao buscar site: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Parse basic page data (simulating what inject.js does)
    const pageData = {
      url: targetUrl,
      title: extractTitle(html),
      metaDescription: extractMetaTag(html, 'description'),
      html: html,
      
      // Basic meta tags
      keywords: extractMetaTag(html, 'keywords'),
      author: extractMetaTag(html, 'author'),
      robots: extractMetaTag(html, 'robots'),
      
      // Open Graph tags
      ogTitle: extractMetaProperty(html, 'og:title'),
      ogDescription: extractMetaProperty(html, 'og:description'),
      ogImage: extractMetaProperty(html, 'og:image'),
      ogUrl: extractMetaProperty(html, 'og:url'),
      
      // Twitter Card tags
      twitterCard: extractMetaTag(html, 'twitter:card'),
      twitterTitle: extractMetaTag(html, 'twitter:title'),
      twitterDescription: extractMetaTag(html, 'twitter:description'),
      
      // Canonical URL
      canonical: extractCanonical(html),
      
      // Language
      lang: extractLang(html),
      
      // Headings
      headings: extractHeadings(html),
      
      // Images
      images: extractImages(html),
      
      // Word count (approximate)
      wordCount: countWords(html)
    };

    return NextResponse.json({
      success: true,
      data: pageData
    });

  } catch (error: any) {
    console.error('Fetch Page Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar página',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper functions to extract data from HTML
function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractMetaTag(html: string, name: string): string {
  const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

function extractMetaProperty(html: string, property: string): string {
  const regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

function extractCanonical(html: string): string {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  return match ? match[1] : '';
}

function extractLang(html: string): string {
  const match = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  return match ? match[1] : '';
}

function extractHeadings(html: string): Array<{tag: string, text: string}> {
  const headings: Array<{tag: string, text: string}> = [];
  const regex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gi;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      tag: match[1].toLowerCase(),
      text: match[2].replace(/<[^>]*>/g, '').trim()
    });
  }
  
  return headings;
}

function extractImages(html: string): Array<{src: string, alt: string}> {
  const images: Array<{src: string, alt: string}> = [];
  const regex = /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    images.push({
      src: match[1],
      alt: match[2] || ''
    });
  }
  
  return images;
}

function countWords(html: string): number {
  // Remove HTML tags and count words
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}
