const SIMILAR_TRACKS_MENU_ITEM = {
    title: 'Создать похожий плейлист',
    handler: onClickSimilarPlaylist,
};

function onClickSimilarPlaylist() {
    toggleDropdown('menuPlaylistMain');
    fireCollectorSwal('');

    receivePlaylistByLocation((playlist) => {
        shuffle(playlist.tracks);
        playlist.tracks.length = roundLength(playlist.tracks.length, 500);
        chrome.storage.sync.get(['similarPlaylistCountTracks', 'similarThreshold'], (items) => {
            collectSimilarTracksLastfm(formatTracksToNamesForLastmSimilar(playlist.tracks), items.similarThreshold, (response) => {
                shuffle(response);
                response.length = roundLength(response.length, 250);
                searchTracksByImport(formatLastfmTracksToNames(response), (tracks) => {
                    removeDislikeIds(getTrackIds(tracks), (trackIds) => {
                        removeCopyByIdRecoverSort(trackIds);
                        shuffle(trackIds);
                        trackIds.length = roundLength(trackIds.length, items.similarPlaylistCountTracks);
                        createPlaylistWithRedirect({
                            title: 'Похоже на ' + playlist.title,
                            description: `Случайная выборка треков, которые похожи на плейлист "${playlist.title}".`,
                            trackIds: trackIds,
                        });
                    });
                });
            });
        });
    });
}

function formatTracksToNamesForLastmSimilar(source) {
    let parentTracks = [];
    for (i = 0; i < source.length; i++) {
        if (source[i].artists.length != 0 && source[i].title) {
            parentTracks.push({
                artist: source[i].artists[0].name,
                track: source[i].title,
            });
        }
    }
    return parentTracks;
}

function collectSimilarTracksLastfm(parentTracks, similarThreshold, callback) {
    let childTracks = [];
    let complete = 0;
    for (let i = 0; i < parentTracks.length; i++) {
        receiveSimilarByTrackLastfm(parentTracks[i].artist, parentTracks[i].track, (responseJSON) => {
            if (responseJSON != 'error' && responseJSON.hasOwnProperty('similartracks')) {
                let tracks = matchFilterLastfm(responseJSON.similartracks.track, similarThreshold);
                childTracks.push.apply(childTracks, tracks);
            }
            if (++complete == parentTracks.length) {
                callback(childTracks);
            }
        });
    }
}

function matchFilterLastfm(tracks, threshold) {
    let filteredTracks = [];
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].hasOwnProperty('match') && tracks[i].match >= threshold) {
            filteredTracks.push(tracks[i]);
        }
    }
    return filteredTracks;
}

function roundLength(value, max) {
    return value > max ? max : value;
}
