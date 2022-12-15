function receiveLabelAlbumsByLocation(countAlbums) {
    return new Promise(async resolve => {
        let idLabel = location.pathname.split('/')[2];
        let sortType = new URLSearchParams(window.location.search).get('sort') || 'year'
        let countChunk = Math.ceil(countAlbums / 100);
        let albums = [];
        let label = { name: 'unknown' };
        for (let i = 0; i < countChunk; i++) {
            let url = `${HANDLER_LABEL_ITEMS}?id=${idLabel}&page=${i}&what=albums&sort=${sortType}`;
            let response = await requestGET(url);
            albums.push(response.albums);
            label = response.label;
            if (response.pager.total <= albums.length) {
                break;
            }
        }

        albums = albums.flat(1).slice(0, countAlbums);
        resolve({ label: label, albums: albums });
    })
}

function receiveNewReleaseAlbums(callback) {
    requestGET(HANDLER_NEW_RELEASES, (responseJSON) =>
        receiveAlbumsById(responseJSON.newReleases)
            .then((albums) => appendTracksToAlbums(albums))
            .then((albums) => callback(albums))
    );
}

function receiveAlbumsById(ids) {
    return new Promise(resolve => {
        let url = `${HANDLER_ALBUMS}?albumIds=${ids}`;
        requestGET(url, (responseJSON) => resolve(responseJSON));
    })
}

function appendTracksToAlbums(albums) {
    return new Promise(resolve => {
        let albumsComplete = 0;
        for (let i = 0; i < albums.length; i++) {
            let album = albums[i];
            receiveTracksByAlbumId(album.id, (albumTracks) => {
                album.tracks = albumTracks;
                if (++albumsComplete == albums.length) {
                    resolve(albums);
                }
            });
        }
    })
}
