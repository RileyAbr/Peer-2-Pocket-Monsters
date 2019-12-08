var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
var recvId = document.getElementById("receiver-id");
var recvIdInput = document.getElementById("receiver-id-input");
var connectButton = document.getElementById("connect-button");
var stat = document.getElementById("stat");

var message = document.getElementById("message");
var sendMessageBox = document.getElementById("sendMessageBox");
var sendButton = document.getElementById("sendButton");
var clearMsgsButton = document.getElementById("clearMsgsButton");

var hitButton = document.getElementById("hit");
var healButton = document.getElementById("heal");
// var hit = document.getElementById("hit");
// var heal = document.getElementById("heal");

var opponentHP = document.getElementById("opponentHP");
var playerHP = document.getElementById("playerHP");

var hpOpp = parseInt(document.getElementById("opponentHP").innerText);
var hpPlay = parseInt(document.getElementById("playerHP").innerText);


var cueString = "<span class=\"cueMsg\">Cue: </span>";

var monsterData = "../assets/monster-library.js"
var moveData = "../assets/moves-lookup.js"

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
clearMsgsButton.onclick = function () {
    clearMessages();
};

function ready() {
    conn.on('data', function (data) {
        console.log("Data recieved");
        switch (data) {
            case 'Hit for 10':
                hit();
                addMessage(cueString + data);
                break;
            case 'Heal for 10':
                heal();
                addMessage(cueString + data);
                break;
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

function hit() {
    playerHP.innerHTML = hpPlay - 10;
}

//use opponentHP because this will show on opponent's page
//add our own hp means add opponent's opponent's hp
function heal() {
    opponentHP.innerHTML = hpOpp + 10;
}

function signal(sigName) {
    if (conn.open) {
        conn.send(sigName);
        console.log(sigName + " signal sent");
        addMessage(cueString + sigName);
    }
}

hitButton.onclick = function () {
    opponentHP.innerHTML = hpOpp -10;
    signal("Hit for 10");
};
healButton.onclick = function () {
    playerHP.innerHTML = (hpPlay + 10);
    signal("Heal for 10");
};


function recieve(friendCode) {

}

function send(friendCode) {

}

connectButton.addEventListener('click', join);

initialize();