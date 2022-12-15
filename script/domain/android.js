showAndroidAlert()

function showAndroidAlert() {
    browser.storage.local.get(['isFirstInstall', 'canShowAndroidAlert', 'strLastDateAndroidAlert', 'strDateInstall'], (items) => {
        if (!items.isFirstInstall && items.canShowAndroidAlert && canFireAndroidAlert(items.strLastDateAndroidAlert, items.strDateInstall)) {
            setLastDateAndroidAlert();
            fireAndroidAlertSwal();
        }
    });
}

function canFireAndroidAlert(strLastDateAndroidAlert, strDateInstall) {
    if (strLastDateAndroidAlert == "") {
        return true
    } 

    let [betweenAlert, betweenInstall] = getDiffDays(strLastDateAndroidAlert, strDateInstall)
    return betweenInstall > 5 && betweenAlert > 16
}


function fireAndroidAlertSwal() {
    Swal.fire({
        title: 'YaMuTools для андроид!',
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Скачать',
        confirmButtonColor: '#50aee5',
        returnInputValueOnDeny: true,
        imageUrl: "https://raw.githubusercontent.com/Chimildic/YaMuTools/manifest-v3/icon/android-screenshots.png"
    }).then((action) => {
        if (action.isConfirmed) {
            openBoostyPage();
        }
    });
}

function openBoostyPage() {
    window.open(`https://boosty.to/chimildic/posts/83160062-b575-40aa-af3f-764d192b5930`);
}

function setLastDateAndroidAlert() {
    saveOption('strLastDateAndroidAlert', new Date().toUTCString());
}
