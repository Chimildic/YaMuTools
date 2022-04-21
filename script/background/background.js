browser.runtime.onInstalled.addListener(onInstalled);
browser.runtime.onMessage.addListener(onContentMessage);
browser.browserAction.onClicked.addListener(openOptionsPage);
browser.tabs.onUpdated.addListener(onTabsUpdated);

function onInstalled(details) {
    if (details.reason == 'install') {
        setDefaultOptions(() => openOptionsPage());
    } else if (details.reason == 'update') {
        patchCurrentOptions(openChangelogWithUpdate);
    }
}

function onContentMessage(message, sender, sendResponse) {
    if (message.action == 'openOptionsPage') {
        openOptionsPage(() => sendResponse({ success: true }));
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
        browser.tabs.sendMessage(tabId, { status: tab.status }, (response) => {
            if (!browser.runtime.lastError) {
                // https://stackoverflow.com/a/69587523/5894542
            }
        });
    }
}

function openOptionsPage() {
    browser.runtime.openOptionsPage();
}

function openChangelogWithUpdate() {
    browser.storage.local.get(['openChangelogWithUpdate'], (items) => {
        if (items.openChangelogWithUpdate) {
            openChangelogPage();
        }
    });
}

function openChangelogPage() {
    browser.tabs.create({ url: '/page/changelog.html' });
}
