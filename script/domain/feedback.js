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

    return diffBetweenInstall > 16 && diffBetweenFeedbackAlert > 16;
}

function fireFeedbackSwal() {
    Swal.fire({
        title: 'Оцените расширение YaMuTools',
        input: 'checkbox',
        showCloseButton: true,
        showConfirmButton: true,
        showDenyButton: true,
        focusConfirm: true,
        inputPlaceholder: 'Больше не напоминать',
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Оставить отзыв',
        confirmButtonColor: '#3085d6',
        denyButtonText: 'Закрыть',
        denyButtonColor: '#d33',
        returnInputValueOnDeny: true,
    }).then((action) => {
        if (action.isConfirmed) {
            openWebStorePage();
        }
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