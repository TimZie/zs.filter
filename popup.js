'use strict';

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function setFilter() {
  const filterText = document.getElementById('filter-text').value;
  chrome.storage.local.set({ filtertext: filterText }).then(() => {
    console.log("Value is set to " + filterText);
  });
  chrome.action.setBadgeText({ text: 'ON' });

  // send message to background task
  chrome.runtime.sendMessage({'filtertext': filterText}, function(response) {});
  
  //window.close();
}

function clearFilter() {
  document.getElementById('filter-text').value = '';
  chrome.storage.local.clear();
  chrome.action.setBadgeText({ text: '' });
//  window.close();
}

document.getElementById('clear-filter').addEventListener('click', clearFilter);
document.getElementById('set-filter').addEventListener('click', setFilter);

chrome.storage.local.get(["filtertext"]).then((result) => {
  console.log("Value currently is " + result.filtertext);
  if (result.filtertext) {
    document.getElementById('filter-text').value = result.filtertext;
  }
});
