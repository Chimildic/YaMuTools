remindToWriteFeedback();

function remindToWriteFeedback(){
    browser.storage.local.get(['showFeedbackAlert', 'lastShownFeedbackAlert', 'strDateInstall'], (items) => {
        if (items.showFeedbackAlert && canFireFeedback(items.lastShownFeedbackAlert, items.strDateInstall)){
            setLastShownFeedbackAlert();
            fireFeedbackSwal();
        }
    });
}

function canFireFeedback(strLastDateFeedbackAlert, strDateInstall) {
    let [diffBetweenFeedbackAlert, diffBetweenInstall] = getDiffDays(strLastDateFeedbackAlert, strDateInstall)
    return diffBetweenInstall > 7 && diffBetweenFeedbackAlert > 10;
}

function fireFeedbackSwal() {
    Swal.fire({
        title: 'Спасибо за использование YaMuTools',
        html: 'Вы можете <a href="https://browser.google.com/webstore/detail/dgjneghdfaeajjemeklgmbojeeplehah" target="_blank">оставить отзыв</a> или <a href="https://qiwi.com/n/CHIMILDIC" target="_blank">отправить донат</a>, чтобы текущие функции работали стабильно, а новые появлялись чаще',
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

function openWebStorePage(){
    window.open(`https://addons.mozilla.org/ru/firefox/addon/yamutools/`);
}

function setLastDateFeedbackAlert() {
    saveOption('strLastDateFeedbackAlert', new Date().toUTCString());
}

function setDontShowFeedbackAlert() {
    saveOption('showFeedbackAlert', false);
}

function getDiffDays(strLastDate, strDateInstall) {
    let today = new Date();

    let lastDate = new Date(strLastDate);
    let diffBetweenAlert = diffDateByDays(today, lastDate);

    let dateInstall = new Date(strDateInstall);
    let diffBetweenInstall = diffDateByDays(today, dateInstall);

    return [diffBetweenAlert, diffBetweenInstall]
}