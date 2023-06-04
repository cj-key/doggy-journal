var displayedDate = new Date();

function addTimestamp(activity) {
    var timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    var activityTimestamps = getTimestampsFromStorage(activity);

    if (activityTimestamps.length >= 4) {
        activityTimestamps.shift();
    }

    activityTimestamps.push(timestamp);
    saveTimestampsToStorage(activity, activityTimestamps);
    displayTimestamps(activity, activityTimestamps);
}

function removeTimestamp(activity) {
    var activityTimestamps = getTimestampsFromStorage(activity);

    if (activityTimestamps.length > 0) {
        activityTimestamps.pop();
        saveTimestampsToStorage(activity, activityTimestamps);
        displayTimestamps(activity, activityTimestamps);
    }
}

function getTimestampsFromStorage(activity) {
    var dateKey = displayedDate.toISOString().substring(0, 10);
    var timestamps = localStorage.getItem(activity + 'Timestamps' + dateKey);
    return timestamps ? JSON.parse(timestamps) : [];
}

function saveTimestampsToStorage(activity, timestamps) {
    var dateKey = displayedDate.toISOString().substring(0, 10);
    localStorage.setItem(activity + 'Timestamps' + dateKey, JSON.stringify(timestamps));
}

function displayTimestamps(activity, timestamps) {
    var activityTimestamps = document.getElementById(activity + 'Timestamps');
    activityTimestamps.innerHTML = '';

    for (var i = 0; i < timestamps.length; i++) {
        var newTimestamp = document.createElement('div');
        newTimestamp.innerText = timestamps[i];
        activityTimestamps.appendChild(newTimestamp);
    }
}

function getBarFillFromStorage(activity) {
    var dateKey = displayedDate.toISOString().substring(0, 10);
    var fillWidth = localStorage.getItem(activity + 'BarFill' + dateKey);
    return fillWidth ? JSON.parse(fillWidth) : 0;
}

function saveBarFillToStorage(activity, fillWidth) {
    var dateKey = displayedDate.toISOString().substring(0, 10);
    localStorage.setItem(activity + 'BarFill' + dateKey, JSON.stringify(fillWidth));
}

function changeBar(activity, value) {
    var barFill = document.getElementById(activity + 'BarFill');
    var fillWidth = getBarFillFromStorage(activity) + value * 25;

    if (fillWidth < 0) {
        fillWidth = 0;
    } else if (fillWidth > 100) {
        fillWidth = 100;
    }

    barFill.style.width = fillWidth + '%';
    saveBarFillToStorage(activity, fillWidth);

    var currentDate = new Date();
    if (displayedDate.toDateString() == currentDate.toDateString()) {
        if (value > 0) {
            addTimestamp(activity);
        } else {
            removeTimestamp(activity);
        }
    }
}

function navigateDay(offset) {
    displayedDate.setDate(displayedDate.getDate() + offset);

    var dateElement = document.getElementById('date');
    dateElement.innerText = displayedDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

    var timeElement = document.getElementById('time');
    if (offset === 0) {
        timeElement.innerText = displayedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        timeElement.innerText = '';
    }

    var activities = ['food', 'water', 'potty'];
    activities.forEach(function(activity) {
        var activityTimestampsElement = document.getElementById(activity + 'Timestamps');
        activityTimestampsElement.innerHTML = '';

        var activityTimestamps = getTimestampsFromStorage(activity);
        displayTimestamps(activity, activityTimestamps);

        var barFill = document.getElementById(activity + 'BarFill');
        var fillWidth = getBarFillFromStorage(activity);
        barFill.style.width = fillWidth + '%';
    });
}

window.onload = function () {
    navigateDay(0);
};
