function fireCollectorSwal(title) {
    fireLoadingSwal(getMessage('info_playlist_creating', [title]));
}

function fireLikerSwal() {
    fireInfoSwal(getMessage('info_server_waiting'));
}

function fireLoadingSwal(text, title) {
    fireGifSwal({
        title: title,
        text: text,
        imageUrl: 'https://i.ibb.co/D8R6YXC/Spin-2-9s-100px.gif',
    });
}

function fireDrawingSwal(text, title) {
    fireGifSwal({
        title: title,
        text: text,
        imageUrl: 'https://media.giphy.com/media/WQId4twEIvSyOlu3fm/giphy.gif',
    });
}

function fireGifSwal(data) {
    Swal.fire({
        imageUrl: data.imageUrl,
        title: data.title,
        text: data.text,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
}

function fireInfoSwal(text, title) {
    fireSwal(text, title, 'info');
}

function fireErrorSwal(text, title) {
    fireSwal(text, title, 'error');
}

function fireSwal(text, title, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
    });
}

function fireYesNoSwal(json, callback) {
    Swal.fire({
        title: json.title,
        text: json.text,
        icon: json.icon,
        showCancelButton: true,
        cancelButtonText: getMessage('button_no'),
        cancelButtonColor: '#d33',
        confirmButtonText: getMessage('button_yes'),
        confirmButtonColor: '#3085d6',
    }).then((action) => {
        if (action.isConfirmed) {
            callback(action.value);
        }
    });
}

function fireSelectSwal(json, callback) {
    return Swal.fire({
        title: json.title,
        text: json.text,
        input: 'select',
        inputPlaceholder: json.inputPlaceholder,
        inputOptions: json.inputOptions,
        showCancelButton: true,
        cancelButtonText: 'Отмена',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
    });
}
