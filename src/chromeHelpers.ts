export const navigateActiveTab = (url: string): void => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    if (activeTab?.id) {
      void chrome.tabs.update(activeTab.id, { url });
    }
  });
};
