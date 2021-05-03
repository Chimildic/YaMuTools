const SIZE = ['700', '800', '900', '1000'];
function getUrlRandomPicture() {
    let size = SIZE[Math.floor(Math.random() * SIZE.length)];
    return PICSUM_RANDOM_PHOTO.replace('%%', size);
}

function receivePlaylistByLocation(callback) {
    receivePlaylist(getArgsByLocation(), callback);
}

function receivePlaylistByKind(kind, callback) {
    receivePlaylist({ owner: owner, kind: kind }, callback);
}

function receivePlaylist(args, callback) {
    let url = `${HANDLER_PLAYLIST}?owner=${args['owner']}&kinds=${args['kind']}&light=false`;
    requestGET(url, (response) => {
        callback(response.playlist ? response.playlist : response);
    });
}

function patchPlaylistWithRedirect(data) {
    patchPlaylist(data, (response) => {
        redirectToPlaylist(response.kind);
    });
}

function patchPlaylist(data, callback) {
    if (data.trackIds.length == 0) {
        fireInfoSwal(getMessage('info_no_tracks'));
        return;
    } else if (data.trackIds.length > 10000) {
        data.description += ' ' + getMessage('info_limit_tracks', [data.trackIds.length]);
        data.trackIds.length = 10000;
    }

    getActionWithPlaylist((action) => {
        executeActionWithPlaylist(action, data, callback);
    });

    incrementCreatedPlalist();
}

function executeActionWithPlaylist(action, data, callback) {
    if (!action || action == 'cancel') {
        fireInfoSwal('Действие отменено');
        return;
    }

    checkStoredPlaylists(data, (response) => {
        if (!response.success || action == 'newEveryTime' || data.type == 'discography') {
            createPlaylist(data, (result) => {
                saveMetaOfCreatedPlaylist(data);
                callback(result);
            });
            return;
        }

        if (action == 'askEveryTime') {
            promptActionWithPlaylist((result) => executeActionWithPlaylist(result, response, callback));
        } else if (action == 'appendToExists') {
            appendPlaylist(data, callback);
        } else if (action == 'updateIfExists') {
            updatePlaylist(data, callback);
        }
    });
}

function checkStoredPlaylists(data, callback) {
    getCreatedPlaylistByType(data.type, (response) => {
        if (response.success) {
            data.success = response.success;
            data.kind = response.kind;
            data.revision = response.revision;
            data.trackCount = response.trackCount;
            callback(data);
        } else {
            callback(response);
        }
    });
}

function promptActionWithPlaylist(callback) {
    fireSelectSwal({
        title: 'Способ создания плейлиста',
        inputPlaceholder: 'Выберите действие',
        inputOptions: {
            newEveryTime: 'Новый плейлист',
            updateIfExists: 'Обновить существующий',
            appendToExists: 'Добавить в существующий',
        },
    }).then((action) => {
        if (action.isConfirmed) {
            fireLoadingSwal('Действие выполняется..');
            callback(action.value);
        }
    });
}

function createCopyOfPlaylist(playlist, callback) {
    let data = {
        title: getMessage('pls_title_copy') + ' ' + playlist.title,
        description: playlist.description,
        trackIds: getTrackIds(playlist.tracks),
    };

    if (playlist.cover && playlist.cover.custom) {
        data.urlCover = 'https://' + playlist.cover.uri.replace('%%', '1000x1000');
    }

    createPlaylist(data, (responseJSON) => callback(responseJSON));
}

function createPlaylistWithRedirect(data) {
    createPlaylist(data, (response) => {
        incrementCreatedPlalist();
        redirectToPlaylist(response.kind);
    });
}

function createPlaylist(data, callback) {
    let formData = `action=add&title=${data.title}&sign=${sign}`;
    requestPOST(HANDLER_CHANGE_PLAYLIST, formData, (responseJSON) => {
        data.kind = responseJSON.playlist.kind;
        data.revision = 1;

        Promise.all([promisify(setCover)(data.kind, data.urlCover), promisify(insertTracks)(data)]).then(() => {
            changeDescription(data, (response) => callback(response.playlist));
        });
    });
}

function updatePlaylist(data, callback) {
    changeDescription(data, () => replaceAllTracks(data, () => callback(data)));
}

function appendPlaylist(data, callback) {
    changeDescription(data, () => insertTracks(data, () => callback(data)));
}

