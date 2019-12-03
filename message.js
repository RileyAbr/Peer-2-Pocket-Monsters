//send
function signal(sigName) {
    if (conn.open) {
        conn.send(sigName);
        console.log(sigName + " signal sent");
        addMessage(cueString + sigName);
    }
}
goButton.onclick = function () {
    signal("Go");
};
resetButton.onclick = function () {
    signal("Reset");
};
fadeButton.onclick = function () {
    signal("Fade");
};
offButton.onclick = function () {
    signal("Off");
};

//recieve
function ready() {
    conn.on('data', function (data) {
        console.log("Data recieved");
        var cueString = "<span class=\"cueMsg\">Cue: </span>";
        switch (data) {
            case 'Go':
                go();
                addMessage(cueString + data);
                break;
            case 'Fade':
                fade();
                addMessage(cueString + data);
                break;
            case 'Off':
                off();
                addMessage(cueString + data);
                break;
            case 'Reset':
                reset();
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
function go() {
    standbyBox.className = "display-box hidden";
    goBox.className = "display-box go";
    fadeBox.className = "display-box hidden";
    offBox.className = "display-box hidden";
    return;
};
function fade() {
    standbyBox.className = "display-box hidden";
    goBox.className = "display-box hidden";
    fadeBox.className = "display-box fade";
    offBox.className = "display-box hidden";
    return;
};
function off() {
    standbyBox.className = "display-box hidden";
    goBox.className = "display-box hidden";
    fadeBox.className = "display-box hidden";
    offBox.className = "display-box off";
    return;
}
function reset() {
    standbyBox.className = "display-box standby";
    goBox.className = "display-box hidden";
    fadeBox.className = "display-box hidden";
    offBox.className = "display-box hidden";
    return;
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
}
function clearMessages() {
    message.innerHTML = "";
    addMessage("Msgs cleared");
}
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
initialize();