
var xhrRequest = function (url, type, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(this.responseText);
    };
    xhr.onerror = function(evt) {
        console.log("An error occurred while transferring the file.");
    };

    xhr.open(type, url, true);
    xhr.send();
};

function getDoorStatus() {
    console.log('Getting door status.');
    // Construct URL
    var url = 'https://hackeriet.no/door.json';

    // Send request to door.json
    xhrRequest(url, 'GET',
        function(responseText) {
            // responseText contains a JSON object with door info
            var json = JSON.parse(responseText);

            // Assemble dictionary using our keys
            var dictionary = {
                'KEY_STATUS': json.status == "OPEN" ? 'y' : 'n'
            };

            console.log("message: " + JSON.stringify(dictionary));

            // Send to Pebble
            Pebble.sendAppMessage(dictionary,
                function(e) {
                    console.log('Door info sent to Pebble successfully!');
                },
                function(e) {
                    console.log('Error sending door info to Pebble!');
                }
            );
        }
    );
}

// Listen for when the watchface is opened
Pebble.addEventListener('ready',
    function(e) {
        console.log('PebbleKit JS ready!');

        // Get the initial door status
        getDoorStatus();
    }
);

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage',
    function(e) {
        console.log('AppMessage received!');
        getDoorStatus();
    }
);

console.log('js Started');


