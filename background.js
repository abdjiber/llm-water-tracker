// Background script to manage the submission counter

// Track submissions per hostname
let submissionCounts = {};

// Initialize storage
chrome.storage.sync.get('submissionCounts', (data) => {
  if (data.submissionCounts) {
    submissionCounts = data.submissionCounts;
  }
});

// Function to check if a hostname is supported
function isSupportedHostname(hostname) {
  return hostname.includes('chatgpt.com') || 
         hostname.includes('claude.ai') || 
         hostname.includes('gemini.google.com') ||
         hostname.includes('chat.mistral.ai');
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'incrementSubmission') {
    const url = new URL(sender.tab.url);
    const hostname = url.hostname;
    
    if (isSupportedHostname(hostname)) {
      // Initialize count for this hostname if it doesn't exist
      if (!submissionCounts[hostname]) {
        submissionCounts[hostname] = 0;
      }
      
      // Increment the count for this hostname
      submissionCounts[hostname]++;
      
      // Save to storage
      chrome.storage.sync.set({ submissionCounts }, () => {
        // Notify all popups to update
        chrome.runtime.sendMessage({ 
          action: 'updatePopup',
          hostname: hostname,
          count: submissionCounts[hostname]
        });
      });
    }
  }
});

// Listen for tab updates to check hostname support
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    const hostname = url.hostname;
    
    if (isSupportedHostname(hostname)) {
      // Initialize count for this hostname if it doesn't exist
      if (!submissionCounts[hostname]) {
        submissionCounts[hostname] = 0;
        chrome.storage.sync.set({ submissionCounts });
      }
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ submissionCount: 0 });
  console.log('LLM Water Tracker installed. Counter initialized to 0.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'incrementCounter') {
    chrome.storage.sync.get('submissionCount', (data) => {
      let newCount = (data.submissionCount || 0) + 1;
      chrome.storage.sync.set({ submissionCount: newCount }, () => {
        console.log('Submission counter incremented to:', newCount);
        // Optionally send a response back to the content script
        // sendResponse({ status: "Counter updated", newCount: newCount });

        // Update the popup if it's open
        chrome.runtime.sendMessage({ action: 'updatePopup' });
      });
    });
    // Return true to indicate you wish to send a response asynchronously
    // (Needed if using sendResponse inside the storage callback)
    return true;
  }
}); 

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    // Check if the URL matches the pages you're targeting
    if (tab.url && (tab.url.includes('chatgpt.com') || tab.url.includes('gemini.google.com') || tab.url.includes('claude.ai'))) {
      // Inject the content script (separate file) into the tab
      chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: ['content.js'] // This is the content script file you want to inject
      });
    }
  });
});