function getCreatedPlaylistByType(type, callback) {
    chrome.storage.sync.get(['createdPlaylists'], function (items) {
        if (!items.createdPlaylists.hasOwnProperty(type)) {
            callback({ success: false });
            return;
        }

        receivePlaylistByKind(items.createdPlaylists[type], (playlist) => {
            if (!playlist.hasOwnProperty('message')) {
                callback({
                    success: true,
                    kind: playlist.kind,
                    revision: playlist.revision,
                    trackCount: playlist.trackCount,
                });
            } else {
                removeCreatedPlaylist(type);
                callback({ success: false });
            }
        });
    });
}

function getActionWithPlaylist(callback) {
    chrome.storage.sync.get(['actionWithPlaylist'], function (items) {
        callback(items.actionWithPlaylist);
    });
}

function removeCreatedPlaylist(type) {
    chrome.storage.sync.get(['createdPlaylists'], function (items) {
        delete items.createdPlaylists[type];
        saveOption('createdPlaylists', items.createdPlaylists);
    });
}

function saveMetaOfCreatedPlaylist(data) {
    chrome.storage.sync.get(['createdPlaylists'], function (items) {
        items.createdPlaylists[data.type] = data.kind;
        saveOption('createdPlaylists', items.createdPlaylists);
    });
}

function changeDescription(data, callback) {
    let formData = `action=change-description&kind=${data.kind}&description=${data.description}&sign=${sign}`;
    requestPOST(HANDLER_CHANGE_PLAYLIST, formData, callback);
}

function setCover(kind, urlCover, callback) {
    if (!urlCover) {
        setRandomCover(kind, callback);
        return;
    }

    backgroundFileGET(urlCover, (cover) => {
        let url = `${HANDLER_UPLOADPIC}?kind=${kind}&sign=${sign}`;
        let formData = new FormData();
        formData.append('file', cover);
        requestFilePOST(url, formData, callback);
    });
}

function setRandomCover(kind, callback) {
    chrome.storage.sync.get(['onRandomCover'], function (items) {
        if (!items.onRandomCover) {
            callback();
            return;
        }

        let urlCover = getUrlRandomPicture();
        setCover(kind, urlCover, callback);
    });
}

function replaceAllTracks(data, callback) {
    refreshSign(() => {
        removeAllTracks(data, (responseJSON) => {
            insertTracks(
                {
                    kind: responseJSON.playlist.kind,
                    revision: responseJSON.playlist.revision,
                    trackIds: data.trackIds,
                },
                (response) => callback(response)
            );
        });
    });
}

function removeAllTracks(data, callback) {
    let diff = JSON.stringify([{ op: 'delete', from: 0, to: data.trackCount }]);
    let formData = `owner=${uid}&kind=${data.kind}&revision=${data.revision}&diff=${diff}&sign=${sign}`;
    requestPOST(HANDLER_PLAYLIST_PATCH, formData, (responseJSON) => callback(responseJSON));
}

function insertTracks(data, callback) {
    let chunks = splitTrackIdsIntoChunks(data.trackIds);
    let position = 0;
    let arrayFormData = [];
    for (let i = 0; i < chunks.length; i++) {
        let args = {
            kind: data.kind,
            revision: data.revision,
            chunk: chunks[i],
            position: position,
        };
        arrayFormData.push(createFormDataForInsertTracks(args));
        position += chunks[i].length - 1;
        data.revision += 1;
    }
    sendQueuePOST(HANDLER_PLAYLIST_PATCH, arrayFormData, callback);
}

function splitTrackIdsIntoChunks(trackIds) {
    let chunks = [];
    let size = 1000;
    let countChunk = Math.ceil(trackIds.length / size);
    for (let i = 0; i < countChunk; i++) {
        chunks.push(trackIds.slice(i * size, i * size + size));
    }
    return chunks;
}

function createFormDataForInsertTracks(args) {
    let diff = JSON.stringify([{ op: 'insert', at: args.position, tracks: args.chunk }]);
    return `owner=${uid}&kind=${args.kind}&revision=${args.revision}&diff=${diff}&sign=${sign}`;
}

function redirectToPlaylist(kind) {
    location.href = `https://music.yandex.${domain}/users/${owner}/playlists/${kind}`;
}

function incrementCreatedPlalist() {
    chrome.storage.sync.get(['countCreatedPlaylist'], (items) => {
        saveOption('countCreatedPlaylist', ++items.countCreatedPlaylist);
    });
}
