const idExporterTool = 'btnExporterTool';
const EXPORTER_MENU_ITEM = {
    title: getMessage('exporter_title'),
    handler: onClickExporterTool,
};

function onClickExporterTool() {
    toggleDropdown('menuPlaylistMain');
    receiveTracksFromPlaylist((tracks) => outputTracksWithAlert(tracks));
}

function outputTracksWithAlert(source) {
    let header =
        'Скопируйте список треков, перейдите на spotlistr.com/search/textbox или tunemymusic.com, вставьте скопированный текст';

    let tracks = [];
    for (i = 0; i < source.length; i++) {
        if (source[i].artists.length != 0 && source[i].title) {
            tracks.push(`${source[i].artists[0].name} - ${source[i].title}`);
        } else if (source[i].title) {
            alert(`У трека с индексом ${i + 1} (${source[i].title}) нет данных об исполнителе. Он будет пропущен.`);
        } else {
            alert(`О треке с индексом ${i + 1} нет данных. Возможно он заблокирован.`);
        }
    }

    alert(header + '\n\n' + tracks.join('\n'));
}
