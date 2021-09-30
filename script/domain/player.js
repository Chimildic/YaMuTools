const RadioRepeater = (function () {
    const ID_REPEAT_RADIO_BUTTON = 'yamutools-repeat-radio-button';
    const CLASS_REPEAT_ONCE = 'player-controls__btn_repeat_state2';
    const PLACE_MUSIC = '.player-controls__seq-controls';
    const PLACE_RADIO = '.player-controls__bar';

    externalAPI.on(externalAPI.EVENT_READY, addButton);
    externalAPI.on(externalAPI.EVENT_CONTROLS, addButton);

    function getButton() {
        return document.getElementById(ID_REPEAT_RADIO_BUTTON);
    }

    function addButton() {
        let hasCustom = getButton();
        let hasDefault = externalAPI.getControls().repeat != null;
        if (hasCustom && hasDefault) {
            getButton().remove();
        } else if (!hasCustom && !hasDefault) {
            insertButton(createButton());
        }
    }

    function createButton() {
        let button = document.createElement('div');
        button.setAttribute('id', ID_REPEAT_RADIO_BUTTON);
        button.setAttribute('class', 'player-controls__btn deco-player-controls__button player-controls__btn_repeat');
        button.setAttribute('style', 'display:inline-block;');
        button.setAttribute('title', 'Повторять');
        button.innerHTML = '<div class="d-icon d-icon_repeat"></div>';
        button.addEventListener('click', onClick);
        return button;
    }

    function insertButton(button) {
        let selector = location.hostname.includes('radio') ? PLACE_RADIO : PLACE_MUSIC;
        let where = selector == PLACE_RADIO ? 'afterend' : 'beforeend';
        document.querySelector(selector).insertAdjacentElement(where, button);
    }

    function onClick() {
        let button = getButton();
        button.classList.toggle(CLASS_REPEAT_ONCE);
        button.firstChild.classList.toggle('d-icon_repeat-one-gold');
        if (button.classList.contains(CLASS_REPEAT_ONCE)) {
            externalAPI.on(externalAPI.EVENT_PROGRESS, onProgress)
        } else {
            externalAPI.off(externalAPI.EVENT_PROGRESS, onProgress);
        }
    }

    function onProgress() {
        let progress = externalAPI.getProgress();
        if ((progress.duration - progress.position) <= 0.900) {
            externalAPI.setPosition(0);
        }
    }
})();
