const FILTER_MENU_ITEM = {
    title: 'Фильтр треков',
    handler: switchMainAndFilterContext,
};

const FILTER_CONTEXT_MENU = {
    id: 'filterMain',
    items: [
        { header: true, title: 'Фильтр треков', handler: switchMainAndFilterContext },
        {
            title: 'Удалить с пометкой "Е"',
            handler: () => onClickFilterTool(onClickRemoveExplicitTracks),
        },
        {
            title: 'Удалить дизлайки',
            handler: () => onClickFilterTool(onClickRemoveDislikesTracks),
        },
        {
            title: 'Удалить ремиксы',
            handler: () => onClickFilterTool(onClickRemoveMixTracks),
        },
        {
            title: 'Удалить кириллицу',
            handler: () => onClickFilterTool(onClickRemoveRuTracks),
        },
    ],
};

function switchMainAndFilterContext() {
    toggleDropdown('filterMain');
    toggleDropdown('menuPlaylistMain');
}

function onClickFilterTool(callback) {
    toggleDropdown('filterMain');
    receivePlaylistByLocation((playlist) => callback(playlist));
}

function onClickRemoveExplicitTracks(playlist) {
    playlist.tracks = playlist.tracks.filter((track) => !track.hasOwnProperty('contentWarning') || track.contentWarning != 'explicit');
    updateTracksWithFilter(playlist);
}

function onClickRemoveDislikesTracks(playlist) {
    receiveFavoriteTrackIds(function (dislikeTrackIds) {
        let playlistTrackIds = getTrackIds(playlist.tracks);
        playlistTrackIds = playlistTrackIds.filter((item) => !dislikeTrackIds.some((dislikeTrack) => dislikeTrack.id == item.id));
        updateTracksWithFilter(playlist, playlistTrackIds);
    });
}

function onClickRemoveMixTracks(playlist) {
    Swal.fire({
        title: 'Выберите что удалять',
        html:
            '<div style="display:flex;"><div style="text-align:left;margin:auto;"><p><input type="checkbox" id="choose-mix" checked/> <label for="choose-mix">remix</label><p/>' +
            '<p><input type="checkbox" id="choose-club" checked/> <label for="choose-club">club</label></p>' +
            '<p><input type="checkbox" id="choose-live" checked/> <label for="choose-live">live</label></p>' +
            '<p><input type="checkbox" id="choose-version" checked/> <label for="choose-version">version</label></p>' +
            '<p><input type="checkbox" id="choose-karaoke" checked/> <label for="choose-karaoke">karaoke</label></p>' +
            '<p><input type="checkbox" id="choose-instrumental" checked/> <label for="choose-instrumental">karaoke</label></p>' +
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

function updateTracksWithFilter(playlist, ids) {
    replaceAllTracks(
        {
            trackCount: playlist.trackCount,
            trackIds: ids ? ids : getTrackIds(playlist.tracks),
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
