const UGC_VISIBILITY = {
    PRIVATE: "private",
    PUBLIC: "public"
}

function setUgcVisibility(trackId, visibility) {
    let formData = `sign=${sign}&trackId=${trackId}&visibility=${visibility}`;
    let url = `https://music.yandex.ru/handlers/ugc-visibility.jsx`
    return requestPOST(url, formData)
}

function markTrack(args, callback) {
    let formData = `sign=${sign}`;
    let url = `${API_TRACK}${args.id}/web-own_playlists-playlist-track-main/${args.typeButton}/${args.typeRequest}`;
    requestPOST(url, formData, (responseJSON) => callback(responseJSON));
}

function receiveTracksFromPlaylist(callback) {
    receivePlaylistByLocation((playlist) => callback(playlist.tracks));
}

function receiveTracksByAlbumId(albumId, callback) {
    let url = `${HANDLER_ALBUM}?album=${albumId}`;
    requestGET(url, function (responseJSON) {
        let tracks = [];
        for (let i = 0; i < responseJSON.volumes.length; i++) {
            tracks.push.apply(tracks, responseJSON.volumes[i]);
        }
        callback(tracks);
    });
}

function receiveFavoriteTrackIds(type, callback) {
    requestGET(API_FAV, (responseJSON) => callback(formatFavoriteListToTrackIds(responseJSON, type)));
}

async function receiveAllTrackIdsOfLibrary(owner) {
    return (await requestGET(`${HANDLER_LIBRARY}?owner=${owner}&filter=tracks&likeFilter=all`)).trackIds
}

async function receiveTrackEntries(trackIds) {
    let formData = `entries=${trackIds.join(',')}&removeDuplicates=true&strict=true`
    return await requestPOST(HANDLER_TRACK_ENTRIES, formData)
    // let chunks = splitTrackIdsIntoChunks(trackIds)
    // let tracks = []
    // for (let i = 0; i < chunks.length; i++) {
    //     let formData = `entries=${chunks[i].join(',')}&removeDuplicates=false&strict=true`
    //     tracks.push(await requestPOST(HANDLER_TRACK_ENTRIES, formData))
    // }
    // return tracks.flat()
}