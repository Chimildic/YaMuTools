function removePodcastElements() {
    removePodcastTab();
    removePodcastPlaylist();
    addSliderButtonEventListener();
    removePodcastMainLine();
}

function removePodcastPlaylist() {
    playlists = document.querySelectorAll('.auto-playlists__item_podcasts');
    for (let i = 0; i < playlists.length; i++) {
        playlists[i].remove();
    }
}

function addSliderButtonEventListener() {
    forward = document.querySelectorAll('.d-slider__control_fwd')[0];
    backward = document.querySelectorAll('.d-slider__control_back')[0];
    if (forward && backward) {
        forward.onclick = removePodcastElements;
        backward.onclick = removePodcastElements;
    }
}

function removePodcastMainLine() {
    elelement = document.querySelector('.page-line_podcasts');
    if (elelement) {
        elelement.remove();
    }
}
