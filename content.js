  function isUserMessage(element) {
    const hostname = window.location.hostname;
    if (hostname === 'chatgpt.com') {
      return element.tagName && element.tagName === 'ARTICLE' && 
             element.querySelector('h6')?.textContent === 'ChatGPT said:';
    } else if (hostname === 'gemini.google.com') {
      return element.querySelector("model-response") !== null;
    } else if (hostname === 'claude.ai') {
      return element.querySelector('div[data-testid="user-message"]') !== null;
    }
    return false;
  }

  // List to track processed nodes
  const processedNodes = new Set();

  // Create a MutationObserver to watch for new messages
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Check added nodes
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added element is a user message and hasn't been processed
          if (isUserMessage(node) && !processedNodes.has(node)) {
            sendMessage({ action: 'incrementSubmission' }).then(() => {
              // Add node to processed list
              processedNodes.add(node);
            }).catch((error) => {
              console.error("LLM Water Tracker: Error sending message:", error);
            });
          }
        }
      }
    }
  });

  async function sendMessage(message){
    if (chrome.runtime){ // Check if runtime API is available
      try{
        const response = await chrome.runtime.sendMessage(message);
        return response;
    } catch (error){
        console.error("LLM Water Tracker: Error sending message:", error);
        return null;
      }
    } else {
      console.error("LLM Water Tracker: Runtime API not available");
      return null;
    }
  }

  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });