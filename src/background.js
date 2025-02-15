// Listen for the extension being installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
  });
  
  // Listen for messages from your popup or content scripts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);
    // Do something based on the message
    sendResponse({ status: "Message received" });
  });
  