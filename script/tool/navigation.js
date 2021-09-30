function addUserPicEventListener() {
    let element = document.querySelector('.head-kids__userpic');
    if (element) {
        element.addEventListener('click', onClickUserPic);
    } else {
        addUserPicEventListener();
    }
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
                '<li id="yamutoolsOptionsPage" class="d-link deco-link multi-auth__item typo-main multi-auth__my-music deco-popup-menu__item d-link_no-hover-color deco-link_no-hover-color">YaMuTools</a></li>'
            );
            document
                .getElementById('yamutoolsOptionsPage')
                .addEventListener('click', () => browser.runtime.sendMessage({ action: 'openOptionsPage' }));
            break;
        }
    }
}
