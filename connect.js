/*
 
 #### ##     ## ########   #######  ########  ########  ######  
  ##  ###   ### ##     ## ##     ## ##     ##    ##    ##    ## 
  ##  #### #### ##     ## ##     ## ##     ##    ##    ##       
  ##  ## ### ## ########  ##     ## ########     ##     ######  
  ##  ##     ## ##        ##     ## ##   ##      ##          ## 
  ##  ##     ## ##        ##     ## ##    ##     ##    ##    ## 
 #### ##     ## ##         #######  ##     ##    ##     ######  
 
*/
import { monsterLibraryDB } from "./assets/monster-library.js";

/*
 
 ##     ##    ###    ########  ####    ###    ########  ##       ########  ######  
 ##     ##   ## ##   ##     ##  ##    ## ##   ##     ## ##       ##       ##    ## 
 ##     ##  ##   ##  ##     ##  ##   ##   ##  ##     ## ##       ##       ##       
 ##     ## ##     ## ########   ##  ##     ## ########  ##       ######    ######  
  ##   ##  ######### ##   ##    ##  ######### ##     ## ##       ##             ## 
   ## ##   ##     ## ##    ##   ##  ##     ## ##     ## ##       ##       ##    ## 
    ###    ##     ## ##     ## #### ##     ## ########  ######## ########  ######  
 
*/
// PeerJS Variables
var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
// var recvId = document.getElementById("room-id-key");
var recvId = document.getElementById("room-key");
var recvIdInput = document.getElementById("receiver-id-input");
var connectButton = document.getElementById("login-menu-submit");
var roomId = document.getElementById("room-id-key-ingame");
var stat = document.getElementById("stat");

// Message variables
var message = document.getElementById("chat-messages");
var sendMessageBox = document.getElementById("chat-send-message-input");
var sendButton = document.getElementById("chat-send-message-button");
let loginModal = document.getElementById("login-menu");
// var clearMsgsButton = document.getElementById("clearMsgsButton"); Does not currently exist

// Battle system variables
let monsterLibrary;
let playerMonster;
let opponentMonster;
let playerStatsValueLabels = document.getElementsByClassName("stats-value-player");
let opponentStatsValueLabels = document.getElementsByClassName("stats-value-opponent");
let playerMonsterSprite = document.getElementById("battle-monster-sprite-player");
let opponentMonsterSprite = document.getElementById("battle-monster-sprite-opponent");
let monsterSpriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
var moveButtons = document.getElementsByClassName("battle-controller-button");
var move0Button = document.getElementById("battle-move-0");
var move1Button = document.getElementById("battle-move-1");
var move2Button = document.getElementById("battle-move-2");
var move3Button = document.getElementById("battle-move-3");

// System variables
var systemString = "<span class=\"cueMsg\">System: </span>";


/*
 
 ##     ## ######## ##       ########  ######## ########   ######  
 ##     ## ##       ##       ##     ## ##       ##     ## ##    ## 
 ##     ## ##       ##       ##     ## ##       ##     ## ##       
 ######### ######   ##       ########  ######   ########   ######  
 ##     ## ##       ##       ##        ##       ##   ##         ## 
 ##     ## ##       ##       ##        ##       ##    ##  ##    ## 
 ##     ## ######## ######## ##        ######## ##     ##  ######  
 
*/
// Fades out the modal for loggining in
function fadeModal(modal) {
    loginModal.style.display = "none";
}

// Loads all monsters for play
function loadMonsterLibrary() {
    monsterLibrary = monsterLibraryDB;
    let monsterChoiceDropdown = document.getElementById("login-monster-choice");

    let monster;
    for (monster of monsterLibrary) {
        let monsterOption = document.createElement("option");
        monsterOption.text = monster.name;
        monsterChoiceDropdown.add(monsterOption);
    }
}

// Runs when the players connect to inititally set up the game
function setUpBattle() {
    // Load player monster data
    let playerMonsterChoice = document.getElementById("login-monster-choice");
    playerMonster = loadMonster([playerMonsterChoice.selectedIndex]);
    opponentMonster = loadMonster(0);

    //  Load Sprites
    playerMonsterSprite.src = monsterSpriteURL + "back/" + playerMonster.id + ".png";
    opponentMonsterSprite.src = monsterSpriteURL + opponentMonster.id + ".png";

    // Load stats for the first time
    refreshStats();

    // Fade out login modal
    loginModal.style.opacity = 0;
    let fadeTimer = 1650; // Controls when the login modal fades out
    //Wait two seconds before removing modal for animation to finish
    setTimeout(fadeModal, fadeTimer);
}

// Loads the monster 
function loadMonster(monsterChoice) {
    return monsterLibrary[monsterChoice];
}

