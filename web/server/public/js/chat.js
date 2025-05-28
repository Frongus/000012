const dataDiv = document.getElementById('chat');
const input = document.getElementById('mainInput');

function createMessage(user, messageStr) {
    var div = document.createElement('div');
    if(user != true) {
        div.className = "messageHolderBot"
    } else {
        div.className = "messageHolderUser"
    }
    var message = document.createElement('p');
    if(user != true) {
        message.className = "chatBotText"
    } else {
        message.className = "userText"
    }

    var str = messageStr.toString();

    message.appendChild(document.createTextNode(messageStr));
    div.appendChild(message);

    dataDiv.appendChild(div);
}

function processInput() {
    createMessage(true, input.value);
    input.value = "";
}