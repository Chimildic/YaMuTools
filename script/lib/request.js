function requestGET(url, callback) {
    requestOfType({
        type: 'GET',
        url: url,
        formData: null,
        callback: callback,
    });
}

function requestPOST(url, formData, callback) {
    refreshSign(() =>
        requestOfType({
            type: 'POST',
            url: url,
            formData: formData,
            callback: callback,
        })
    );
}

function backgroundGET(url, callback) {
    backgroundRequest('requestGET', url, (response) => callback(response));
}

function backgroundFileGET(url, callback) {
    backgroundRequest('requestFileGET', url, (backgroungdUrl) => {
        requestFileGET(backgroungdUrl, (file) => callback(file));
    });
}

function backgroundRequest(action, url, callback) {
    chrome.runtime.sendMessage({ action: action, url: url }, (response) => callback(response));
}

function requestFileGET(url, callback) {
    let request = new XMLHttpRequest();
    request.responseType = 'blob';
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            callback(request.response);
        }
    };
    request.open('GET', url);
    request.send();
}

function requestFilePOST(url, formData, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            let responseJSON = JSON.parse(request.responseText);
            callback(responseJSON);
        }
    };
    request.open('POST', url);
    request.send(formData);
}

function sendQueuePOST(url, arrayFormData, callback) {
    let completeCount = 0;
    requestPOST(url, arrayFormData[0], function () {
        if (++completeCount != arrayFormData.length) {
            requestPOST(url, arrayFormData[completeCount], arguments.callee);
        } else {
            callback();
        }
    });
}

let countRequest = 0;
function requestOfType(data) {
    if (countRequest > 100) {
        let timerId = setTimeout(() => {
            clearTimeout(timerId);
            requestOfType(data);
        }, 1000);
        return;
    }

    let request = new XMLHttpRequest();
    countRequest++;
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            countRequest--;
            let responseJSON = JSON.parse(request.responseText);
            if (request.status == 412) {
                console.error(request);
                let titlte = 'Произошла ошибка ' + request.status;
                fireErrorSwal('Подробности выведены в консоль (Ctrl + Shift + J)', titlte);
            } else {
                data.callback(responseJSON);
            }
        }
    };
    request.open(data.type, data.url);
    request.setRequestHeader('X-Retpath-Y', location.href);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    if (uid) {
        request.setRequestHeader('X-Current-UID', uid);
    }

    request.send(data.formData);
}

function promisify(f) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            function callback(result, err) {
                if (err) {
                    return reject(err);
                } else {
                    resolve(result);
                }
            }
            args.push(callback);
            f.call(this, ...args);
        });
    };
}
