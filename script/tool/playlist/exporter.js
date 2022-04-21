const idExporterTool = 'btnExporterTool';
const EXPORTER_MENU_ITEM = {
    title: getMessage('exporter_title'),
    handler: onClickExporterTool,
};

function onClickExporterTool() {
    toggleDropdown('menuPlaylistMain');
    receiveTracksFromPlaylist((tracks) => outputTracksWithAlert(tracks));
}

function outputTracksWithAlert(tracks) {
    copyTracksToClipbloard(tracks).then(() => {
        Swal.fire({
            html: '<p>Список треков скопирован в буфер обмена. Перейдите на <a target="_blank" href="https://spotlistr.com/search/textbox">spotlistr</a> или <a target="_blank" href="https://tunemymusic.com">tunemymusic</a> и вставьте его в поле.</p>'
        })
    }, (e) => {
        console.error(e)
        fireSwal('Ошибка при при копировании списка треков. Повторите попытку или сообщите об ошибке по обратной связи (ссылка в настройках)', 'error');
    });
}

function copyTracksToClipbloard(source) {
    let tracks = [];
    for (i = 0; i < source.length; i++) {
        if (source[i].artists && source[i].artists.length > 0 && source[i].title) {
            let title = `${source[i].artists[0].name} ${source[i].title}`;
            tracks.push(`${title} ${source[i].version || ''}`.trim().formatName());
        } else if (source[i].title) {
            tracks.push(`${source[i].title}}`);
            console.log(`У трека с индексом ${i + 1} (${source[i].title}) нет данных об исполнителе.`);
        } else {
            console.log(`О треке с индексом ${i + 1} нет данных. Возможно он заблокирован.`);
        }
    }
    return navigator.clipboard.writeText(tracks.join('\n'));
}
