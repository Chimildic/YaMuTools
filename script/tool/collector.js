//#region Common

let selectedPlaylist;

//#region Helper
function diffDateByDays(dateOne, dateTwo) {
    return (dateOne - dateTwo) / (60 * 60 * 24 * 1000);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
//#endregion

const PLAYLIST = {
    newAll: {
        title: getMessage('pls_new_all_title'),
        description: getMessage('pls_new_all_desc'),
        type: 'newAll',
        handler: collectNewReleases,
    },
    newSingle: {
        title: getMessage('pls_new_single_title'),
        description: getMessage('pls_new_single_desc'),
        type: 'newSingle',
        handler: collectNewReleases,
    },
    newBest: {
        title: getMessage('pls_new_best_title'),
        description: getMessage('pls_new_best_desc'),
        type: 'newBest',
        handler: collectNewReleases,
    },
    dislikes: {
        title: getMessage('pls_dislikes_title'),
        description: getMessage('pls_dislikes_desc'),
        type: 'dislikes',
        handler: collectDislikes,
    },
    discoveryAlbums: {
        title: 'Открытия с альбомов',
        description: 'Послушайте треки с альбомов, где есть ваши лайки',
        type: 'discoveryAlbums',
        handler: collectDiscoveryAlbums,
    },
    discography: {
        title: getMessage('pls_discography_title'),
        description: getMessage('pls_discography_desc'),
        type: 'discography',
        handler: collectDiscography,
    },
    feedRareArtist: {
        title: getMessage('pls_rare_artist_title'),
        description: getMessage('pls_rare_artist_desc'),
        type: 'feedRareArtist',
        handler: collectFeedDays,
        filter: 'rare-artist',
    },
    feedWeekChart: {
        title: getMessage('pls_feed_week_title'),
        description: getMessage('pls_feed_week_desc'),
        type: 'feedWeekChart',
        handler: collectFeedDays,
        filter: 'last-week-personal-popular-tracks',
    },
    feedFanByArtist: {
        title: getMessage('pls_fan_artist_title'),
        description: getMessage('pls_fan_artist_desc'),
        type: 'feedFanByArtist',
        handler: collectFeedDays,
        filter: 'recommended-tracks-by-artist-from-history',
    },
    feedMissed: {
        title: getMessage('pls_missed_title'),
        description: getMessage('pls_missed_desc'),
        type: 'feedMissed',
        handler: collectFeedDays,
        filter: 'missed-tracks-by-artist',
    },

    feedForgotten: {
        title: 'Забытое',
        description: 'Подборка блока "Вы давно не слушали эти треки" с ленты рекомендаций.',
        type: 'feedForgotten',
        handler: collectFeedDays,
        filter: 'well-forgotten-old-tracks',
    },

    fromHistory: {
        title: 'Из истории',
        description: 'Случайная подборка ранее прослушанной музыки.',
        type: 'fromHistory',
        handler: collectFromHistory,
    },

    lastfmTopTracks: {
        title: getMessage('pls_lastfm_top_title'),
        description: getMessage('pls_lastfm_top_desc'),
        type: 'lastfmTopTracks',
        handler: collectTopTracksLastfm,
    },
    lastfmLovedTracks: {
        title: getMessage('pls_lastfm_loved_title'),
        description: getMessage('pls_lastfm_loved_desc'),
        type: 'lastfmLovedTracks',
        handler: collectLovedTracksLastfm,
    },
    lastfmRecommended: {
        title: getMessage('pls_lastfm_recom_title'),
        description: getMessage('pls_lastfm_recom_desc'),
        type: 'lastfmRecommended',
        handler: collectRecommendedLastfm,
    },
    lastfmMix: {
        title: getMessage('pls_lastfm_mix_title'),
        description: getMessage('pls_lastfm_mix_desc'),
        type: 'lastfmMix',
        handler: collectMixLastfm,
    },
    lastfmLibrary: {
        title: getMessage('pls_lastfm_library_title'),
        description: getMessage('pls_lastfm_library_desc'),
        type: 'lastfmLibrary',
        handler: collectLibraryLastfm,
    },
    lastfmNeighbours: {
        title: 'Соседи',
        description: 'Такую музыку слушают пользователи Last.fm с близкими тебе вкусами.',
        type: 'lastfmNeighbours',
        handler: collectNeighboursLastfm,
    },
};

//#endregion

//#region Dropdown

const LASTFM_PERIOD = {
    DAYS_7: { value: 7, title: getMessage('period_7days'), arg: '7day', limit: 20 },
    ONE_MONTH: { value: 30, title: getMessage('period_1month'), arg: '1month', limit: 40 },
    THREE_MONTH: { value: 90, title: getMessage('period_3month'), arg: '3month', limit: 50 },
    SIX_MONTH: { value: 180, title: getMessage('period_6month'), arg: '6month', limit: 60 },
    ONE_YEAR: { value: 365, title: getMessage('period_12month'), arg: '12month', limit: 60 },
    ALLTIME: { value: -2, title: getMessage('period_all_time'), arg: 'overall', limit: 100 },
};

const PERIOD = {
    DAYS_4: { value: 4, title: getMessage('period_4days') },
    DAYS_7: { value: 7, title: getMessage('period_7days') },
    DAYS_10: { value: 10, title: getMessage('period_10days') },
    ONE_YEAR: { value: 365, title: getMessage('period_1year') },
    TWO_YEAR: { value: 730, title: getMessage('period_2years') },
    FIVE_YEAR: { value: 1825, title: getMessage('period_5years') },
    DEFAULT: { value: 0, title: getMessage('period_default') },
    RANDOM: { value: -1, title: getMessage('period_random') },
};

const COLLECTOR_USERMUSIC_DROPDOWN = {
    id: 'collectorUserMusicDropdown',
    width: 220,
    button: {
        title: getMessage('collector_title'),
        handler: () => onClickButtonDropdown('usermusicCollectorMain'),
    },
    menus: [],
};

const BASE_MENUS_COLLECTOR_USERMUSIC = [
    {
        id: 'usermusicCollectorMain',
        items: [
            {
                title: getMessage('collector_menu_new'),
                handler: swithBetweenMainAndNew,
            },
            {
                title: getMessage('collector_menu_recom'),
                handler: swithBetweenMainAndFeed,
            },
            {
                title: PLAYLIST.discoveryAlbums.title,
                handler: () => collectDiscoveryAlbums(PLAYLIST.discoveryAlbums),
            },
            {
                title: PLAYLIST.dislikes.title,
                handler: () => collectDislikes(PLAYLIST.dislikes),
            },
        ],
    },
    {
        id: 'newCollectorSide',
        items: [
            { header: true, title: getMessage('collector_menu_new'), handler: swithBetweenMainAndNew },
            {
                title: PLAYLIST.newBest.title,
                handler: () => onItemClickNewRelease(PLAYLIST.newBest),
            },
            {
                title: PLAYLIST.newSingle.title,
                handler: () => onItemClickNewRelease(PLAYLIST.newSingle),
            },
            {
                title: PLAYLIST.newAll.title,
                handler: () => onItemClickNewRelease(PLAYLIST.newAll),
            },
        ],
    },
    {
        id: 'periodNewReleaseCollectorSide',
        items: [
            { header: true, titleId: 'newReleaseItemHeader', handler: switchBetweenNewAndPeriod },
            { title: PERIOD.DEFAULT.title, handler: () => onItemClickPeriod(PERIOD.DEFAULT) },
            { title: PERIOD.DAYS_4.title, handler: () => onItemClickPeriod(PERIOD.DAYS_4) },
            { title: PERIOD.DAYS_7.title, handler: () => onItemClickPeriod(PERIOD.DAYS_7) },
            { title: PERIOD.DAYS_10.title, handler: () => onItemClickPeriod(PERIOD.DAYS_10) },
            { title: PERIOD.RANDOM.title, handler: () => onItemClickPeriod(PERIOD.RANDOM) },
        ],
    },
    {
        id: 'feedCollectorSide',
        items: [
            { header: true, title: getMessage('collector_menu_recom'), handler: swithBetweenMainAndFeed },
            { title: PLAYLIST.feedRareArtist.title, handler: () => onItemClickFeed(PLAYLIST.feedRareArtist) },
            { title: PLAYLIST.feedFanByArtist.title, handler: () => onItemClickFeed(PLAYLIST.feedFanByArtist) },
            { title: PLAYLIST.fromHistory.title, handler: () => collectFromHistory(PLAYLIST.fromHistory) },
            { title: PLAYLIST.feedMissed.title, handler: () => onItemClickFeed(PLAYLIST.feedMissed) },
            { title: PLAYLIST.feedForgotten.title, handler: () => onItemClickFeed(PLAYLIST.feedForgotten) },
            { title: PLAYLIST.feedWeekChart.title, handler: () => onItemClickFeed(PLAYLIST.feedWeekChart) },
        ],
    },
    {
        id: 'periodFeedCollectorSide',
        items: [
            { header: true, titleId: 'feedItemHeader', handler: switchBetweenFeedAndPeriod },
            { title: PERIOD.DAYS_4.title, handler: () => onItemClickPeriod(PERIOD.DAYS_4) },
            { title: PERIOD.DAYS_7.title, handler: () => onItemClickPeriod(PERIOD.DAYS_7) },
            { title: PERIOD.DAYS_10.title, handler: () => onItemClickPeriod(PERIOD.DAYS_10) },
            { title: getMessage('period_all_available'), handler: () => onItemClickPeriod(PERIOD.ONE_YEAR) },
        ],
    },
];

const COLLECTOR_ARTIST_DROPDOWN = {
    id: 'collectorArtistDropdown',
    width: 220,
    button: {
        title: getMessage('pls_discography_title'),
        handler: () => onClickButtonDropdown('artistCollectorMain'),
    },
    menus: [
        {
            id: 'artistCollectorMain',
            items: [
                {
                    title: PERIOD.DEFAULT.title,
                    handler: () => collectDiscographyOfPeriod(PERIOD.DEFAULT),
                },
                {
                    title: PERIOD.ONE_YEAR.title,
                    handler: () => collectDiscographyOfPeriod(PERIOD.ONE_YEAR),
                },
                {
                    title: PERIOD.TWO_YEAR.title,
                    handler: () => collectDiscographyOfPeriod(PERIOD.TWO_YEAR),
                },
                {
                    title: PERIOD.FIVE_YEAR.title,
                    handler: () => collectDiscographyOfPeriod(PERIOD.FIVE_YEAR),
                },
            ],
        },
    ],
};

const LASTFM_MAIN_MENU = {
    title: 'Last.fm',
    handler: switchBetweenMainAndLastfm,
};

const LASTFM_SIDE_MENUS = [
    {
        id: 'lastfmCollectorSide',
        items: [
            { header: true, title: 'Last.fm', handler: switchBetweenMainAndLastfm },
            { title: getMessage('pls_lastfm_mix_title'), handler: () => collectMixLastfm() },
            { title: getMessage('pls_lastfm_recom_title'), handler: () => collectRecommendedLastfm() },
            { title: 'Соседи', handler: () => collectNeighboursLastfm() },
            { title: getMessage('pls_lastfm_library_title'), handler: () => collectLibraryLastfm() },
            { title: getMessage('pls_lastfm_top_title'), handler: () => onItemClickLastfm(PLAYLIST.lastfmTopTracks) },
            { title: getMessage('pls_lastfm_loved_title'), handler: () => collectLovedTracksLastfm() },
        ],
    },
    {
        id: 'periodLastfmCollectorSide',
        items: [
            { header: true, titleId: 'lastfmItemHeader', handler: switchBetweenLastfmAndPeriod },
            { title: LASTFM_PERIOD.DAYS_7.title, handler: () => onItemClickPeriod(LASTFM_PERIOD.DAYS_7) },
            { title: LASTFM_PERIOD.ONE_MONTH.title, handler: () => onItemClickPeriod(LASTFM_PERIOD.ONE_MONTH) },
            { title: LASTFM_PERIOD.THREE_MONTH.title, handler: () => onItemClickPeriod(LASTFM_PERIOD.THREE_MONTH) },
            { title: LASTFM_PERIOD.SIX_MONTH.title, handler: () => onItemClickPeriod(LASTFM_PERIOD.SIX_MONTH) },
            { title: LASTFM_PERIOD.ONE_YEAR.title, handler: () => onItemClickPeriod(LASTFM_PERIOD.ONE_YEAR) },
            { title: LASTFM_PERIOD.ALLTIME.title, handler: () => onItemClickPeriod(LASTFM_PERIOD.ALLTIME) },
        ],
    },
];

const SPOTIFY_MAIN_MENU = {
    title: 'Spotify',
    handler: switchBetweenMainAndSpotify,
};

const SPOTIFY_SIDE_MENUS = [
    {
        id: 'spotifyCollectorSide',
        items: [
            { header: true, title: 'Spotify', handler: switchBetweenMainAndSpotify },
            { title: 'Плейлисты', handler: () => collectSpotifyPlaylists() },
        ],
    },
];

function addCollectorOfUserMusic(onLastfmCollector, onSpotifyCollector) {
    removeCollectorTool();
    insertDropdown(buildMenuCollectorOfUserMusic(onLastfmCollector, onSpotifyCollector));
}

function buildMenuCollectorOfUserMusic(onLastfmCollector, onSpotifyCollector) {
    let menus = [];
    menus.push.apply(menus, BASE_MENUS_COLLECTOR_USERMUSIC);

    appendModuleMenuIfNeeded(menus, onLastfmCollector, LASTFM_MAIN_MENU, LASTFM_SIDE_MENUS);
    appendModuleMenuIfNeeded(menus, onSpotifyCollector, SPOTIFY_MAIN_MENU, SPOTIFY_SIDE_MENUS);

    COLLECTOR_USERMUSIC_DROPDOWN.menus = menus;
    return COLLECTOR_USERMUSIC_DROPDOWN;
}

function appendModuleMenuIfNeeded(menus, option, id, side_id) {
    index = indexOfMainMenuItem(menus, id);
    if (option && index == -1) {
        menus[0].items.insert(1, id);
        index = 1;
    }

    if (option && index != -1) {
        menus.push.apply(menus, side_id);
    }

    if (!option && index != -1) {
        menus[0].items.splice(index, 1);
    }
}

function indexOfMainMenuItem(menus, value) {
    for (let i = 0; i < menus[0].items.length; i++) {
        if (menus[0].items[i] == value) {
            return i;
        }
    }
    return -1;
}

function addCollectorOfArtist() {
    insertDropdown(COLLECTOR_ARTIST_DROPDOWN);
}

function removeCollectorTool() {
    removeDropdown();
}

function onItemClickNewRelease(playlist) {
    selectedPlaylist = playlist;
    setHeaderPeriod(playlist.title, 'newReleaseItemHeader');
    switchBetweenNewAndPeriod();
}

function onItemClickFeed(playlist) {
    selectedPlaylist = playlist;
    setHeaderPeriod(playlist.title, 'feedItemHeader');
    switchBetweenFeedAndPeriod();
}

function onItemClickLastfm(playlist) {
    selectedPlaylist = playlist;
    setHeaderPeriod(playlist.title, 'lastfmItemHeader');
    switchBetweenLastfmAndPeriod();
}

function onItemClickPeriod(period) {
    closeDropdownAll();
    selectedPlaylist.period = period;
    selectedPlaylist.handler();
}

function setHeaderPeriod(title, id) {
    document.getElementById(id).innerText = title;
}

function swithBetweenMainAndNew() {
    toggleDropdown('usermusicCollectorMain');
    toggleDropdown('newCollectorSide');
}

function swithBetweenMainAndFeed() {
    toggleDropdown('usermusicCollectorMain');
    toggleDropdown('feedCollectorSide');
}

function switchBetweenMainAndLastfm() {
    toggleDropdown('usermusicCollectorMain');
    toggleDropdown('lastfmCollectorSide');
}

function switchBetweenMainAndSpotify() {
    toggleDropdown('usermusicCollectorMain');
    toggleDropdown('spotifyCollectorSide');
}

function switchBetweenNewAndPeriod() {
    toggleDropdown('newCollectorSide');
    toggleDropdown('periodNewReleaseCollectorSide');
}

function switchBetweenFeedAndPeriod() {
    toggleDropdown('feedCollectorSide');
    toggleDropdown('periodFeedCollectorSide');
}

function switchBetweenLastfmAndPeriod() {
    toggleDropdown('lastfmCollectorSide');
    toggleDropdown('periodLastfmCollectorSide');
}

//#endregion

//#region Filter

const MIX_HATER = ['mix', 'live', 'demo', 'club', 'version'];
function isMix(data) {
    let result = false;

    if (!data.version) {
        return result;
    }

    let version = data.version.toLowerCase();
    for (let i = 0; i < MIX_HATER.length; i++) {
        if (version.indexOf(MIX_HATER[i]) !== -1) {
            result = true;
            break;
        }
    }

    return result;
}

function filterAlbumsByType(type) {
    if (type == PLAYLIST.newSingle.type) {
        filterToSingle();
    } else if (type == PLAYLIST.newBest.type) {
        filterToBest();
    }
}

function filterAlbumsByPeriod(period) {
    if (period === PERIOD.DEFAULT) {
        return;
    } else if (period === PERIOD.RANDOM) {
        filterByRandomPeriod(40);
    } else {
        filterByMaxDate(period.value);
    }
    selectedPlaylist.description += ` ${period.title}.`;
}

function filterByMaxDate(maxDiffDays) {
    let today = new Date();
    selectedPlaylist.albums = selectedPlaylist.albums.filter((album) => {
        let releaseDate = new Date(album.releaseDate);
        return diffDateByDays(today, releaseDate) <= maxDiffDays;
    });
}

function filterByRandomPeriod(count) {
    let albums = shuffle(selectedPlaylist.albums);
    if (albums.length > count) {
        albums.length = count;
    }
    for (let i = 0; i < albums.length; i++) {
        let tracks = shuffle(albums[i].tracks);
        tracks.length = 1;
        albums[i].tracks = tracks;
        albums[i].trackCount = 1;
    }
    selectedPlaylist.albums = albums;
}

function filterToSingle() {
    selectedPlaylist.albums = selectedPlaylist.albums.filter((album) => album.type == 'single');
}

function filterToBest() {
    selectedPlaylist.albums = selectedPlaylist.albums.filter((album) => album.bests.length > 0);
    selectedPlaylist.albums.forEach((album) => {
        album.tracks = album.tracks.filter((track) => track.best);
        album.trackCount = album.tracks.length;
    });
}

function filterFeedEvents() {
    let type = selectedPlaylist.filter;
    selectedPlaylist.tracks = [];
    selectedPlaylist.events = selectedPlaylist.events.filter((event) => {
        if (event.typeForFrom == type) {
            selectedPlaylist.tracks.push.apply(selectedPlaylist.tracks, event.tracks);
            return true;
        }
        return false;
    });

    if (selectedPlaylist.type == PLAYLIST.feedFanByArtist) {
        let artistNames = [];
        for (let i = 0; i < selectedPlaylist.events.length; i++) {
            artistNames.push(selectedPlaylist.events[i].title[0].text);
        }
        selectedPlaylist.description += ` ${getMessage('pls_fan_artist_inner_desc')}: ${artistNames.join(', ')}.`;
    }
}

function removeMixTracksFromAlbums() {
    let albums = selectedPlaylist.albums;
    albums.forEach((album) => {
        album.tracks = album.tracks.filter((track) => !isMix(track));
        album.trackCount = album.tracks.length;
        if (album.trackCount == 0) {
            return false;
        }
        return true;
    });

    selectedPlaylist.albums = albums.filter((album) => album.trackCount > 0 && !isMix(album));
}

//#endregion

//#region Collector

function collectFromHistory(playlist) {
    fireCollectorSwal(playlist.title);
    closeDropdownAll();
    receiveHistory().then(response => {
        if (!response.hasTracks) {
            fireInfoSwal('В истории прослушиваний нет треков.');
            return;
        }

        let trackIds = response.trackIds;
        let offset = (30 * response.trackIds.length) / 100;
        trackIds.splice(0, offset);
        trackIds = formatStrIdsToJSON(trackIds);
        removeCopyByIdRecoverSort(trackIds);
        removeDislikeIds(trackIds, (tracksIdsWithoutDislike) => {
            shuffle(tracksIdsWithoutDislike);
            tracksIdsWithoutDislike.length = roundLength(tracksIdsWithoutDislike.length, 60);
            patchPlaylistWithRedirect({
                title: playlist.title,
                description: playlist.description,
                trackIds: tracksIdsWithoutDislike,
            });
        });
    });
}

function collectDislikes(playlist) {
    fireCollectorSwal(playlist.title);
    toggleDropdown('usermusicCollectorMain');
    receiveFavoriteTrackIds(FAV_TYPE.DISLIKE, function (trackIds) {
        playlist.trackIds = trackIds;
        patchPlaylistWithRedirect(playlist);
    });
}

async function collectDiscoveryAlbums(playlist) {
    fireCollectorSwal(playlist.title);
    toggleDropdown('usermusicCollectorMain');
    let likedPlaylist = await receivePlaylistByKind('3')
    let albumsId = shuffle(likedPlaylist.trackIds)
        .slice(0, 100)
        .map(id => `${id}`.split(':')[1])
        .filter(id => id.length > 0);

    let albums = await receiveAlbumsById(albumsId);
    let bests = albums.map(a => findBestTrack(a)).flat(1);
    bests = await removeHistory(bests, 2000);
    removeFav(bests, (trackIds) => {
        playlist.trackIds = formatStrIdsToJSON(trackIds.slice(0, 20));
        patchPlaylistWithRedirect(playlist);
    })

    function findBestTrack(album) {
        if (!album.hasOwnProperty('bests') || album.bests.length == 0 || album.error)
            return [];
        return `${shuffle(album.bests).slice(0, 1)}`;
    }
}

function collectDiscographyOfPeriod(period) {
    selectedPlaylist = PLAYLIST.discography;
    selectedPlaylist.period = period;
    collectDiscography();
}

function collectDiscography() {
    fireCollectorSwal(selectedPlaylist.title);
    toggleDropdown('artistCollectorMain');
    receiveAlbumsOfArtist((response) => {
        selectedPlaylist.albums = response.albums;
        filterAlbumsByPeriod(selectedPlaylist.period);
        selectedPlaylist.title += ' ' + response.artist.name;
        selectedPlaylist.trackIds = formatAlbumTracksToIds(selectedPlaylist.albums);
        patchPlaylistWithRedirect(selectedPlaylist);
    });
}

function collectNewReleases() {
    fireCollectorSwal(selectedPlaylist.title);
    receiveNewReleaseAlbums(function (albums) {
        browser.storage.local.get('onMixHater', function (item) {
            selectedPlaylist.albums = albums;
            if (item.onMixHater) {
                selectedPlaylist.description += ` ${getMessage('pls_desc_mix_removed')}.`;
                removeMixTracksFromAlbums();
            }
            filterAlbumsByType(selectedPlaylist.type);
            filterAlbumsByPeriod(selectedPlaylist.period);
            selectedPlaylist.trackIds = formatAlbumTracksToIds(selectedPlaylist.albums);
            removeDislikeIds(selectedPlaylist.trackIds, (trackIds) => {
                selectedPlaylist.trackIds = trackIds;
                patchPlaylistWithRedirect(selectedPlaylist);
            });
        });
    });
}

function collectFeedDays() {
    fireCollectorSwal(selectedPlaylist.title);
    receiveFeedEvents(selectedPlaylist.period.value, function (events) {
        selectedPlaylist.events = events;
        filterFeedEvents();
        selectedPlaylist.description += ` ${getMessage('period_saw')}: ${selectedPlaylist.period.title.toLowerCase()}.`;
        selectedPlaylist.trackIds = getTrackIds(selectedPlaylist.tracks);
        removeCopyByIdRecoverSort(selectedPlaylist.trackIds);
        removeDislikeIds(selectedPlaylist.trackIds, (trackIds) => {
            selectedPlaylist.trackIds = trackIds;
            patchPlaylistWithRedirect(selectedPlaylist);
        });
    });
}

function collectTopTracksLastfm() {
    fireCollectorSwal(selectedPlaylist.title);
    let data = {
        period: selectedPlaylist.period.arg,
        limit: selectedPlaylist.period.limit,
    };

    receiveTopTracksLastfm(data, function (content) {
        selectedPlaylist.description += ` ${getMessage('pls_lastfm_top_inner_desc', [
            selectedPlaylist.period.title.toLowerCase(),
            selectedPlaylist.period.limit,
        ])}`;
        createPlaylistFromLastfmContent(selectedPlaylist, content);
    });
}

function collectLovedTracksLastfm() {
    selectedPlaylist = PLAYLIST.lastfmLovedTracks;
    fireCollectorSwal(selectedPlaylist.title);
    receiveLovedTracksLastfm(function (content) {
        createPlaylistFromLastfmContent(selectedPlaylist, content);
    });
}

function collectRecommendedLastfm() {
    selectedPlaylist = PLAYLIST.lastfmRecommended;
    collectLastfm(receiveRecommendedLastfm);
}

function collectMixLastfm() {
    selectedPlaylist = PLAYLIST.lastfmMix;
    collectLastfm(receiveMixLastfm);
}

function collectLibraryLastfm() {
    selectedPlaylist = PLAYLIST.lastfmLibrary;
    collectLastfm(receiveLibraryLastfm);
}

function collectNeighboursLastfm() {
    selectedPlaylist = PLAYLIST.lastfmNeighbours;
    collectLastfm(receiveNeighboursLastfm);
}

function collectLastfm(method) {
    fireCollectorSwal(selectedPlaylist.title);
    method(function (content) {
        createPlaylistFromLastfmContent(selectedPlaylist, content);
    });
}

function createPlaylistFromLastfmContent(playlist, content) {
    searchTracksByImport(content, function (tracks) {
        playlist.description += ` Пользователь: ${loginLastfm}.`;
        playlist.trackIds = getTrackIds(tracks);
        removeCopyByIdRecoverSort(playlist.trackIds);
        removeDislikeIds(playlist.trackIds, (trackIds) => {
            playlist.trackIds = trackIds;
            patchPlaylistWithRedirect(playlist);
        });
    });
}

//#endregion

async function removeHistory(trackIds, count) {
    let history = await receiveHistory();
    history.trackIds.length = count;
    return trackIds.filter(id => !history.trackIds.includes(id));
}

function removeLikeIds(trackIds, callback) {
    removeFavoriteTrackIds(trackIds, FAV_TYPE.LIKE, callback);
}

function removeDislikeIds(trackIds, callback) {
    removeFavoriteTrackIds(trackIds, FAV_TYPE.DISLIKE, callback);
}

function removeFav(ids, callback) {
    removeDislikeIds(ids, (trackIds) => removeLikeIds(trackIds, callback));
}

function removeAllExceptLikes(trackIds, callback) {
    receiveFavoriteTrackIds(FAV_TYPE.LIKE, (likeIds) => {
        let filteredTrackIds = trackIds.filter((item) => likeIds.some((likeTrack) => likeTrack.id == item.id));
        callback(filteredTrackIds);
    });
}

function removeFavoriteTrackIds(trackIds, type, callback) {
    receiveFavoriteTrackIds(type, (favoriteIds) => {
        for (let i = 0; i < trackIds.length; i++) {
            if (searchIdBinary(trackIds[i].id || trackIds[i], favoriteIds) != -1) {
                trackIds.splice(i, 1);
                i--;
            }
        }
        callback(trackIds);
    });
}

function searchIdBinary(value, list) {
    let first = 0;
    let last = list.length - 1;
    let position = -1;
    let found = false;
    let middle;

    while (found === false && first <= last) {
        middle = Math.floor((first + last) / 2);
        middleValue = parseInt(list[middle].id);
        if (middleValue == value) {
            found = true;
            position = middle;
        } else if (middleValue > value) {
            last = middle - 1;
        } else {
            first = middle + 1;
        }
    }
    return position;
}

function formatStrIdsToJSON(strTrackIds) {
    // from "123:456" to {id: 123, alblubId: 456}

    let trackIds = [];
    for (let i = 0; i < strTrackIds.length; i++) {
        if (typeof strTrackIds[i] == 'string') {
            let track = strTrackIds[i].split(':');
            trackIds.push({ id: track[0], albumId: track[1] });
        } else {
            console.log(strTrackIds[i], i);
        }
    }
    return trackIds;
}
