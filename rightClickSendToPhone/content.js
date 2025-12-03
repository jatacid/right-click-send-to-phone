chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelection") {
    sendResponse({ selection: window.getSelection().toString() });
  }
});
