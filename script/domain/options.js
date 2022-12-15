document.addEventListener('DOMContentLoaded', onLoadedPage);

function onLoadedPage() {
    restoreOptions();
    addCheckboxEventListener();
    
    fillFooter();
}

function addCheckboxEventListener() {
    addEventListener('checkbox', 'change', (e) => {
        displayContext(e.target);
        saveOption(e.target.id, e.target.checked);
    });
}

function addEventListener(type, action, callback) {
    document.querySelectorAll(`[type="${type}"]`).forEach((element) => element.addEventListener(action, (e) => callback(e)));
}

function fillFooter() {
    manifestData = browser.runtime.getManifest();
    version.innerText = `${getMessage('ext_ver')} ${manifestData.version}`;
    author.innerText = `${manifestData.author}, ${new Date().getFullYear()}`;
    btnResetOptions.addEventListener('click', onClickResetOptions);
}

function restoreOptions() {
    // Pass in null to get the entire contents of storage.
    // https://developer.browser.com/extensions/storage#StorageArea-methods
    browser.storage.local.get(null, function (items) {
        restoreChecked(items);
        restoreContext(items);
        restoreLastfmLogin(items);
        restoreLastfmRange(items);
        restoreActionWithPlaylist(items);
        restoreSimilarPlaylistRange(items);
    });
}

function restoreChecked(items) {
    let keys = Object.keys(items);
    for (i = 0; i < keys.length; i++) {
        let element = document.getElementById(keys[i]);
        if (element && element.type == 'checkbox') {
            element.checked = items[keys[i]];
        }
    }
}

function restoreContext(items) {
    restoreUserTabContext(items.dataUserTab);
    // restoreSectionDonate(items.onDonateSection, items.countCreatedPlaylist);
}

function restoreLastfmLogin(items){
    reassignLoginLastfm.value = items.reassignLoginLastfm;

    reassignLoginLastfm.addEventListener('input', debounce(() =>{
        saveOption('reassignLoginLastfm', reassignLoginLastfm.value);
    }, 1000));
}


function restoreRange(data){
    let idRange = data.idRange;
    let idCurrent = data.idCurrent;
    let startValue = data.startValue;
    let parseMethod = data.parseMethod;
    
    idRange.value = startValue;
    idCurrent.innerText = idRange.value;
    idRange.oninput = () =>{
        idCurrent.innerText = idRange.value;
    };
    idRange.addEventListener('change', debounce(() =>{
        saveOption(idRange.id, parseMethod(idRange.value));
    }, 1000));  
}


function restoreLastfmRange(items) {
    restoreRange({
        idRange: requestLastfmRange, 
        idCurrent: idLastfmRangeCurrent, 
        startValue: items.requestLastfmRange,
        parseMethod: parseInt
    });
}

function restoreSimilarPlaylistRange(items){
    restoreRange({
        idRange: similarPlaylistCountTracks, 
        idCurrent: similarPlaylistCountTracksCurrent, 
        startValue: items.similarPlaylistCountTracks,
        parseMethod: parseInt
    });
    restoreRange({
        idRange: similarThreshold, 
        idCurrent: similarThresholdCurrent, 
        startValue: items.similarThreshold,
        parseMethod: parseFloat
    });

}

function restoreActionWithPlaylist(items) {
    actionWithPlaylist.selectedIndex = [].map.call(actionWithPlaylist.options, (option) => {
            return option.value;
    }).indexOf(items.actionWithPlaylist);

    actionWithPlaylist.onchange = function () {
        saveOption('actionWithPlaylist', this.options[this.selectedIndex].value);
    };
}

function restoreUserTabContext(data) {
    displayContext(onUserTab);
    titleUserTab.value = data.title;
    urlUserTab.value = data.url;

    titleUserTab.addEventListener('input', debounce(onInputUserTabContext, 1000));
    urlUserTab.addEventListener('input', debounce(onInputUserTabContext, 1000));
}

// function restoreSectionDonate(onDonateSection, countCreatedPlaylist) {
//     donateSection.style.display = onDonateSection ? 'flex' : 'none';    
//     checkboxDonateSection.style.display = countCreatedPlaylist > 30 ? 'flex' : 'none';
//     checkboxDonateSection.onchange = () =>{
//         location.reload();
//     };
// }

function onInputUserTabContext() {
    saveOption('dataUserTab', {
        title: titleUserTab.value,
        url: urlUserTab.value,
    });
}

function onClickResetOptions() {
    fireYesNoSwal(
        {
            title: getMessage('info_reset_options'),
            icon: 'warning',
        },
        () => browser.runtime.sendMessage({ action: 'resetOptions' }, onLoadedPage)
    );
}

function displayContext(element) {
    let contextId = document.getElementById(element.id).getAttribute('data-context-id');
    let context = document.getElementById(contextId);
    if (context) {
        context.style.display = element.checked ? 'block' : 'none';
    }
}

function saveOption(key, value) {
    option = {};
    option[key] = value;

    browser.storage.local.set(option, function () {
        if (browser.runtime.lastError) {
            fireErrorSwal(browser.runtime.lastError.message, getMessage('error_storage_sync'));
        }
    });
}

function debounce(func, wait) {
    let timeout;

    return function executedFunction() {
        let context = this;
        let later = function () {
            timeout = null;
            func.apply(context);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
