function addUserPicEventListener() {
    let element = document.querySelector('.head__userpic');
    if (element) {
        element.addEventListener('click', onClickUserPic);
    }
}

function addPodcastTab() {
    insertNavTab(getMessage('nav_tab_podcast'), 'non-music');
}

function addUserTab(data) {
    insertUserNavTab(data.title, data.url, 'userTabId');
}

function removePodcastTab() {
    removeNavTab('non-music');
}

function removeUserTab() {
    removeById('userTabId');
}

function onClickUserPic() {
    let timerId = setInterval(function () {
        let multiAuthItems = document.getElementsByClassName('multi-auth__item');
        if (multiAuthItems.length != 0) {
            clearInterval(timerId);
            addLinkToOptionsPage(multiAuthItems);
        }
    }, 50);
}

function addLinkToOptionsPage(multiAuthItems) {
    if (!multiAuthItems || document.getElementById('yamutoolsOptionsPage')) {
        return;
    }

    for (i = 0; i < multiAuthItems.length; i++) {
        href = multiAuthItems[i].getAttribute('href');
        if (href && href.includes('user')) {
            multiAuthItems[i].insertAdjacentHTML(
                'afterend',
                '<li id="yamutoolsOptionsPage" class="multi-auth__line"><a class="d-link deco-link multi-auth__item typo-main multi-auth__my-music deco-popup-menu__item d-link_no-hover-color deco-link_no-hover-color">YaMuTools</a></li>'
            );
            document
                .getElementById('yamutoolsOptionsPage')
                .addEventListener('click', () => chrome.runtime.sendMessage({ action: 'openOptionsPage' }));
            break;
        }
    }
}
