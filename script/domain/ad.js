const Ad = (function () {
    const BANNERS = [
        { landingUrl: "https://go.redav.online/8e625eb4cf0e9580", imageUrl: "https://static.advcake.com/upload/banners/skyengru/b9fea22d329111ac1563fbda330aec48.png" },
        { landingUrl: "https://go.redav.online/d9996a05f8347b60", imageUrl: "https://static.advcake.com/upload/banners/skyengru/0d3bcb4a5cc5cff5dcdeafb52fcaca7b.png" },
        { landingUrl: "https://go.redav.online/ccdbe99e9473a5e0", imageUrl: "https://static.advcake.com/upload/banners/skyengru/c525a11a2aba14d04452a3136c3c6b20.png" },
        { landingUrl: "https://go.redav.online/1aa3a1ff8f16dea0", imageUrl: "https://static.advcake.com/upload/banners/skyengru/2449d70caeac6d8fd59c2267a25c865c.png" },
        { landingUrl: "https://go.redav.online/1aa3a1ff8f16dea0", imageUrl: chrome.runtime.getURL("/img/free-lesson.png") },
        { landingUrl: "https://go.redav.online/5234d4a9e18642e0", imageUrl: chrome.runtime.getURL("/img/check.png") },
        { landingUrl: null }
    ]

    const TARGET = [
        { landingUrl: "https://go.redav.online/16cbc2f417a29da0", title: "начинающих" },
        { landingUrl: "https://go.redav.online/704a6f04f4d3ce10", title: "продолжающих" },
        { landingUrl: "https://go.redav.online/8fbb6459ecdc40a0", title: "общения" },
        { landingUrl: "https://go.redav.online/cd5237ee61150200", title: "путешествий" },
        { landingUrl: "https://go.redav.online/2b4a396c76530f50", title: "менеджеров" },
        { landingUrl: "https://go.redav.online/c65b80f50f5c44e0", title: "IT-специалистов" },
    ]

    const DURATION_MS = 11500
    var _isAdShown = false
    return { showAdIfCan, show, canShowAd, continueAfterAd }

    async function canShowAd() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['strLastDateAd'], (items) => {
                let today = new Date()
                let lastDateAd = new Date(items.strLastDateAd)
                resolve(diffDateByDays(today, lastDateAd) > 3)
            });
        })

    }

    function showAdIfCan(desc) {
        return new Promise(async resolve => {
            if (await canShowAd()) {
                show(desc)
            }
            continueAfterAd(resolve)
        })
    }

    function show(desc) {
        _isAdShown = true
        Swal.fire({
            html: createHtml(desc),
            allowOutsideClick: false,
            showConfirmButton: false,
        });
        setTimeout(() => {
            _isAdShown = false;
            Swal.close()
            saveOption("strLastDateAd", new Date().toUTCString())
        }, DURATION_MS)
    }

    function continueAfterAd(callback) {
        let id = setInterval(() => {
            if (!_isAdShown) {
                clearInterval(id)
                callback()
            }
        }, 100)
    }

    function createHtml(desc) {
        let banner = getRandomValue(BANNERS)
        var html = ""
        if (banner.landingUrl == null) {
            var li = ""
            TARGET.forEach(t => li += `<li><a href="${t.landingUrl}" target="_blank">${t.title}</a></li>`)
            html = `<div><h3>Английский всегда разный для:</h3><ul>${li}</ul></div>`
        } else {
            html = `<div><a href="${banner.landingUrl}" target="_blank"><img style="max-width:100%;height:auto;" src="${banner.imageUrl}" /></a></div>`
        }
        html += `</br></br><div><small>${desc}</small></div>`
        return html
    }
})()