// Refreshes the stats on the webpage to match the data structures
function refreshStats() {
    let stat;

    for (stat in playerMonster.stats) {
        playerStatsValueLabels[stat].innerHTML = playerMonster.stats[stat];
        opponentStatsValueLabels[stat].innerHTML = opponentMonster.stats[stat];
    }
}

// Disables buttons when it is not the players turn
function disableButtons(buttons) {
    let button;
    for (button of buttons) {
        button.disabled = true;
    }
}


/*
..######...#######..##....##.##....##.########..######..########
.##....##.##.....##.###...##.###...##.##.......##....##....##...
.##.......##.....##.####..##.####..##.##.......##..........##...
.##.......##.....##.##.##.##.##.##.##.######...##..........##...
.##.......##.....##.##..####.##..####.##.......##..........##...
.##....##.##.....##.##...###.##...###.##.......##....##....##...
..######...#######..##....##.##....##.########..######.....##...
*/
function initialize() {
    // Connect to monster data
    loadMonsterLibrary();

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
        roomId.innerHTML = peer.id;
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

        setUpBattle();

        disableButtons(moveButtons);
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
    conn = peer.connect(recvIdInput.value, { reliable: true });

    conn.on('open', function () {
        stat.innerHTML = "Connected to: " + conn.peer;
        console.log("Connected to: " + conn.peer);

        setUpBattle();

        // Check URL params for comamnds that should be sent immediately
        var command = getUrlParam("command");
        if (command)
            conn.send(command);

    });

    // // Handle incoming data (messages only since this is the signal sender)
    conn.on('data', function (data) {
        if (data[0] == 9) {
            addMessage("<span class=\"peerMsg\">Peer:</span> " + data);
        }
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
    let newMessage = document.createElement('DIV');
    newMessage.className = "chat-send-messages"
    newMessage.innerHTML = "<span class=\"msg-time\">" + h + ":" + m + ":" + s + "</span>  -  " + msg;
    message.appendChild(newMessage);
    message.scrollTop = newMessage.offsetHeight + newMessage.offsetTop;
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
        var msg = [9, sendMessageBox.value];
        sendMessageBox.value = "";
        conn.send(msg);
        console.log("Sent: " + msg)
        addMessage("<span class=\"selfMsg\">You: </span>" + msg);
    }
};

// Clear messages box
// clearMsgsButton.onclick = function () {
//     clearMessages();
// };

function ready() {
    conn.on('data', function (data) {
        console.log("Data recieved");
        switch (data[0]) {
            case 0: // Start battle
                startBattle(data[1]);
                break;
            case 1: // Chat
                addMessage(data[1]);
                break;
            case 2: // Attack
                attackType(data[1]);
                break;
            case 9: //End Game
                endBattle(data[1]);
                break;
            default:
                console.log("Message is invalid");
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

/*
.########.....###....########.########.##.......########
.##.....##...##.##......##.......##....##.......##......
.##.....##..##...##.....##.......##....##.......##......
.########..##.....##....##.......##....##.......######..
.##.....##.#########....##.......##....##.......##......
.##.....##.##....   .##....##.......##....##.......##......
.########..##.....##....##.......##....########.########
*/
//determine what types of move is chose
function attackType(move){
    monsterMove = playerMonster.moves[move];
    moveType = monsterMove.type;
    switch(moveType){
        //attack
        case 0:
            attack(monsterMove.base-power);
            refreshStats();
            break;
        //status
        case 1:
            status();
            break;
        //attack,status
        case 2:
            attack_status();
            break;
        //items
        case 3:
            var limit = monster-library[monster][moves][move][limit];
            if(limit > 0){
                items();
                limit--;
            }
            break;
    }
}

//attack type move
function attack(damage){
    opponentMonster.stats[0] = opponentMonster.stats[0]- (playerMonster.stat[1]/opponentMonster.stat[2] * damage);
}

// Battle buttons
move0Button.onclick = function () {
    signal([2, 0]);
};

move1Button.onclick = function () {
    signal([2, 1]);
};

move2Button.onclick = function () {
    signal([2, 2]);
};

move3Button.onclick = function () {
    signal([2, 3]);
};


/*
 
  ######  ########    ###    ########  ######## 
 ##    ##    ##      ## ##   ##     ##    ##    
 ##          ##     ##   ##  ##     ##    ##    
  ######     ##    ##     ## ########     ##    
       ##    ##    ######### ##   ##      ##    
 ##    ##    ##    ##     ## ##    ##     ##    
  ######     ##    ##     ## ##     ##    ##    
 
*/
connectButton.addEventListener('click', join);
initialize();