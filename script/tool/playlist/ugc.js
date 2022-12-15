const UGC_VISIBILITY_MENU_ITEM = {
    title: "Видимость mp3",
    handler: switchMainAndUgcContext,
};

const UGC_CONTEXT_MENU = {
    id: 'ugcMain',
    items: [
        { header: true, title: "Видимость mp3", handler: switchMainAndUgcContext },
        {
            title: "Опубликовать все",
            handler: () => onClickUgc({ visibility: UGC_VISIBILITY.PUBLIC }),
        },
        {
            title: "Скрыть все",
            handler: () => onClickUgc({ visibility: UGC_VISIBILITY.PRIVATE }),
        },
    ],
};

function switchMainAndUgcContext() {
    toggleDropdown('ugcMain');
    toggleDropdown('menuPlaylistMain');
}

function onClickUgc(args) {
    toggleDropdown('ugcMain');
    fireWaitingServerSwal();
    let promises = []
    receiveTracksFromPlaylist((tracks) =>  {
        tracks.forEach(t =>  {
            if (t.filename) {
                promises.push(setUgcVisibility(t.id, args.visibility))
            }
        })
        Promise.all(promises).then(() => {
            location.reload()
        })
    });
}