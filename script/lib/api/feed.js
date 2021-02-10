function receiveFeedByRevision(date, callback) {
    let url = `${HANDLER_FEED}?revision=${date}`;
    requestGET(url, callback);
}

function receiveFeedEvents(countDays, callback) {
    receiveFeedDays(countDays, function (feedDays) {
        let events = [];
        for (let i = 0; i < feedDays.length; i++) {
            events.push.apply(events, feedDays[i].events);
        }
        callback(events);
    });
}

function receiveFeedDays(countDays, callback) {
    let today = new Date().toISOString().slice(0, 10);
    let feedDays = [];
    receiveFeedByRevision(today, function (responseJSON) {
        feedDays.push.apply(feedDays, responseJSON.days);
        if (--countDays > 0 && responseJSON.canGetMoreEvents && responseJSON.nextRevision) {
            receiveFeedByRevision(responseJSON.nextRevision, arguments.callee);
        } else {
            callback(feedDays);
        }
    });
}
