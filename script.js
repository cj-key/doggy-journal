var displayedDate = new Date();

// Function to add a timestamp for a given activity
function addTimestamp(activity) {
    var timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    var activityTimestamps = getTimestampsFromStorage(activity);

    if (activityTimestamps.length >= 4) {
      // Maximum of 4 timestamps reached, remove the oldest one
      activityTimestamps.shift();
    }

    activityTimestamps.push(timestamp);
    saveTimestampsToStorage(activity, activityTimestamps);
    displayTimestamps(activity, activityTimestamps);
    adjustTileWidth(activity, 1); // Increase tile width
}

// Function to remove the most recent timestamp for a given activity
function removeTimestamp(activity) {
    var activityTimestamps = getTimestampsFromStorage(activity);

    if (activityTimestamps.length > 0) {
      activityTimestamps.pop();
      saveTimestampsToStorage(activity, activityTimestamps);
      displayTimestamps(activity, activityTimestamps);
      adjustTileWidth(activity, -1); // Decrease tile width
    }
}

// Function to retrieve timestamps from local storage
function getTimestampsFromStorage(activity) {
    var dateKey = displayedDate.toISOString().substring(0, 10); // Create a standardized date string
    var timestamps = localStorage.getItem(activity + 'Timestamps' + dateKey);
    return timestamps ? JSON.parse(timestamps) : [];
}

// Function to save timestamps to local storage
function saveTimestampsToStorage(activity, timestamps) {
    var dateKey = displayedDate.toISOString().substring(0, 10); // Create a standardized date string
    localStorage.setItem(activity + 'Timestamps' + dateKey, JSON.stringify(timestamps));
}

// Function to display timestamps for a given activity
function displayTimestamps(activity, timestamps) {
    var activityTimestamps = document.getElementById(activity + 'Timestamps');
    activityTimestamps.innerHTML = '';

    for (var i = 0; i < timestamps.length; i++) {
      var newTimestamp = document.createElement('div');
      newTimestamp.innerText = timestamps[i];
      activityTimestamps.appendChild(newTimestamp);
    }
}

// Function to navigate the day forward or backward
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

    // Clear the timestamps for each activity
    var activities = ['food', 'water', 'potty'];
    activities.forEach(function(activity) {
        var activityTimestampsElement = document.getElementById(activity + 'Timestamps');
        activityTimestampsElement.innerHTML = '';
    });

    // Load the timestamps for the new day
    activities.forEach(function(activity) {
        var activityTimestamps = getTimestampsFromStorage(activity);
        displayTimestamps(activity, activityTimestamps);
    });
}

// Initialize the current date and time on page load
window.onload = function () {
    navigateDay(0);
};

function changeBar(activity, value) {
    var barFill = document.getElementById(activity + 'BarFill');

    // Calculate the new width of the bar
    var fillWidth = (parseInt(barFill.style.width) || 0) + value * 25;

    if (fillWidth < 0) {
        fillWidth = 0;
    } else if (fillWidth > 100) {
        fillWidth = 100;
    }

    barFill.style.width = fillWidth + '%';

    // Only allow editing of timestamps if the displayed date is the current date
    var currentDate = new Date();
    if (displayedDate.toDateString() == currentDate.toDateString()) {
        // Add or remove timestamp
        if (value > 0) {
            addTimestamp(activity);
        } else {
            removeTimestamp(activity);
        }
    }
}