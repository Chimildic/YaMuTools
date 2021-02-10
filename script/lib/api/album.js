function receiveNewReleaseAlbums(callback) {
    requestGET(HANDLER_NEW_RELEASES, (responseJSON) =>
        receiveAlbumsById(responseJSON.newReleases, (albums) => appendTracksToAlbums(albums, callback))
    );
}

function receiveAlbumsById(ids, callback) {
    let url = `${HANDLER_ALBUMS}?albumIds=${ids}`;
    requestGET(url, (responseJSON) => callback(responseJSON));
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
