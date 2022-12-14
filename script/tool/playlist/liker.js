const LIKER_MENU_ITEM = {
    title: getMessage('liker_title'),
    handler: switchMainAndLikerContext,
};

const LIKER_CONTEXT_MENU = {
    id: 'likerMain',
    items: [
        { header: true, title: getMessage('liker_title'), handler: switchMainAndLikerContext },
        {
            title: getMessage('liker_like_add'),
            handler: () => onClickLikerOfTracks({ typeButton: 'like', typeRequest: 'add' }),
        },
        {
            title: getMessage('liker_like_remove'),
            handler: () => onClickLikerOfTracks({ typeButton: 'like', typeRequest: 'remove' }),
        },
        {
            title: getMessage('liker_dislike_add'),
            handler: () => onClickLikerOfTracks({ typeButton: 'dislike', typeRequest: 'add' }),
        },
        {
            title: getMessage('liker_dislike_remove'),
            handler: () => onClickLikerOfTracks({ typeButton: 'dislike', typeRequest: 'remove' }),
        },
    ],
};

function switchMainAndLikerContext() {
    toggleDropdown('likerMain');
    toggleDropdown('menuPlaylistMain');
}

function onClickLikerOfTracks(args) {
    toggleDropdown('likerMain');
    fireWaitingServerSwal();
    receiveTracksFromPlaylist((tracks) => markTracks(tracks, args));
}

function markTracks(tracks, args) {
    let responseCount = 0;
    tracks.reverse();
    for (let i = 0; i < tracks.length; i++) {
        markTrack(
            {
                id: tracks[i].id,
                typeButton: args.typeButton,
                typeRequest: args.typeRequest,
            },
            function () {
                if (++responseCount == tracks.length) {
                    location.reload();
                }
            }
        );
    }
}
