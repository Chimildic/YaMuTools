const MENU_PLAYLIST = {
    id: 'menuPlaylistYamutools',
    width: 240,
    button: {
        title: 'YaMuTools',
        handler: () => onClickButtonDropdown('menuPlaylistMain'),
    },
    menus: [],
};

function addMenuPlaylist(args) {
    removeDropdown();
    let menu = buildMenuPlaylist(args);
    if (menu) {
        insertDropdown(menu);
    }
}

function buildMenuPlaylist(args) {
    let menus = [];
    let canAddItem = isOwnerPage();

    menus.push({
        id: 'menuPlaylistMain',
        items: [],
    });

    menus[0].items.push(SIMILAR_TRACKS_MENU_ITEM);

    if (args.onRandomCover && canAddItem) {
        menus[0].items.push(RANDOM_COVER_MENU_ITEM);
    }

    if (args.onToolNoDuplicate && canAddItem) {
        menus[0].items.push(NODUPLICATE_MENU_ITEM);
    }

    if (canAddItem) {
        menus[0].items.push(ORDER_MENU_ITEM);
        menus.push(ORDER_CONTEXT_MENU);

        menus[0].items.push(FILTER_MENU_ITEM);
        menus.push(FILTER_CONTEXT_MENU);
    }

    if (args.onLikerTool) {
        menus[0].items.push(LIKER_MENU_ITEM);
        menus.push(LIKER_CONTEXT_MENU);
    }

    if (args.onExporterTool) {
        menus[0].items.push(EXPORTER_MENU_ITEM);
    }

    if (menus[0].items.length == 0) {
        return false;
    }

    MENU_PLAYLIST.menus = menus;
    return MENU_PLAYLIST;
}
