remindToWriteFeedback();

function remindToWriteFeedback(){
    chrome.storage.sync.get(['showFeedbackAlert', 'lastShownFeedbackAlert', 'strDateInstall'], (items) => {
        if (items.showFeedbackAlert && canFireFeedback(items.lastShownFeedbackAlert, items.strDateInstall)){
            setLastShownFeedbackAlert();
            fireFeedbackSwal();
        }
    });
}

function canFireFeedback(lastDayShown, strDateInstall){  
    let today = new Date();
    let dayOfMonth = today.getDate();
    let dateInstall = new Date(Date.parse(strDateInstall));
    let diffBetweenDate = diffDateByDays(today, dateInstall);

    return diffBetweenDate > 1 && dayOfMonth - lastDayShown > 1;
}

function fireFeedbackSwal(){
    Swal.fire({
        title: 'Оцените расширение YaMuTools',
        input: 'checkbox',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: true,
        inputPlaceholder: 'Больше не напоминать',
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Оставить отзыв',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Закрыть',
        cancelButtonColor: '#d33'
    }).then((action) => {
        if (action.isConfirmed){
            openWebStorePage();
        }

        if (action.isConfirmed || action.value == 1){
            setDontShowFeedbackAlert();
        }
    });
}

function openWebStorePage(){
    window.open(`https://chrome.google.com/webstore/detail/${chrome.runtime.id}`);
}

function setLastShownFeedbackAlert(){
    saveOption('lastShownFeedbackAlert', new Date().getDate());
}

function setDontShowFeedbackAlert(){
    saveOption('showFeedbackAlert', false);
}