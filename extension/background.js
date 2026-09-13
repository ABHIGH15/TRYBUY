chrome.action.onClicked.addListener((tab) => {
  // Only inject into http/https tabs
  if (!tab.url || !tab.url.startsWith('http')) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: [
      'extractors/amazon.js',
      'extractors/myntra.js',
      'extractors/generic.js',
      'content.js'
    ]
  });
});
