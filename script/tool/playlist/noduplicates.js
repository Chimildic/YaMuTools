const idNoDuplicate = 'btnNoDuplicate';

const NODUPLICATE_MENU_ITEM = {
    title: getMessage('noduplicate_title'),
    handler: onClickNoDuplicate,
};

function onClickNoDuplicate() {
    toggleDropdown('menuPlaylistMain');
    fireLoadingSwal(getMessage('noduplicate_processing'), NODUPLICATE_MENU_ITEM.title);
    receivePlaylistByLocation((playlist) => {
        let countLostTracks = removeLostTracks(playlist.tracks);
        playlist.trackCount = playlist.trackCount - countLostTracks;
        if (countLostTracks > 0) {
            console.log(`Обнаружено и проигноировано ${countLostTracks} треков из-за отсутвия данных.`);
        }

        let tracksClone = JSON.parse(JSON.stringify(playlist.tracks));
        let separatedTracks = separateUniquFromSimilar(tracksClone);
        if (separatedTracks.nofound) {
            fireInfoSwal('', getMessage('noduplicate_nofound'));
            return;
        }

        createCopyOfPlaylist(playlist, function (copyPlaylist) {
            if (!copyPlaylist || copyPlaylist.trackCount != playlist.trackCount) {
                fireErrorSwal(getMessage('noduplicate_error'));
                return;
            }

            fireSelectSwal(
                {
                    title: 'Поиск дубликатов',
                    text: 'Создана копия оригинального плейлиста. Найдены дубликаты. Какой плейлист изменить?',
                    inputPlaceholder: getMessage('noduplicates_case_choose'),
                    inputOptions: {
                        original: getMessage('noduplicates_case_original'),
                        copy: getMessage('noduplicates_case_copy'),
                    },
                },
                (result) => {
                    let data = {
                        trackCount: playlist.trackCount,
                        trackIds: separatedTracks.trackIds,
                    };

                    if (result == 'original') {
                        data.kind = playlist.kind;
                        data.revision = playlist.revision;
                    } else if (result == 'copy') {
                        data.kind = copyPlaylist.kind;
                        data.revision = copyPlaylist.revision;
                    }

                    separatedTracks.kind = data.kind;
                    replaceAllTracks(data, () => showResultNoDuplicate(separatedTracks));
                }
            );
        });
    });
}

function showResultNoDuplicate(result) {
    let data = {
        text: getMessage('noduplicate_result', [
            result.removedCopyCount + result.splitedTracks.similar.length,
            result.removedCopyCount,
            result.splitedTracks.similar.length,
            result.splitedTracks.unique.length,
        ]),
    };

    Swal.fire({
        text: data.text,
    }).then(() => {
        redirectToPlaylist(result.kind);
    });
}

function removeLostTracks(tracks) {
    let count = 0;
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].hasOwnProperty('error')) {
            tracks.splice(i, 1);
            count++;
            i--;
        }
    }
    return count;
}

function separateUniquFromSimilar(tracks) {
    addIndex(tracks);
    let removedCopyCount = removeCopyByRealId(tracks);
    let separatedTracks = searchSimilar(tracks);
    if (separatedTracks.similar.length == 0 && removedCopyCount == 0) {
        return { nofound: true };
    }

    tracks = separatedTracks.similar.concat(separatedTracks.unique);
    return {
        nofound: false,
        trackIds: getTrackIds(tracks),
        splitedTracks: separatedTracks,
        removedCopyCount: removedCopyCount,
    };
}

function searchSimilar(tracks) {
    sortByTitle(tracks);
    let uniqueTracks = [];
    let similarTracks = [];

    for (let i = 0; i < tracks.length; i++) {
        let track = tracks[i];
        for (let j = i + 1; j < tracks.length; j++) {
            let nextTrack = tracks[j];
            if (compareTracks(track, nextTrack)) {
                similarTracks.push(nextTrack);
                if (j == i + 1) {
                    similarTracks.push(track);
                }
            } else {
                if (j == i + 1) {
                    uniqueTracks.push(track);
                }
                if (i + 2 == tracks.length) {
                    uniqueTracks.push(nextTrack);
                }
                i = j - 1;
                break;
            }
        }
    }

    sortByIndexAsc(uniqueTracks);

    return { unique: uniqueTracks, similar: similarTracks };
}

function compareTracks(track, nextTrack) {
    for (let i = 0; i < nextTrack.artists.length; i++) {
        let nextArtist = nextTrack.artists[i];
        for (let j = 0; j < track.artists.length; j++) {
            if (track.artists[j].name == nextArtist.name && track.title == nextTrack.title) {
                return true;
            }
        }
    }
    return false;
}

function removeCopyByRealId(tracks) {
    sortByRealIdAsc(tracks);
    let removedCount = 0;
    for (let i = tracks.length - 1; i >= 1; i--) {
        if (tracks[i].realId == tracks[i - 1].realId) {
            tracks.splice(i, 1);
            removedCount++;
        }
    }
    return removedCount;
}

function removeCopyByIdRecoverSort(tracks) {
    addIndex(tracks);
    sortByIdAsc(tracks);
    let removedCount = 0;
    for (let i = tracks.length - 1; i >= 1; i--) {
        if (tracks[i].id == tracks[i - 1].id) {
            tracks.splice(i, 1);
            removedCount++;
        }
    }
    sortByIndexAsc(tracks);
    return removedCount;
}

function addIndex(tracks) {
    tracks.some(function (track, index) {
        track.index = index;
    });
}

function sortByTitle(tracks, direction = 'asc') {
    tracks.sort((x, y) => {
        if (x && x.title && y && y.title) {
            if (direction == 'asc') {
                return x.title.localeCompare(y.title);
            }
            return y.title.localeCompare(x.title);
        }
        console.error('Ошибка при сортировке треков по названию:', x, y);
        return 1;
    });
}

function sortByArtist(tracks, direction = 'asc') {
    tracks.sort((x, y) => {
        if (x && x.artists && x.artists.length > 0 && y && y.artists && y.artists.length > 0) {
            if (direction == 'asc') {
                return x.artists[0].name.localeCompare(y.artists[0].name);
            }
            return y.artists[0].name.localeCompare(x.artists[0].name);
        }
        console.error('Ошибка при сортировке треков по исполнителю:', x, y);
        return 1;
    });
}

function sortByRealIdAsc(tracks) {
    tracks.sort((x, y) => x.realId - y.realId);
}

function sortByIdAsc(tracks) {
    tracks.sort((x, y) => x.id - y.id);
}

function sortByIndexAsc(tracks) {
    tracks.sort((x, y) => x.index - y.index);
}
