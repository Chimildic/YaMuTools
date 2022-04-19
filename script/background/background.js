chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onMessage.addListener(onContentMessage);
chrome.tabs.onUpdated.addListener(onTabsUpdated);
chrome.action.onClicked.addListener(openOptionsPage);

function onInstalled(details) {   
    if (details.reason == 'install') {
        setDefaultOptions(() => openOptionsPage());
    } else if (details.reason == 'update') {
        patchCurrentOptions(openChangelogWithUpdate);
    }
}

function onContentMessage(message, sender, sendResponse) {
    if (message.action == 'openOptionsPage') {
        openOptionsPage();
    } else if (message.action == 'resetOptions') {
        setDefaultOptions(() => sendResponse({ success: true }));
    } else if (message.action == 'requestGET') {
        requestGET(message.url, (response) => sendResponse(response));
    } else if (message.action == 'requestFileGET') {
        requestFileGET(message.url, (url) => sendResponse(url));
    }
    return true;
}

function onTabsUpdated(tabId, changeInfo, tab) {
    if (tab.status == 'complete') {
        chrome.tabs.sendMessage(tabId, { status: tab.status });
    }
}

function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

function openChangelogWithUpdate() {
    chrome.storage.sync.get(['openChangelogWithUpdate'], (items) => {
        if (items.openChangelogWithUpdate) {
            openChangelogPage();
        }
    });
}

function openChangelogPage() {
    chrome.tabs.create({ url: '/page/changelog.html' });
}
