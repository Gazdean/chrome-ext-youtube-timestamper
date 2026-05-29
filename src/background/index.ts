chrome.runtime.onInstalled.addListener(() => {
    console.log('Background Service Worker - WORKING!')
})

// Open the side panel instead of a popup when the extension icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.commands.onCommand.addListener((command) => {
    if(command === 'open_side_panel') {
        chrome.windows.getCurrent((window) => {
            chrome.sidePanel.open({windowId: window.id!})
            console.log('Command + Ctrl + O triggered!!!')
        })
    }
})

// Adverts
const tabAdStatus: Record<number, boolean> = {};

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type === "AD_STATUS_CHANGED") {
    const tabId = sender.tab?.id
    if (tabId !== undefined) tabAdStatus[tabId] = request.isAd;

    chrome.runtime.sendMessage({ type: "UPDATE_UI_AD_STATUS", isAd: request.isAd, forTabId: tabId}).catch((err) => {
      console.log(err)
    });
  }
})