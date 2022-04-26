function receiveNewReleaseAlbums(callback) {
    requestGET(HANDLER_NEW_RELEASES, (responseJSON) =>
        receiveAlbumsById(responseJSON.newReleases)
            .then((albums) => appendTracksToAlbums(albums, callback))
    );
}

function receiveAlbumsById(ids) {
    return new Promise(resolve => {
        let url = `${HANDLER_ALBUMS}?albumIds=${ids}`;
        requestGET(url, (responseJSON) => resolve(responseJSON));
    })
}

function appendTracksToAlbums(albums, callback) {
    let albumsComplete = 0;
    for (let i = 0; i < albums.length; i++) {
        let album = albums[i];
        receiveTracksByAlbumId(album.id, (albumTracks) => {
            album.tracks = albumTracks;
            if (++albumsComplete == albums.length) {
                callback(albums);
            }
        });
    }
}
