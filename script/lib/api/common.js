const domain = location.hostname.split('.')[2];
const urlAPI = `https://music.yandex.${domain}/api/v2.1/handlers/`;
const urlHandler = `https://music.yandex.${domain}/handlers/`;
const API_AUTH = `${urlAPI}auth?external-domain=music.yandex.${domain}&overembed=no`;
const API_FAV = `${urlAPI}tracks/fav?external-domain=music.yandex.${domain}`;
const API_TRACK = `${urlAPI}track/`;
const HANDLER_FEED = `${urlHandler}feed.jsx`;
const HANDLER_ALBUM = `${urlHandler}album.jsx`;
const HANDLER_ALBUMS = `${urlHandler}albums.jsx`;
const HANDLER_ARTIST = `${urlHandler}artist.jsx`;
const HANDLER_LIBRARY = `${urlHandler}library.jsx`;
const HANDLER_PLAYLIST = `${urlHandler}playlist.jsx`;
const HANDLER_NEW_RELEASES = `${urlHandler}main.jsx?what=new-releases`;
const HANDLER_PLAYLIST_PATCH = `${urlHandler}playlist-patch.jsx`;
const HANDLER_CHANGE_PLAYLIST = `${urlHandler}change-playlist.jsx`;
const HANDLER_IMPORT = `${urlHandler}import.jsx`;
const HANDLER_UPLOADPIC = `${urlHandler}upload-pic.jsx`;

const LASTFM_API_KEY = 'ac0116882cc3fd3a25ed49908725ce99';
const LASTFM_API_BASE = `https://ws.audioscrobbler.com/2.0/?api_key=${LASTFM_API_KEY}&format=json`;
const LASTFM_TOP_TRACKS = `${LASTFM_API_BASE}&method=user.gettoptracks`;
const LASTFM_LOVED_TRACKS = `${LASTFM_API_BASE}&method=user.getlovedtracks`;
const LASTFM_SIMILAR_TRACKS = `${LASTFM_API_BASE}&method=track.getsimilar`;
const LASTFM_STATION = `https://www.last.fm/player/station/user/`;

const PICSUM_RANDOM_PHOTO = `https://picsum.photos/%%`;

let sign, owner, uid, loginLastfm;

// Content scripts running at "document_idle" do not need to listen for the window.onload event,
// they are guaranteed to run after the DOM is complete.
refreshSign();

function refreshSign(callback) {
    requestGET(API_AUTH, function (responseJSON) {
        sign = responseJSON.freshCsrf;
        owner = responseJSON.login;
        uid = responseJSON.uid;
        if (callback){
            callback();
        }
    });
}

function getArgsByLocation() {
    path = location.pathname.split('/');
    if (location.pathname.includes('artists')) {
        return {
            owner: path[2],
            page: path[3],
        };
    } else if (location.pathname.includes('artist')) {
        return {
            page: path[1],
            artistId: path[2],
        };
    } else {
        return {
            owner: path[2],
            page: path[3],
            kind: path[4],
        };
    }
}

function formatFavoriteListToTrackIds(favJSON) {
    let items = [];
    let tempKeys = Object.keys(favJSON);
    for (let i = 0; i < tempKeys.length; i++) {
        if (favJSON[tempKeys[i]] == -1) {
            items.push({ id: tempKeys[i] });
        }
    }

    return items;
}

function formatAlbumTracksToIds(albums) {
    let ids = [];
    for (let i = 0; i < albums.length; i++) {
        let album = albums[i];
        for (let j = 0; j < album.tracks.length; j++) {
            let track = album.tracks[j];
            ids.push({ id: track.id, albumId: album.id });
        }
    }
    return ids;
}

function getTrackIds(tracks) {
    let ids = [];
    for (let i = 0; i < tracks.length; i++) {
        let item = {};
        if (tracks[i].albums.length > 0 && tracks[i].albums[0].id) {
            item.albumId = tracks[i].albums[0].id;
        }

        item.id = tracks[i].id;
        ids.push(item);
    }
    return ids;
}
