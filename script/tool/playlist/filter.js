const FILTER_MENU_ITEM = {
    title: 'Фильтр треков',
    handler: switchMainAndFilterContext,
};

const FILTER_CONTEXT_MENU = {
    id: 'filterMain',
    items: [
        { header: true, title: 'Фильтр треков', handler: switchMainAndFilterContext },
        {
            title: 'Управление диз/лайками',
            handler: () => onClickFilterTool(onClickControlDislikesTracks),
        },
        {
            title: 'Управление ремиксами',
            handler: () => onClickFilterTool(onClickControlMixTracks),
        },
        {
            title: 'Удалить недавно игравшие',
            handler: () => onClickFilterTool(onClickRemoveHistoryTracks),
        },
        {
            title: 'Удалить с пометкой "Е"',
            handler: () => onClickFilterTool(onClickRemoveExplicitTracks),
        },
        {
            title: 'Удалить кириллицу',
            handler: () => onClickFilterTool(onClickRemoveRuTracks),
        },
        {
            title: 'Вычитание плейлистов',
            handler: () => onClickFilterTool(onClickSubTracksByPlaylists),
        },
        {
            title: 'Вычитание исполнителей',
            handler: () => onClickFilterTool(onClickSubTracksByArtists),
        }
    ],
};

function switchMainAndFilterContext() {
    toggleDropdown('filterMain');
    toggleDropdown('menuPlaylistMain');
}

function onClickFilterTool(callback) {
    toggleDropdown('filterMain');
    fireLoadingSwal('Загрузка плейлиста..');
    receivePlaylistByLocation((playlist) => callback(playlist));
}

function onClickRemoveExplicitTracks(playlist) {
    playlist.tracks = playlist.tracks.filter((track) => !track.hasOwnProperty('contentWarning') || track.contentWarning != 'explicit');
    updateTracksWithFilter(playlist);
}

function onClickControlDislikesTracks(playlist) {
    fireSelectSwal({
        title: 'Управление диз/лайками',
        inputPlaceholder: 'Выберите действие',
        inputOptions: {
            removeDislikes: 'Удалить только дизлайки',
            removeLikes: 'Удалить только лайки',
            removeFAV: 'Удалить оба типа',
            removeAllExceptLikes: 'Оставить только лайки',
        },
    }).then(async (action) => {
        if (!action.isConfirmed) {
            return;
        }

        let ids = getTrackIds(playlist.tracks);
        if (action.value == 'removeDislikes') {
            removeDislikeIds(ids, callback);
        } else if (action.value == 'removeLikes') {
            removeLikeIds(ids, callback);
        } else if (action.value == 'removeFAV') {
            removeFav(ids, callback);
        } else if (action.value == 'removeAllExceptLikes') {
            callback(await removeAllExceptLikes(ids));
        }
    });

    function callback(tracksIds) {
        updateTracksWithFilter(playlist, tracksIds);
    }
}

function onClickControlMixTracks(playlist) {
    Swal.fire({
        title: 'Выберите что удалять',
        html:
            '<div style="display:flex;"><div style="text-align:left;margin:auto;"><p><input type="checkbox" id="choose-mix" checked/> <label for="choose-mix">remix</label><p/>' +
            '<p><input type="checkbox" id="choose-club" checked/> <label for="choose-club">club</label></p>' +
            '<p><input type="checkbox" id="choose-live" checked/> <label for="choose-live">live</label></p>' +
            '<p><input type="checkbox" id="choose-version" checked/> <label for="choose-version">version</label></p>' +
            '<p><input type="checkbox" id="choose-karaoke" checked/> <label for="choose-karaoke">karaoke</label></p>' +
            '<p><input type="checkbox" id="choose-instrumental" /> <label for="choose-instrumental">instrumental</label></p>' +
            '<p><input type="checkbox" id="choose-cover"/> <label for="choose-cover">cover</label></p>' +
            '<p><input type="checkbox" id="choose-radio"/> <label for="choose-radio">radio</label></p>' +
            '<p><input type="checkbox" id="choose-piano"/> <label for="choose-piano">piano</label></p>' +
            '<p><input type="checkbox" id="choose-acoustic"/> <label for="choose-acoustic">acoustic</label</p>' +
            '<p><input type="checkbox" id="choose-edit"/> <label for="choose-edit">edit</label></p></div></div>',
        confirmButtonText: 'Продолжить',
        preConfirm: () => {
            let elements = Swal.getPopup().querySelectorAll('[id*=choose-]');
            let values = [];
            elements.forEach((e) => {
                if (e.checked) {
                    values.push(e.id.split('-')[1]);
                }
            });
            return { strRegex: values.join('|') };
        },
    }).then((result) => {
        if (result.isConfirmed) {
            playlist.tracks = matchExcept(playlist.tracks, result.value.strRegex);
            updateTracksWithFilter(playlist);
        }
    });
}

function onClickRemoveRuTracks(playlist) {
    playlist.tracks = matchExcept(playlist.tracks, '[а-яА-ЯёЁ]+');
    updateTracksWithFilter(playlist);
}

