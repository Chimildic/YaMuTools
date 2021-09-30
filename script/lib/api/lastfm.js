function receiveTopTracksLastfm(data, callback) {
    getLastfmLogin(function () {
        if (!loginLastfm) {
            return;
        }
        let url = `${LASTFM_TOP_TRACKS}&user=${loginLastfm}&limit=${data.limit}&period=${data.period}`;
        backgroundGET(url, (responseJSON) => callback(formatLastfmTracksToNames(responseJSON.toptracks.track)));
    });
}

function receiveMixLastfm(callback) {
    receiveStationLastfm('mix', callback);
}

function receiveLibraryLastfm(callback) {
    receiveStationLastfm('library', callback);
}

function receiveRecommendedLastfm(callback) {
    receiveStationLastfm('recommended', callback);
}

function receiveNeighboursLastfm(callback) {
    receiveStationLastfm('neighbours', callback);
}

function receiveStationLastfm(arg, callback) {
    getLastfmLogin(function () {
        if (!loginLastfm) {
            return;
        }

        browser.storage.local.get(['requestLastfmRange'], function (items) {
            let total = items.requestLastfmRange;
            let complete = 0;
            let tracks = [];
            let url = `${LASTFM_STATION}${loginLastfm}/${arg}`;
            for (let i = 0; i < total; i++) {
                backgroundGET(url, (responseJSON) => {
                    if (responseJSON != 'error' && responseJSON.hasOwnProperty('playlist')) {
                        tracks.push.apply(tracks, responseJSON.playlist);
                    }
                    if (++complete == total) {
                        callback(formatLastfmTracksToNames(tracks));
                    }
                });
            }
        });
    });
}

function receiveLovedTracksLastfm(callback) {
    getLastfmLogin(function () {
        if (!loginLastfm) {
            return;
        }
        let page = 1;
        let tracks = [];
        receiveLovedTracksLastfmByPage(page, function (responseJSON) {
            tracks.push.apply(tracks, responseJSON.lovedtracks.track);
            if (page == responseJSON.lovedtracks['@attr'].totalPages) {
                callback(formatLastfmTracksToNames(tracks));
            } else {
                receiveLovedTracksLastfmByPage(++page, arguments.callee);
            }
        });
    });
}

function receiveLovedTracksLastfmByPage(page, callback) {
    let url = `${LASTFM_LOVED_TRACKS}&user=${loginLastfm}&page=${page}&limit=100`;
    backgroundGET(url, (responseJSON) => callback(responseJSON));
}

function receiveSimilarByTrackLastfm(artist, track, callback) {
    let url = `${LASTFM_SIMILAR_TRACKS}&artist=${artist}&track=${track}&limit=25&autocorrect=1`;
    backgroundGET(url, (responseJSON) => callback(responseJSON));
}

function formatLastfmTracksToNames(lastfmTracks) {
    let names = [];
    for (let i = 0; i < lastfmTracks.length; i++) {
        let artist = '';
        if (lastfmTracks[i].hasOwnProperty('artist')) {
            artist = lastfmTracks[i].artist.name;
        } else if (lastfmTracks[i].hasOwnProperty('artists')) {
            artist = lastfmTracks[i].artists[0].name;
        }
        let name = `${artist} - ${lastfmTracks[i].name}`.replace(/(\r\n|\r|\n|&)/, ' ').trim();
        names += name + '\n';
    }
    return names;
}
