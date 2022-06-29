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
    showFeedbackAlert: true,
    strLastDateFeedbackAlert: new Date().toUTCString(),
    strDateInstall: new Date().toUTCString(),
    reassignLoginLastfm: '',
    countCreatedPlaylist: 0,
    openChangelogWithUpdate: false,
    similarPlaylistCountTracks: 60,
    similarThreshold: 0.5,
    isFirstInstall: true,
    canShowSurvey: true,
};

function patchCurrentOptions(callback) {
    chrome.storage.sync.get(null, (items) => {
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
    chrome.storage.sync.set(json, function () {
        if (!chrome.runtime.lastError && callback) {
            callback();
        }
    });
}
