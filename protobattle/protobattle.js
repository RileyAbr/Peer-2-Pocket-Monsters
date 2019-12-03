// function recieve(friendCode) {
var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
var recvId = document.getElementById("receiver-id");
var status = document.getElementById("status");

var message = document.getElementById("message");
var sendMessageBox = document.getElementById("sendMessageBox");
var sendButton = document.getElementById("sendButton");
var clearMsgsButton = document.getElementById("clearMsgsButton");
/**
 * Create the Peer object for our end of the connection.
 *
 * Sets up callbacks that handle any events related to our
 * peer object.
 */
function initialize() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });
    peer.on('open', function (id) {
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
            console.log('Received null id from peer open');
            peer.id = lastPeerId;
        } else {
            lastPeerId = peer.id;
        }
        console.log('ID: ' + peer.id);
        recvId.innerHTML = "ID: " + peer.id;
        status.innerHTML = "Awaiting connection...";
    });
    peer.on('connection', function (c) {
        // Allow only a single connection
        if (conn) {
            c.on('open', function () {
                c.send("Already connected to another client");
                setTimeout(function () { c.close(); }, 500);
            });
            return;
        }
        conn = c;
        console.log("Connected to: " + conn.peer);
        status.innerHTML = "Connected"
        ready();
    });
    peer.on('disconnected', function () {
        status.innerHTML = "Connection lost. Please reconnect";
        console.log('Connection lost. Please reconnect');
        // Workaround for peer.reconnect deleting previous id
        peer.id = lastPeerId;
        peer._lastServerId = lastPeerId;
        peer.reconnect();
    });
    peer.on('close', function () {
        conn = null;
        status.innerHTML = "Connection destroyed. Please refresh";
        console.log('Connection destroyed');
    });
    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });
    // };


    /**
 * Triggered once a connection has been achieved.
 * Defines callbacks to handle incoming data and connection events.
 */

}

// function send(friendCode) {

//     var lastPeerId = null;
//     var peer = null; // own peer object
//     var conn = null;
//     var recvIdInput = document.getElementById("receiver-id");
//     var status = document.getElementById("status");
//     var message = document.getElementById("message");
//     var goButton = document.getElementById("goButton");
//     var resetButton = document.getElementById("resetButton");
//     var fadeButton = document.getElementById("fadeButton");
//     var offButton = document.getElementById("offButton");
//     var sendMessageBox = document.getElementById("sendMessageBox");
//     var sendButton = document.getElementById("sendButton");
//     var clearMsgsButton = document.getElementById("clearMsgsButton");
//     var connectButton = document.getElementById("connect-button");
//     var cueString = "<span class=\"cueMsg\">Cue: </span>";
//     /**
//      * Create the Peer object for our end of the connection.
//      *
//      * Sets up callbacks that handle any events related to our
//      * peer object.
//      */
//     function initialize() {
//         // Create own peer object with connection to shared PeerJS server
//         peer = new Peer(null, {
//             debug: 2
//         });
//         peer.on('open', function (id) {
//             // Workaround for peer.reconnect deleting previous id
//             if (peer.id === null) {
//                 console.log('Received null id from peer open');
//                 peer.id = lastPeerId;
//             } else {
//                 lastPeerId = peer.id;
//             }
//             console.log('ID: ' + peer.id);
//         });
//         peer.on('disconnected', function () {
//             status.innerHTML = "Connection lost. Please reconnect";
//             console.log('Connection lost. Please reconnect');
//             // Workaround for peer.reconnect deleting previous id
//             peer.id = lastPeerId;
//             peer._lastServerId = lastPeerId;
//             peer.reconnect();
//         });
//         peer.on('close', function () {
//             conn = null;
//             status.innerHTML = "Connection destroyed. Please refresh";
//             console.log('Connection destroyed');
//         });
//         peer.on('error', function (err) {
//             console.log(err);
//             alert('' + err);
//         });
//     };
// }

initialize();