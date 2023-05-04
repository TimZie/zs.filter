chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
      text: "",
  });
});

const testCycleView = 'https://issues.cambio.se/secure/Tests.jspa#/testPlayer/'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message received " + message);
  filter(message);
  sendResponse("");
});

let cssMap = new Map();

async function filter(message) {
  if (message) {
    tab = await getCurrentTab();
    if (tab?.url.startsWith(testCycleView)) {
      if (message.filtertext) {
        // Make sure to remove earlier CSS before applying new filter
        await removeCSS(tab.id)

        css = `#ktm-test-player-scope > div.ktm-test-player-scope-single-view.ng-scope > div.ktm-groups-list.ng-scope > ol > li:has(div > span.ktm-name.ng-binding:not([title*="${message.filtertext}"])) {display: none;}`;

        // Insert the CSS 
        await chrome.scripting.insertCSS({
          css: css,
          target: { tabId: tab.id },
        });
        cssMap.set(tab.id, css);
      } else {
        await removeCSS(tab.id)
      }
    }
  }
}

async function removeCSS(tabId) {
  tabCSS = cssMap.get(tabId)
  if (!tabCSS) {
    return;
  }

  await chrome.scripting.removeCSS({
    css: cssMap.get(tabId),
    target: { tabId: tabId },
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
