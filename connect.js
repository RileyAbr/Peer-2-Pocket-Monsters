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
let playerMonsterChoice = document.getElementById("login-monster-choice");
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
    let i;

    for (i = 0; i< playerMonster.stats.length; i++) {
        playerStatsValueLabels[i].innerHTML = playerMonster.stats[i];
        opponentStatsValueLabels[i].innerHTML = opponentMonster.stats[i];
    }
}

function startBattle() {
    setUpBattle();
    //disableButtons(moveButtons);
}

function endBattle() {
    
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

        signal([0, [playerMonsterChoice.selectedIndex]]);

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
        
        signal([0, playerMonsterChoice.selectedIndex]);
        // setUpBattle();
    });

    // Sender Peer message parser
    conn.on('data', function (data) {
        switch (data[0]) {
            case 0: // Load Opponent Monster
                opponentMonster = JSON.parse(JSON.stringify(loadMonster(data[1])));
                playerMonster = JSON.parse(JSON.stringify(loadMonster([playerMonsterChoice.selectedIndex])));
                signal([8, "Start"]);
                break;
            case 1: // Chat
                addMessage("<span class=\"selfMsg\">Peer: </span>" + data[1]);
                break;
            case 2: // Attack
                attackType(data[1]);
                break;
            case 8:
                startBattle(data[1]);
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
        stat.innerHTML = "Connection closed";
    });
};

function addMessage(msg) {
    var now = new Date();
    var h = now.getHours();
    var m = addZero(now.getMinutes());
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
    newMessage.innerHTML = "<span class=\"msg-time\">" + h + ":" + m   + "</span>  -  " + msg;
    message.appendChild(newMessage);
    message.scrollTop = newMessage.offsetHeight + newMessage.offsetTop;
};

// function clearMessages() {
//     message.innerHTML = "";
//     addMessage("Msgs cleared");
// };

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
        var msg = [1, sendMessageBox.value];
        sendMessageBox.value = "";
        conn.send(msg);
        console.log("Sent: " + msg)
        addMessage("<span class=\"selfMsg\">You: </span>" + msg[1]);
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
            case 0: // Load Monsters
                opponentMonster = JSON.parse(JSON.stringify(loadMonster(data[1])));
                playerMonster = JSON.parse(JSON.stringify(loadMonster([playerMonsterChoice.selectedIndex])));
                signal([0, playerMonsterChoice.selectedIndex]);
                signal([8, "Start"]);
                break;
            case 1: // Chat
                addMessage("<span class=\"selfMsg\">Peer: </span>" + data[1]);
                break;
            case 2: // Attack
                attackType(data[1]);
                break;
            case 8:
                startBattle(data[1]);
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

function signal(data) {
    if (conn.open) {
        conn.send(data);
        console.log(data + " signal sent");
        // addMessage(systemString + sigName);
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
    var monsterMove = playerMonster.moves[move];
    var moveType = monsterMove.type;
    var damage = monsterMove["base-power"];
    var effect = monsterMove.effect;
    switch(moveType){
        //attack
        case 0:
            attackOpponent(damage);
            break;
        //status
        case 1:
            statusOpponent(effect.stat, effect.value)
            break;
        //attack,status
        case 2:
            attack_statusOpponent(damage, monsterMove["base-accuracy"], effect.status, effect.chance);
            break;
        //items
        case 3:
            var limit = monsterMove.limit;
            if(limit > 0){
                itemsOpponent(effect.heal);
                monsterMove.limit--;
            }
            break;
    }
    refreshStats();
}

//attack type move
function attackOpponent(damage){
    var attack = opponentMonster.stats[1]
    var defense = playerMonster.stats[2]
    var damageValue = (attack / defense * damage)
    playerMonster.stats[0] = playerMonster.stats[0] - damageValue;
}

//status type move
function statusOpponent(stat, value){
    var statIndex;
    switch(stat){
        case "AT":
            statIndex = 1;
            break;
        case "DF":
            statIndex = 2;
            break;
        case "AC":
            statIndex = 3;
            break;
        case "EV":
            statIndex = 4;
            break;
        case "SP":
            statIndex = 5;
            break;
        default:
            console.log("Stat name is invalid")
    }
    playerMonster.stats[statIndex] += parseInt(value);
}

//attack + status type move
function attack_statusOpponent(damage, accuracy, status, chance){
    //damage accuracy?
    let randAccuracy = Math.floor(Math.random() * 10);
    console.log(randAccuracy);
    if(randAccuracy < (accuracy/10)){
        playerMonster.stats[0] -= (opponentMonster.stats[1]/playerMonster.stats[2] * damage);
        let randChance = Math.floor(Math.random() * 10);
        if(randChance < (chance/10)){
            //if status = burn, dealls 10% of the target's health as damage each turn
            //if status = freeze, prevents the target from acting for 1 turn
        }
    }
}

//item type move
function itemsOpponent(heal){
    if(opponentMonster.stsats[0] <= 100){
        opponentMonster.stats[0] += heal;
    }
    if(opponentMonster.stats[0] > 100){
        opponentMonster.stats[0] = 100;
    }
}

// function opponentFaint(){
//     if(opponentMonster.stats[0] <= 0){
//         return true;
//         //message box shows message
//     }
// }

// Battle buttons
move0Button.onclick = function () {
    signal([2, 0]);
    refreshStats();
};
move1Button.onclick = function () {
    signal([2, 1]);
    refreshStats();
};
move2Button.onclick = function () {
    signal([2, 2]);
    refreshStats();
};
move3Button.onclick = function () {
    signal([2, 3]);
    refreshStats();
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