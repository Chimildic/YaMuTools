addUserPicEventListener();
document.onclick = onClickOutsideDropdown;

chrome.runtime.onMessage.addListener(onBackgroundMessage);
chrome.storage.sync.onChanged.addListener(onOptionsChanged);

function onBackgroundMessage(request, sender, sendResponse) {
    if (request.status == 'complete') {
        modifyNavTabs();
        modifyTeaserPlaylist();
        fillContent('complete');
    }
}

function onOptionsChanged(changes) {
    if (changes.onUserTab || changes.dataUserTab) {
        modifyNavTabs();
    } else if (changes.offTeaserPlaylist) {
        modifyTeaserPlaylist();
    } else {
        fillContent('options');
    }
}

function fillContent(message) {
    let response = getAvailableModify();
    if (!response.available) {
        return;
    }

    if (message == 'complete') {
        waitNodeInserted(response.key, response.method);
    } else if (message == 'options') {
        waitElementByKey(response.key, response.method);
    }
}

function waitElementByKey(key, callback) {
    let tryCount = 0;
    let timerId = setInterval(function () {
        if (document.querySelector(key)) {
            clearInterval(timerId);
            callback(key);
        }

        if (++tryCount > 10) {
            clearInterval(timerId);
            writeErrorOverflowTryCount({
                tryCount: 10,
                time: '10',
                key: key,
                callback: callback,
            });
        }
    }, 1000);
}

function waitNodeInserted(key, callback) {
    let tryCount = 0;
    document.addEventListener('DOMNodeInserted', function (event) {
        if (document.querySelector(key)) {
            document.removeEventListener('DOMNodeInserted', arguments.callee);
            callback(key);
        }

        if (++tryCount > 5) {
            document.removeEventListener('DOMNodeInserted', arguments.callee);
            waitElementByKey(key, callback);
        }
    });
}

function writeErrorOverflowTryCount(data) {
    let availableKey = getAvailableModify().key;
    if (availableKey == data.key && data.key != PAGE_MAIN) {
        console.error(getMessage('error_insert_element'));
        console.error(getMessage('error_insert_element_details', [data.tryCount, data.time, data.key, data.callback.name]));
    }
}
