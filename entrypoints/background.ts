export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.action.onClicked.addListener((tab) => {
    if (!tab.id) return;
    browser.tabs.sendMessage(tab.id, { type: 'toggle-sidebar' }).catch(() => {
      // Ignore errors (e.g., tab with no matching content script)
    });
  });
});
