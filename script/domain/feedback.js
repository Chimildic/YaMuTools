remindToWriteFeedback();

function remindToWriteFeedback() {
    chrome.storage.sync.get(['showFeedbackAlert', 'strLastDateFeedbackAlert', 'strDateInstall'], (items) => {
        if (items.showFeedbackAlert && canFireFeedback(items.strLastDateFeedbackAlert, items.strDateInstall)) {
            setLastDateFeedbackAlert();
            fireFeedbackSwal();
        }
    });
}

function canFireFeedback(strLastDateFeedbackAlert, strDateInstall) {
    let today = new Date();

    let lastDateFeedback = new Date(strLastDateFeedbackAlert);
    let diffBetweenFeedbackAlert = diffDateByDays(today, lastDateFeedback);

    let dateInstall = new Date(strDateInstall);
    let diffBetweenInstall = diffDateByDays(today, dateInstall);

    return diffBetweenInstall > 10 && diffBetweenFeedbackAlert > 10;
}

function fireFeedbackSwal() {
    Swal.fire({
        title: 'Спасибо за использование YaMuTools',
        html: 'Вы можете <a href="https://chrome.google.com/webstore/detail/dgjneghdfaeajjemeklgmbojeeplehah" target="_blank">оставить отзыв</a> или <a href="https://qiwi.com/n/CHIMILDIC" target="_blank">отправить донат</a>, чтобы текущие функции работали стабильно, а новые появлялись чаще',
        input: 'checkbox',
        showCloseButton: true,
        showConfirmButton: false,
        showDenyButton: true,
        focusConfirm: true,
        inputPlaceholder: 'Больше не напоминать',
        denyButtonText: 'Закрыть',
        denyButtonColor: '#d33',
        returnInputValueOnDeny: true,
    }).then((action) => {
        if (action.isConfirmed || action.value == 1) {
            setDontShowFeedbackAlert();
        }
    });
}

function openWebStorePage() {
    window.open(`https://chrome.google.com/webstore/detail/${chrome.runtime.id}`);
}

function setLastDateFeedbackAlert() {
    saveOption('strLastDateFeedbackAlert', new Date().toUTCString());
}

function setDontShowFeedbackAlert() {
    saveOption('showFeedbackAlert', false);
}