async function onClickRemoveHistoryTracks(playlist) {
    Swal.fire({
        title: 'История прослушиваний',
        input: 'text',
        text: 'Сколько недавних треков из истории учитывать?',
        inputValue: 500,
        showCancelButton: true,
        cancelButtonText: 'Отмена',
        inputValidator: (value) => {
            if (!/^[1-9]\d*$/.test(value)) {
                return 'Некорректное число';
            }
        }
    }).then(result => {
        if (!result.isConfirmed) {
            return;
        }

        receiveHistory()
            .then(history => {
                if (!history.hasTracks) {
                    fireInfoSwal('В истории прослушиваний нет треков.');
                    return;
                }

                let value = parseInt(result.value);
                if (history.trackIds.length > value) {
                    history.trackIds.length = value;
                }
                let historyIds = history.trackIds.map(id => `${id}`.split(':')[0]);
                playlist.tracks = playlist.tracks.filter((track) => {
                    let result = !historyIds.includes(track.id);
                    if (result && track.id != track.realId) {
                        return !historyIds.includes(track.realId);
                    }
                    return result;
                });
                updateTracksWithFilter(playlist);
            });
    });
}

function onClickSubTracksByPlaylists(sourcePlaylist) {
    receiveAllPlaylists(playlists => {
        let html = playlists.reduce((html, p) => (html += `<p><input type="checkbox" id="choose-${p.kind}"/> <label for="choose-${p.kind}">${p.title}</label><p/>`, html), '')
        html = `<div><p>Выберите плейлисты, треки которых нужно удалить из текущего плейлиста "${sourcePlaylist.title}"</p></div></br><div style="display:flex;overflow-y:scroll;height: 200px"><div style="text-align:left;margin:auto;">${html}</div></div>`;

        Swal.fire({
            title: 'Вычитание',
            html: html,
            confirmButtonText: 'Продолжить',
            preConfirm: preConfirmForSubTracks,
        }).then(async result => {
            if (!result.isConfirmed) {
                return;
            }

            for (let i = 0; i < result.value.length; i++) {
                let playlist = await receivePlaylistByKind(result.value[i]);
                sourcePlaylist.tracks = sourcePlaylist.tracks.filter((track) => !playlist.tracks.some(item => item.id == track.id));
            }
            updateTracksWithFilter(sourcePlaylist);
        })
    });
}

function onClickSubTracksByArtists(sourcePlaylist) {
    let artistGroups = sourcePlaylist.tracks
        .map(t => t.artists || []).flat()
        .reduce((artistGroups, artist) => ((artistGroups[artist.id] = artist.name), artistGroups), {})
    let artists = Object.keys(artistGroups).map(key => ({ name: artistGroups[key], id: key }))
    artists.sort((x, y) => x.name.localeCompare(y.name))

    let html = artists.reduce((html, a) => (html += `<p><input type="checkbox" id="choose-${a.id}"/> <label for="choose-${a.id}">${a.name}</label><p/>`, html), '')
    html = `<div><p>Выберите исполнителей, треки которых нужно удалить из текущего плейлиста "${sourcePlaylist.title}"</p></div></br><div style="display:flex;overflow-y:scroll;height: 200px"><div style="text-align:left;margin:auto;">${html}</div></div>`;

    Swal.fire({
        title: 'Вычитание',
        html: html,
        confirmButtonText: 'Продолжить',
        preConfirm: preConfirmForSubTracks,
    }).then(async result => {
        if (!result.isConfirmed) {
            return;
        }

        sourcePlaylist.tracks = sourcePlaylist.tracks.filter(t =>
            !t.artists.find(a => result.value.includes(`${a.id}`))
        )
        updateTracksWithFilter(sourcePlaylist)
    })

}

function preConfirmForSubTracks() {
    let elements = Swal.getPopup().querySelectorAll('[id*=choose-]');
    let values = [];
    elements.forEach((e) => {
        if (e.checked) {
            values.push(e.id.split('-')[1]);
        }
    });
    return values;
}

function updateTracksWithFilter(playlist, ids) {
    let trackIds = ids || getTrackIds(playlist.tracks);
    if (playlist.trackCount == trackIds.length) {
        fireInfoSwal('Не обнаружено треков для удаления');
        return;
    }
    replaceAllTracks(
        {
            trackCount: playlist.trackCount,
            trackIds: trackIds,
            kind: playlist.kind,
            revision: playlist.revision,
        },
        () => {
            redirectToPlaylist(playlist.kind);
        }
    );
}

function matchExcept(items, strRegex) {
    return match(items, strRegex, true);
}

function match(items, strRegex, invert = false) {
    let regex = new RegExp(strRegex, 'i');
    return items.filter((item) => {
        let albumCheck = false;
        let versionCheck = false;
        if (typeof item == 'undefined') {
            return false;
        } else if (item.hasOwnProperty('error')) {
            return true;
        }
        if (item.hasOwnProperty('albums')) {
            albumCheck = regex.test(item.albums[0].title.formatName());
        }
        if (item.hasOwnProperty('version')) {
            versionCheck = regex.test(item.version.formatName());
        }
        return invert ^ (regex.test(item.title.formatName()) || albumCheck || versionCheck);
    });
}

String.prototype.formatName = function () {
    return this.toLowerCase()
        .replace(/[',?!@#$%^&*()+-./\\]/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/ё/g, 'е')
        .trim();
};
