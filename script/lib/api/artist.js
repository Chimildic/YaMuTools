function receiveAlbumsOfArtist(callback) {
    let artistId = getArgsByLocation()['artistId'];
    let url = `${HANDLER_ARTIST}?artist=${artistId}&what=albums&external-domain=music.yandex.${domain}`;
    requestGET(url, (responseJSON) =>
        appendTracksToAlbums(responseJSON.albums, (albums) => callback({ artist: responseJSON.artist, albums: albums }))
    );
}
