const ORDER_MENU_ITEM = {
    title: 'Сортировка',
    handler: switchMainAndOrderContext,
};

const ORDER_CONTEXT_MENU = {
    id: 'orderMain',
    items: [
        { header: true, title: 'Сортировка', handler: switchMainAndOrderContext },
        {
            title: 'Случайно',
            handler: () => onClickOrderTool('random'),
        },
        {
            title: 'По треку (А-Я)',
            handler: () => onClickOrderTool('track', 'asc'),
        },
        {
            title: 'По треку (Я-А)',
            handler: () => onClickOrderTool('track', 'desc'),
        },
        {
            title: 'По исполнителю (А-Я)',
            handler: () => onClickOrderTool('artist', 'asc'),
        },
        {
            title: 'По исполнителю (Я-А)',
            handler: () => onClickOrderTool('artist', 'desc'),
        },
        {
            title: 'По альбому (А-Я)',
            handler: () => onClickOrderTool('album', 'asc'),
        },
        {
            title: 'По альбому (Я-А)',
            handler: () => onClickOrderTool('album', 'desc'),
        },
        {
            title: 'По длительности (0-1)',
            handler: () => onClickOrderTool('duration', 'asc'),
        },
        {
            title: 'По длительности (1-0)',
            handler: () => onClickOrderTool('duration', 'desc'),
        },
    ],
};

function onClickOrderTool(type, direction) {
    toggleDropdown('orderMain');
    showSortAlert().then((result) => {
        if (result.isConfirmed) {
            sortPlaylistTracks(type, direction);
        }
    });
}

function switchMainAndOrderContext() {
    toggleDropdown('orderMain');
    toggleDropdown('menuPlaylistMain');
}

function showSortAlert() {
    return Swal.fire({
        title: 'Вы действительно хотите изменить сортировку треков?',
        text: 'Вернуть текущую сортировку нельзя',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Закрыть',
        cancelButtonColor: '#d33',
    });
}

function sortPlaylistTracks(type, direction) {
    receivePlaylistByLocation((playlist) => {
        if (type == 'random') {
            shuffle(playlist.tracks);
        } else if (type == 'track') {
            sortByTitle(playlist.tracks, direction);
        } else if (type == 'artist') {
            sortByArtist(playlist.tracks, direction);
        } else if (type == 'album') {
            sortByAlbum(playlist.tracks, direction);
        } else if (type == 'duration') {
            sortByDuration(playlist.tracks, direction);
        }
        replaceAllTracks(
            {
                trackCount: playlist.trackCount,
                trackIds: getTrackIds(playlist.tracks),
                kind: playlist.kind,
                revision: playlist.revision,
            },
            () => {
                redirectToPlaylist(playlist.kind);
            }
        );
    });
}

function sortByDuration(tracks, direction) {
    tracks.sort((x, y) => {
        if (x && x.durationMs && y && y.durationMs) {
            if (direction == 'asc') {
                return x.durationMs - y.durationMs;
            }
            return y.durationMs - x.durationMs;
        }
        console.error('Ошибка при сортировке треков по продолжительности:', x, y);
        return 1;
    });
}

function sortByAlbum(tracks, direction) {
    tracks.sort((x, y) => {
        if (x && x.albums && x.albums.length > 0 && y && y.albums && y.albums.length > 0) {
            return direction == 'asc'
                ? x.albums[0].title.localeCompare(y.albums[0].title)
                : y.albums[0].title.localeCompare(x.albums[0].title);
        }
        console.error('Ошибка при сортировке треков по альбому:', x, y);
        return 1;
    })
}