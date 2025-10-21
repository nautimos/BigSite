// Background script para Big Site Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Big Site Extension instalada');
});

// Listener para abrir o side panel
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ tabId: tab.id });
});

// Listener para mensagens do content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageData') {
    // Injeta script para obter dados da página
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ['inject.js']
    }, (results) => {
      if (results && results[0]) {
        sendResponse({ success: true, data: results[0].result });
      } else {
        sendResponse({ success: false, error: 'Failed to get page data' });
      }
    });
    return true; // Mantém a conexão aberta para resposta assíncrona
  }
});