const ORDER_MENU_ITEM = {
    title: 'Сортировка',
    handler: switchMainAndOrderContext,
};

const ORDER_CONTEXT_MENU = {
    id: 'orderMain',
    items: [
        { header: true, title: 'Сортировка', handler: switchMainAndOrderContext },
        {
            title: 'По алфавиту (А-Я)',
            handler: () => showSortAlert().then((result) => onClickOrderTool(result, 'asc')),
        },
        {
            title: 'По алфавиту (Я-А)',
            handler: () => showSortAlert().then((result) => onClickOrderTool(result, 'desc')),
        },
        {
            title: 'Случайно',
            handler: () => showSortAlert().then((result) => onClickOrderTool(result, 'random')),
        },
    ],
};

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

function onClickOrderTool(result, type) {
    toggleDropdown('menuPlaylistMain');
    if (result.isConfirmed) {
        sortPlaylistTracks(type);
    }
}

function sortPlaylistTracks(type) {
    receivePlaylistByLocation((playlist) => {
        if (type == 'random') {
            shuffle(playlist.tracks);
        } else {
            sortByTitle(playlist.tracks);
            if (type == 'desc') {
                playlist.tracks.reverse();
            }
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
