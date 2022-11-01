const KIND_PLAYLIST_MYLIKES = 3;
//const PARENT_CLASS = ['.page-playlist__controls_float_right', '.ugc-loader', '.d-generic-page-head__main-side-actions', '.page-playlist__controls', '.d-generic-page-head__main-actions', ];
const PARENT_CLASS = {
    '.page-playlist__controls_float_right': 'afterbegin',
    '.ugc-loader': 'afterbegin',
    '.d-generic-page-head__main-side-actions': 'afterbegin',
    '.page-playlist__controls': 'beforeend',
    '.d-generic-page-head__main-actions': 'beforeend',
    '.page-label__controls': 'beforeend'
};
let navTabs, indexNavTabs;

function isOwnerPage() {
    let args = getArgsByLocation();
    if (args.owner == owner && args.kind != KIND_PLAYLIST_MYLIKES) {
        return true;
    }
    return false;
}

function disableFlexAttribute() {
    let mainActions = document.querySelector('.d-generic-page-head__main-actions');
    let sideActions = document.querySelector('.d-generic-page-head__main-side-actions');

    if (mainActions) {
        mainActions.style.flex = '0 1 auto';
    }

    if (sideActions) {
        sideActions.style.flex = '0 1 auto';
    }
}

function getAvailablePosition() {
    let keys = Object.keys(PARENT_CLASS);
    for (let i = 0; i < keys.length; i++) {
        let parent = document.querySelector(keys[i]);
        if (parent) {
            result = { element: parent, where: PARENT_CLASS[keys[i]], query: keys[i] };
            break;
        }
    }

    return result;
}

function insertNavTab(title, path, id) {
    updateNavTabs();
    if (indexNavTabs[path]) {
        return;
    }

    let index;
    if (path == 'feed' && indexNavTabs['non-music']) {
        index = indexNavTabs['non-music'];
    } else if (path == 'feed' || path == 'non-music') {
        index = indexNavTabs['main'];
    } else {
        index = indexNavTabs['radio'];
    }

    let navTab = createNavTab(title, path);
    if (id) {
        navTab.id = id;
    }
    navTabs[index].insertAdjacentElement('afterend', navTab);
}

function insertUserNavTab(title, path, id) {
    let tab = document.getElementById(id);
    if (tab) {
        tab.remove();
    }

    if (path.length > 0) {
        insertNavTab(title, path, id);
    }
}

function removeNavTab(path) {
    updateNavTabs();
    let index = indexNavTabs[path];
    if (index) {
        navTabs[index].remove();
    }
}

function insertButton(data) {
    insert(data, createButton);
    disableFlexAttribute();
}

function insertDropdown(data) {
    insert(data, createDropdown);
    disableFlexAttribute();
}

function insert(data, creatorMethod) {
    if (!document.getElementById(data.id)) {
        let position = getAvailablePosition();
        position.element.insertAdjacentElement(position.where, creatorMethod(data));
    }
}

function removeById(id) {
    let element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

function removeDropdown() {
    let element = document.querySelector('.dropdown');
    if (element) {
        element.parentElement.remove();
    }
}

function updateNavTabs() {
    navTabs = document.getElementsByClassName('nav-kids__tab');
    updateIndexOfNavTabs();
}

function updateIndexOfNavTabs() {
    indexNavTabs = {};
    for (i = 0; i < navTabs.length; i++) {
        let name = navTabs[i].getAttribute('data-name');
        indexNavTabs[name] = i;
    }
}

function addTrackCount() {
    const TRACK_COUNT_ID = 'yamutools_track_count'
    let element = document.querySelector('.page-playlist__info-wrapper')
    if (element) {
        let span = document.querySelector(`#${TRACK_COUNT_ID}`)
        if (!span) {
            span = document.createElement('span')
            span.id = TRACK_COUNT_ID
            element.insertAdjacentElement('beforeend', span)
        }
        receivePlaylistByLocation((playlist) => {
            span.innerText = ` - треков: ${playlist.trackCount}`
        })
    }
}