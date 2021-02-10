function requestFileGET(url, callback) {
    let request = new XMLHttpRequest();
    request.responseType = 'blob';
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            let url = URL.createObjectURL(request.response);
            callback(url);
        }
    };
    request.open('GET', url);
    request.send();
}

function requestGET(url, callback) {
    requestOfType({
        type: 'GET',
        url: url,
        formData: null,
        callback: callback,
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
            if (request.status >= 400) {
                data.callback('error');
            } else {
                let responseJSON = JSON.parse(request.responseText);
                data.callback(responseJSON);
            }
        }
    };
    request.open(data.type, data.url);
    request.send(data.formData);
}
