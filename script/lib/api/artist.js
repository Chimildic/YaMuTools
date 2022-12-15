async function receiveAlbumsOfArtist(callback) {
    let artistId = getArgsByLocation()['artistId'];
    let url = `${HANDLER_ARTIST}?artist=${artistId}&what=albums&external-domain=music.yandex.${domain}`;
    let response = await requestGET(url);
    await appendTracksToAlbums(response.albums);
    callback({ artist: response.artist, albums: response.albums })
}
