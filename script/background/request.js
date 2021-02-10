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

    countRequest++;
    try {
        const response = await fetch(data.url, {
            method: data.type,
            body: data.formData,
        });
        data.callback(await response.json());
    } catch (error) {
        console.error(error);
        data.callback('error');
    }
}