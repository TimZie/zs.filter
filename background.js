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

let lastCSSStack = [];

async function filter(message) {
  if (message) {
    tab = await getCurrentTab();
    if (tab?.url.startsWith(testCycleView)) {
      console.log("Im in, message " + message.filtertext);

      if (message.filtertext) {
        css = `#ktm-test-player-scope > div.ktm-test-player-scope-single-view.ng-scope > div.ktm-groups-list.ng-scope > ol > li:has(div > span.ktm-name.ng-binding:not([title*="${message.filtertext}"])) {display: none;}`;

      // Insert the CSS 
        await chrome.scripting.insertCSS({
          css: css,
          target: { tabId: tab.id },
        });
        lastCSSStack.push(css);
      } else {
        // Remove the CSS
        await chrome.scripting.removeCSS({
          css: lastCSSStack.pop(),
          target: { tabId: tab.id },
        });
      }
    }
  }
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
