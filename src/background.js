// background.js
// Variables to hold the current tracking info
let currentTabId = null;
let currentURL = null;
let startTime = Date.now();

// Utility to save time spent on a website to storage
function updateTimeSpent(timeElapsed) {
  if (!currentURL) return;
  // Get current data, then update
  chrome.storage.local.get({ timeSpent: {} }, (result) => {
    const websiteTimes = result.timeSpent;
    websiteTimes[currentURL] = (websiteTimes[currentURL] || 0) + timeElapsed;
    chrome.storage.local.set({ timeSpent: websiteTimes });
    console.log(`Updated time for ${currentURL}: ${websiteTimes[currentURL]} ms`);
  });
}

// Handle changes when the active tab or window focus changes
function handleTabChange(newTabId, newURL) {
  // Calculate and store the time spent on the previous tab
  const timeElapsed = Date.now() - startTime;
  updateTimeSpent(timeElapsed);
  
  // Update to the new active tab and reset the timer
  currentTabId = newTabId;
  currentURL = newURL;
  startTime = Date.now();
}

// Listener for tab activation changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    // Only track if the tab has a valid URL (skip Chrome internal pages, etc.)
    if (tab.url && tab.url.startsWith('http')) {
      handleTabChange(activeInfo.tabId, new URL(tab.url).hostname);
    } else {
      handleTabChange(null, null);
    }
  });
});


// Listener for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window is focused; user might be away, so stop tracking
    handleTabChange(null, null);
  } else {
    // A window is focused, so get its active tab
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url && tabs[0].url.startsWith('http')) {
        handleTabChange(tabs[0].id, new URL(tabs[0].url).hostname);
      }
      else {
        handleTabChange(null, null);
      }
    });
  }
});

// Set up an alarm to wake the service worker every minute
chrome.alarms.create('trackingAlarm', { periodInMinutes: 1 });

// When the alarm fires, update the time for the current website
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'trackingAlarm' && currentURL) {
    const timeElapsed = Date.now() - startTime;
    updateTimeSpent(timeElapsed);
    // Reset the timer to avoid double counting the same time interval
    startTime = Date.now();
  }
});

// (Optional) Listen for messages (e.g., from a popup) to retrieve the stored data
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTimeSpent') {
    chrome.storage.local.get({ timeSpent: {} }, (result) => {
      sendResponse(result.timeSpent);
    });
    // Return true to indicate async response
    return true;
  }
});