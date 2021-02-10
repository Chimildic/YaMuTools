const idExporterTool = 'btnExporterTool';
const EXPORTER_MENU_ITEM = {
    title: getMessage('exporter_title'),
    handler: onClickExporterTool,
};

function onClickExporterTool() {
    toggleDropdown('menuPlaylistMain');
    receiveTracksFromPlaylist((tracks) => outputTracksWithNewTab(tracks));
}

function outputTracksWithNewTab(source) {
    let header =
        '<div class="unselectable"><p>Для переноса в Spotify существует более удобный <a target="_blank" href="https://yandextospotify-v2.chimildic.repl.co">способ</a> или <a target="_blank" href="https://www.spotlistr.com/search/textbox">Spotlistr</a></p><h3>Инструкция</h3><ul><li>Скопируйте список треков (Ctrl + A, Ctrl + C)</li> <li>Перейдите на <a target="_blank" href="https://www.tunemymusic.com/ru/">TuneMyMusic</a></li> <li>Выберите "Давайте приступим" -> "Из файла"</li> <li>Вставьте скопированный текст в форму и выберите конечную платформу</li><br></ul></div><style> .unselectable { -webkit-touch-callout: none; /* iOS Safari */ -webkit-user-select: none; /* Chrome/Safari/Opera */ -khtml-user-select: none; /* Konqueror */ -moz-user-select: none; /* Firefox */ -ms-user-select: none; /* Internet Explorer/Edge */ user-select: none; /* Non-prefixed version, currently not supported by any browser */}</style>';

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

    openNewTab(header + tracks.join('\n'));
}

function openNewTab(str) {
    window.open().document.body.appendChild(document.createElement('pre')).innerHTML = str;
}
