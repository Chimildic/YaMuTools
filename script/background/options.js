const DEFAULT_OPTIONS = {
    onPodcastHater: false,
    onRemoveNavKids: false,
    onUserTab: false,
    dataUserTab: { title: '', url: '' },
    offTeaserPlaylist: false,
    onCollectorTool: true,
    onRandomCover: true,
    onLastfmCollector: true,
    onMixHater: true,
    onToolNoDuplicate: true,
    onLikerTool: true,
    onExporterTool: true,
    onDonateSection: true,
    requestLastfmRange: 5,
    actionWithPlaylist: 'newEveryTime',
    createdPlaylists: {},
    onSpotifyCollector: false,
    showFeedbackAlert: true,
    lastShownFeedbackAlert: 0,
    strDateInstall: new Date().toUTCString(),
    reassignLoginLastfm: '',
    countCreatedPlaylist: 0,
    openChangelogWithUpdate: false,
    similarPlaylistCountTracks: 60,
    similarThreshold: 0.5,
    isFirstInstall: true,
};

function patchCurrentOptions(callback) {
    browser.storage.local.get(null, (items) => {
        let defaultKeys = Object.keys(DEFAULT_OPTIONS);
        defaultKeys.forEach((key) => {
            if (!items.hasOwnProperty(key) || typeof items[key] != typeof DEFAULT_OPTIONS[key]) {
                items[key] = DEFAULT_OPTIONS[key];
            }
        });

        let currentKeys = Object.keys(items);
        currentKeys.forEach((key) => {
            if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
                delete items[key];
            }
        });

        setOptions(items, callback);
    });
}

function setDefaultOptions(callback) {
    setOptions(DEFAULT_OPTIONS, callback);
}

function setOptions(json, callback) {
    browser.storage.local.set(json, function () {
        if (!browser.runtime.lastError && callback) {
            callback();
        }
    });
}
