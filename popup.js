document.addEventListener('DOMContentLoaded', function() {
  var addButton = document.getElementById('addButton');
  var clearButton = document.getElementById('clearButton');
  var textInput = document.getElementById('textInput');
  var list = document.getElementById('list');

  // Load saved items from chrome.storage
  chrome.storage.sync.get(['items'], function(result) {
    var savedItems = result.items || [];
    savedItems.slice().reverse().forEach(function(savedItem) {
      addItemToList(savedItem);
    });
  });

  addButton.addEventListener('click', function() {
    var inputText = textInput.value.trim();
    if (inputText !== '') {
      addItemToList(inputText);
      saveItemToStorage(inputText);
      textInput.value = '';
    }
  });

  clearButton.addEventListener('click', function() {
    textInput.value = '';
  });

  function addItemToList(itemText) {
    var newItem = document.createElement('div');
    newItem.className = 'item';

    var itemTextElement = document.createElement('div');
    itemTextElement.className = 'item-text';
    itemTextElement.textContent = itemText;

    var deleteIcon = document.createElement('span');
    deleteIcon.className = 'delete-icon';
    deleteIcon.style.backgroundImage = 'url(../images/delete_black.png)';

    deleteIcon.addEventListener('mouseenter', function() {
      deleteIcon.style.backgroundImage = 'url(../images/delete_red.png)';
    });

    deleteIcon.addEventListener('mouseleave', function() {
      deleteIcon.style.backgroundImage = 'url(../images/delete_black.png)';
    });

    deleteIcon.addEventListener('click', function(event) {
      event.stopPropagation();
      newItem.remove();
      removeItemFromStorage(itemText);
    });

    newItem.addEventListener('mousedown', function(event) {
      if (!event.target.classList.contains('delete-icon')) {
        newItem.classList.add('clicked');
        navigator.clipboard.writeText(itemTextElement.textContent);
        showCopyMessage();
        setTimeout(function() {
          newItem.classList.remove('clicked');
        }, 1000);
      }
    });

    newItem.appendChild(deleteIcon);
    newItem.appendChild(itemTextElement);

    if (list.firstChild) {
      list.insertBefore(newItem, list.firstChild);
    } else {
      list.appendChild(newItem);
    }
  }

  function saveItemToStorage(itemText) {
    chrome.storage.sync.get(['items'], function(result) {
      var savedItems = result.items || [];
      savedItems.unshift(itemText);
      chrome.storage.sync.set({ items: savedItems });
    });
  }

  function removeItemFromStorage(itemText) {
    chrome.storage.sync.get(['items'], function(result) {
      var savedItems = result.items || [];
      var index = savedItems.indexOf(itemText);
      if (index !== -1) {
        savedItems.splice(index, 1);
        chrome.storage.sync.set({ items: savedItems });
      }
    });
  }

  function showCopyMessage() {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Copied !';
    document.body.appendChild(toast);
    setTimeout(function() {
      document.body.removeChild(toast);
    }, 500);
  }

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "addToClipboard") {
      addItemToList(message.text);
    }
  });
});


/*document.addEventListener('DOMContentLoaded', function() {
  var addButton = document.getElementById('addButton');
  var clearButton = document.getElementById('clearButton');
  var textInput = document.getElementById('textInput');
  var list = document.getElementById('list');

  // Retrieve saved items from Chrome storage and add them to the list
  chrome.storage.sync.get(['items'], function(result) {
    var savedItems = result.items || [];
    savedItems.slice().reverse().forEach(function(savedItem) {
      addItemToList(savedItem);
    });
  });

  // Listen for clicks on the Add button
  addButton.addEventListener('click', function() {
    var inputText = textInput.value.trim();
    if (inputText !== '') { 
      addItemToList(inputText);
      saveItemToStorage(inputText);
      textInput.value = '';
    }
  });

  // Listen for clicks on the Clear button
  clearButton.addEventListener('click', function() {
    textInput.value = ''; 
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "addToClipboard" && message.text) {
      var selectedText = message.text;
      addItemToList(selectedText);
      saveItemToStorage(selectedText);
    }
  });

  // Function to add an item to the list
  function addItemToList(itemText) {
    var newItem = document.createElement('div');
    newItem.className = 'item';

    var itemTextElement = document.createElement('div');
    itemTextElement.className = 'item-text';
    itemTextElement.textContent = itemText;

    var deleteIcon = document.createElement('span');
    deleteIcon.className = 'delete-icon';
    deleteIcon.style.backgroundImage = 'url(../images/delete_black.png)';

    deleteIcon.addEventListener('mouseenter', function() {
      deleteIcon.style.backgroundImage = 'url(../images/delete_red.png)';
    });

    deleteIcon.addEventListener('mouseleave', function() {
      deleteIcon.style.backgroundImage = 'url(../images/delete_black.png)';
    });

    deleteIcon.addEventListener('click', function(event) {
      event.stopPropagation();
      newItem.remove();
      removeItemFromStorage(itemText);
    });

    newItem.addEventListener('mousedown', function(event) {
      if (!event.target.classList.contains('delete-icon')) {
        newItem.classList.add('clicked');
        navigator.clipboard.writeText(itemTextElement.textContent);
        showCopyMessage();
        setTimeout(function() {
          newItem.classList.remove('clicked');
        }, 1000);
      }
    });

    newItem.appendChild(deleteIcon);
    newItem.appendChild(itemTextElement);

    if (list.firstChild) {
      list.insertBefore(newItem, list.firstChild);
    } else {
      list.appendChild(newItem);
    }
  }

  // Function to save an item to Chrome storage
  function saveItemToStorage(itemText) {
    chrome.storage.sync.get(['items'], function(result) {
      var savedItems = result.items || [];
      savedItems.unshift(itemText);
      chrome.storage.sync.set({ items: savedItems });
    });
  }

  // Function to remove an item from Chrome storage
  function removeItemFromStorage(itemText) {
    chrome.storage.sync.get(['items'], function(result) {
      var savedItems = result.items || [];
      var index = savedItems.indexOf(itemText);
      if (index !== -1) {
        savedItems.splice(index, 1);
        chrome.storage.sync.set({ items: savedItems });
      }
    });
  }

  // Function to show a copy message
  function showCopyMessage() {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Copied !';
    document.body.appendChild(toast);
    setTimeout(function() {
      document.body.removeChild(toast);
    }, 500);
  }
});*/