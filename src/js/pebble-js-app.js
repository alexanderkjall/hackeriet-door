/**
 * Copyright Alexander Kjäll 2015
 * 
 * This file is part of Hackeriet Door.
 *
 * Hackeriet Door is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Hackeriet Door is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Hackeriet Door.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
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


