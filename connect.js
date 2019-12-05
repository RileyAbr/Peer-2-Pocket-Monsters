var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
// var recvId = document.getElementById("room-id-key");
var recvId = document.getElementById("room-key");
var recvIdInput = document.getElementById("receiver-id-input");
var connectButton = document.getElementById("login-menu-submit");
var stat = document.getElementById("stat");

var message = document.getElementById("chat-messages");
var sendMessageBox = document.getElementById("chat-send-message-input");
var sendButton = document.getElementById("chat-send-message-button");
// No html item
// var clearMsgsButton = document.getElementById("clearMsgsButton");

// Battle buttons
var move0Button = document.getElementById("battle-move-0");
var move1Button = document.getElementById("battle-move-1");
var move2Button = document.getElementById("battle-move-2");
var move3Button = document.getElementById("battle-move-3");

var systemString = "<span class=\"cueMsg\">System: </span>";

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
        recvId.innerHTML = peer.id;
        stat.innerHTML = "Awaiting connection...";
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
        stat.innerHTML = "Connected"
        ready();
    });

    peer.on('disconnected', function () {
        stat.innerHTML = "Connection lost. Please reconnect";
        console.log('Connection lost. Please reconnect');
        // Workaround for peer.reconnect deleting previous id
        peer.id = lastPeerId;
        peer._lastServerId = lastPeerId;
        peer.reconnect();
    });

    peer.on('close', function () {
        conn = null;
        stat.innerHTML = "Connection destroyed. Please refresh";
        console.log('Connection destroyed');
    });

    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });
}

/**
* Create the connection between the two Peers.
*
* Sets up callbacks that handle any events related to the
* connection and data received on it.
*/
function join() {
    // Close old connection
    if (conn) {
        conn.close();
    }
    // Create connection to destination peer specified in the input field
    conn = peer.connect(recvIdInput.value, {
        reliable: true
    });

    conn.on('open', function () {
        stat.innerHTML = "Connected to: " + conn.peer;
        console.log("Connected to: " + conn.peer);
        // Check URL params for comamnds that should be sent immediately
        var command = getUrlParam("command");
        if (command)
            conn.send(command);
    });

    // // Handle incoming data (messages only since this is the signal sender)
    conn.on('data', function (data) {
        addMessage("<span class=\"peerMsg\">Peer:</span> " + data);
    });

    conn.on('close', function () {
        stat.innerHTML = "Connection closed";
    });
};

/**
 * Get first "GET style" parameter from href.
 * This enables delivering an initial command upon page load.
 *
 * Would have been easier to use location.hash.
 */
function getUrlParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return null;
    else
        return results[1];
};

function addMessage(msg) {
    var now = new Date();
    var h = now.getHours();
    var m = addZero(now.getMinutes());
    var s = addZero(now.getSeconds());
    if (h > 12)
        h -= 12;
    else if (h === 0)
        h = 12;
    function addZero(t) {
        if (t < 10)
            t = "0" + t;
        return t;
    };
    message.innerHTML = "<br><span class=\"msg-time\">" + h + ":" + m + ":" + s + "</span>  -  " + msg + message.innerHTML;
};

function clearMessages() {
    message.innerHTML = "";
    addMessage("Msgs cleared");
};

// Listen for enter
sendMessageBox.onkeypress = function (e) {
    var event = e || window.event;
    var char = event.which || event.keyCode;
    if (char == '13')
        sendButton.click();
};

// Send message
sendButton.onclick = function () {
    if (conn.open) {
        var msg = sendMessageBox.value;
        sendMessageBox.value = "";
        conn.send(msg);
        console.log("Sent: " + msg)
        addMessage("<span class=\"selfMsg\">Self: </span>" + msg);
    }
};

// Clear messages box
// clearMsgsButton.onclick = function () {
//     clearMessages();
// };


// Battle buttons
move0Button.onclick = function () {
    signal("Hit for 10");
};

move1Button.onclick = function () {
    signal("Heal for 10");
};

move2Button.onclick = function () {
    signal("Hit for 10");
};

move3Button.onclick = function () {
    signal("Heal for 10");
};

function ready() {
    conn.on('data', function (data) {
        console.log("Data recieved");
        switch (data) {
            default:
                addMessage("<span class=\"peerMsg\">Peer: </span>" + data);
                break;
        };
    });
    conn.on('close', function () {
        status.innerHTML = "Connection reset<br>Awaiting connection...";
        conn = null;
        start(true);
    });
}

function signal(sigName) {
    if (conn.open) {
        conn.send(sigName);
        console.log(sigName + " signal sent");
        addMessage(systemString + sigName);
    }
}

function recieve(friendCode) {

}

function send(friendCode) {

}

connectButton.addEventListener('click', join);
initialize();