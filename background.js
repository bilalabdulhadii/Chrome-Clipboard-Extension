chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "addToClipboard",
    title: "Add to Clipboard",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "addToClipboard" && info.selectionText) {
    chrome.storage.sync.get(['items'], function(result) {
      var savedItems = result.items || [];
      savedItems.unshift(info.selectionText);
      chrome.storage.sync.set({ items: savedItems }, function() {
        // Check if there are any listeners before sending the message
        chrome.runtime.sendMessage({ action: "addToClipboard", text: info.selectionText }, function(response) {
          if (chrome.runtime.lastError) {
            console.log("No listeners for the message: ", chrome.runtime.lastError.message);
          }
        });
      });
    });
  }
});

