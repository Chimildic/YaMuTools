const PAGE_MAIN = '.page-line_podcasts';
const PAGE_PLAYLIST = '.page-playlist';
const PAGE_ARTIST = '.page-artist';
const PAGE_USERMUSIC_PLAYLISTS = '.page-users__playlists';
const PAGE_USERMUSIC_TRACKS = '.page-users__tracks';
const PAGE_USERMUSIC_ALBUMS = '.page-users__albums';
const PAGE_USERMUSIC_ARTISTS = '.page-users__artists';

function getAvailableModify() {
    let key, method;
    let pathname = location.pathname.split('/');

    if (pathname.length == 4 && pathname[1] == 'users') {
        method = modifyUserMusicPage;
        if (pathname[3] == 'playlists') {
            key = PAGE_USERMUSIC_PLAYLISTS;
        } else if (pathname[3] == 'tracks') {
            key = PAGE_USERMUSIC_TRACKS;
        } else if (pathname[3] == 'artists') {
            key = PAGE_USERMUSIC_ARTISTS;
        } else if (pathname[3] == 'albums') {
            key = PAGE_USERMUSIC_ALBUMS;
        }
    } else if (pathname.length == 5 && pathname[3] == 'playlists') {
        key = PAGE_PLAYLIST;
        method = modifyPlaylistPage;
    } else if (pathname[1] == 'artist') {
        key = PAGE_ARTIST;
        method = modifyArtistPage;
    } else if (pathname[1] == 'home') {
        key = PAGE_MAIN;
        method = modifyPodcastElements;
    }

    let available = false;
    if (key && method) {
        available = true;
    }

    return { available: available, key: key, method: method };
}

function modifyNavTabs() {
    browser.storage.local.get(['onFeedTab', 'onPodcastHater', 'onUserTab', 'dataUserTab', 'onRemoveNavKids'], function (items) {
        items.onPodcastHater && removeNavTab('non-music');
        items.onRemoveNavKids  && removeNavTab('kids');
        items.onUserTab ? insertUserNavTab(items.dataUserTab.title, items.dataUserTab.url, 'userTabId') : removeById('userTabId');
    });
}


function modifyTeaserPlaylist() {
    browser.storage.local.get(['offTeaserPlaylist'], function (items) {
        let teaser = document.querySelector('.sidebar__under');
        if (items.offTeaserPlaylist && teaser) {
            teaser.remove();
        }
    });
}

function modifyUserMusicPage(key) {
    browser.storage.local.get(['onCollectorTool', 'onLastfmCollector', 'onSpotifyCollector'], function (items) {
        _ = items.onCollectorTool && key == PAGE_USERMUSIC_PLAYLISTS && isOwnerPage() ? addCollectorOfUserMusic(items.onLastfmCollector, items.onSpotifyCollector) : removeCollectorTool();
    });
}

function modifyPlaylistPage(key) {
    if (key != PAGE_PLAYLIST) {
        return;
    }

    browser.storage.local.get(['onLikerTool', 'onExporterTool', 'onRandomCover', 'onToolNoDuplicate'], function (items) {
        _ = items.onRandomCover ? addItemRandomCover() : removeItemRandomCover();

        addMenuPlaylist({
            onLikerTool: items.onLikerTool,
            onExporterTool: items.onExporterTool,
            onToolNoDuplicate: items.onToolNoDuplicate,
            onRandomCover: items.onRandomCover,
        });
    });
}

function modifyArtistPage(key) {
    browser.storage.local.get(['onCollectorTool'], function (items) {
        _ = items.onCollectorTool && key == PAGE_ARTIST ? addCollectorOfArtist() : removeCollectorTool();
    });
}

function modifyPodcastElements() {
    browser.storage.local.get(['onPodcastHater'], function (items) {
        if (items.onPodcastHater) {
            removePodcastElements();
        }
    });
}
