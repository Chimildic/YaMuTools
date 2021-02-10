const RANDOM_COVER_MENU_ITEM = {
    title: getMessage('random_cover_title'),
    handler: onClickItemRandomCover,
};

function addItemRandomCover() {
    removeById('randomCoverItemMenu');
    let ul = document.querySelector('.d-links__popup');
    if (ul) {
        let li = document.createElement('li');
        li.id = 'randomCoverItemMenu';
        li.className = 'd-links__link deco-popup-menu__item';
        li.innerHTML = `<span class="d-link deco-link d-links__link_text d-link_no-hover-color deco-link_no-hover-color d-link_no-hover"> <span class="d-icon deco-icon d-icon_shuffle"></span>${getMessage(
            'random_cover_title'
        )}</span>`;
        li.addEventListener('click', onClickItemRandomCover);
        ul.insertAdjacentElement('afterbegin', li);
    }
}

function removeItemRandomCover() {
    removeById('randomCoverItemMenu');
}

function onClickItemRandomCover() {
    toggleDropdown('menuPlaylistMain');
    fireDrawingSwal();
    let kind = getArgsByLocation()['kind'];
    setRandomCover(kind, () => redirectToPlaylist(kind));
}
