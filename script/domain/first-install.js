sayHello();

function sayHello() {
    chrome.storage.sync.get(['isFirstInstall', 'canShowSurvey'], (items) => {
        if (items.isFirstInstall) {
            fireHelloSwal();
            saveOption('isFirstInstall', false);
        } else if (items.canShowSurvey) {
            // fireSurvey();
            saveOption('canShowSurvey', false);
        }
    });
}

function fireHelloSwal() {
    Swal.fire({
        title: 'Как использовать YaMuTools',
        html: '<div style="text-align: start;">Расширение добавляет кнопки на страницы Яндекс.Музыки. Например, в общем списке ваших плейлистов есть меню "Коллекционер". </br></br> Кроме того, на странице исполнителя и плейлиста (не боковое отображение, а отдельная страница). </br></br> Для более тонкой настройки загляните в настройки расширения.</div>'
    });
}

function fireSurvey() {
    Swal.fire({
        title: 'Опрос пользователей YaMuTools',
        text: 'Займет всего 1 минуту',
        showCancelButton: true,
        cancelButtonText: 'Закрыть',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Пройти',
        confirmButtonColor: '#3085d6',
    }).then((action) => {
        if (action.isConfirmed) {
            let url = 'https://docs.google.com/forms/d/e/1FAIpQLSftXIQMD1UIXL05CN7toB3uA_pX4nAhWDyR4jNsYwBcPOOYrg/viewform?usp=sf_link';
            window.open(url, '_blank')
        }
    });
}