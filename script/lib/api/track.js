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

function receiveFavoriteTrackIds(callback) {
    requestGET(API_FAV, (responseJSON) => callback(formatFavoriteListToTrackIds(responseJSON)));
}