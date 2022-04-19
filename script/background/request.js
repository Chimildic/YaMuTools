function requestGET(url, callback) {
    requestOfType({
        type: 'GET',
        url: url,
        formData: null,
        callback: callback,
    });
}

let countRequest = 0;
async function requestOfType(data) {
    if (countRequest > 100) {
        let timerId = setTimeout(() => {
            clearTimeout(timerId);
            requestOfType(data);
        }, 1000);
        return;
    }

    let response = await fetch(data.url, { method: data.type });
    countRequest++;
    if (response.status >= 400) {
        data.callback('error');
    } else {
        response.json().then(content => data.callback(content))
    }
}
