function getLastfmLogin(callback) {
    getReassignLoginLastfm((login) => {
        if (login.length > 0) {
            loginLastfm = login;
            checkLastfmUser(callback);
            return;
        }

        receiveLastfmLogin((login) => {
            if (!login) {
                fireErrorSwal(getMessage('error_login_lastfm'));
            } else {
                loginLastfm = login;
                checkLastfmUser(callback);
            }
        });
    });
}

function checkLastfmUser(callback) {
    receiveLovedTracksLastfmByPage(1, (response) => {
        if (response.error == 6) {
            console.log(response.message);
            fireErrorSwal(`Пользователь ${loginLastfm} не найден.`);
            loginLastfm = '';
        } else {
            callback();
        }
    });
}

function getReassignLoginLastfm(callback) {
    chrome.storage.sync.get(['reassignLoginLastfm'], (items) => {
        callback(items.reassignLoginLastfm);
    });
}

function receiveLastfmLogin(callback) {
    let url = `${HANDLER_LIBRARY}?owner=${owner}&filter=playlists`;
    requestGET(url, function (responseJSON) {
        let profiles = responseJSON.profiles;
        if (!profiles) {
            return;
        }

        for (let i = 0; i < profiles.length; i++) {
            if (profiles[i].provider == 'lastfm') {
                let address = profiles[i].addresses[0];
                loginLastfm = address.split('/')[4];
                break;
            }
        }

        callback(loginLastfm);
    });
}

function receiveAllPlaylists(callback) {
    let url = `${HANDLER_LIBRARY}?owner=${owner}&filter=playlists`;
    requestGET(url, function (responseJSON) {
        callback(responseJSON.playlists);
    });
}

function receiveHistory() {
    return new Promise(resolve => {
        let url = `${HANDLER_LIBRARY}?owner=${owner}&filter=history`;
        requestGET(url, (response) => resolve(response));
    })
}
