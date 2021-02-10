function searchTracksByImport(content, callback) {
    let formData = `content=${content}&sign=${sign}`;
    requestPOST(HANDLER_IMPORT, formData, function (responseJSON) {
        if (!responseJSON.success) {
            return;
        }

        let code = responseJSON.importCode;
        let timerId = setInterval(
            () =>
                getImportStatus(code, function (tracks) {
                    clearInterval(timerId);
                    callback(tracks);
                }),
            1000
        );
    });
}

function getImportStatus(code, callback) {
    let url = `${HANDLER_IMPORT}?code=${code}`;
    requestGET(url, function (responseJSON) {
        if (responseJSON.status == 'done') {
            callback(responseJSON.tracks);
        }
    });
}
