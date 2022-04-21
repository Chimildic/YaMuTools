sayHello();

function sayHello() {
    browser.storage.local.get(['isFirstInstall'], (items) => {
        if (items.isFirstInstall) {
            fireHelloSwal();
            saveOption('isFirstInstall', false);
        }
    });
}

function fireHelloSwal() {
    Swal.fire({
        title: 'Как использовать YaMuTools',
        html: '<div style="text-align: start;">Расширение добавляет кнопки на страницы Яндекс.Музыки. Например, в общем списке ваших плейлистов есть меню "Коллекционер". </br></br> Кроме того, на странице исполнителя и плейлиста (не боковое отображение, а отдельная страница). </br></br> Для более тонкой настройки загляните в настройки расширения.</div>'
    });
}