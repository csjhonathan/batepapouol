const sideMenuContainer = document.querySelector('.sidebar-background');
const sidebarMenuContent = document.querySelector('.sidebar');
const chat = document.querySelector('.chat')
let user = prompt('Seu nome:');
const userName = {
    name: user
};
const msgInput = document.querySelector('.footer input');
let logedUsersArea = document.querySelector('.loggedUsers');
let selectedReceiverUser = 'Todos';
let msgType = 'message';


//armazenamentos de nome do usuário para usos futuros;
const usernameNotificationInput = document.querySelector('.notification .from');
const usernameMessageFromInput = document.querySelector('.message .from');
const usernameMessageToInput = document.querySelector('.message .to');
const usernamePrivateMessageFromInput = document.querySelector('.privateMessage .from');
const usernamePrivateMessageToInput = document.querySelector('.privateMessage .to');


let succesfully = function (succesfull) {
    const status = succesfull.status;

    if (status === 200) {
        user = JSON.parse(succesfull.config.data).name;
        getMessages();
        setInterval(function () {
            getMessages();
        }, 3000);
        //disconected();
    }
    getParticipants();
    setInterval(function () {
        getParticipants();
    }, 10 * 1000);
}

loginVerification();
function loginVerification() {
    const promiseName = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);
    promiseName.then(succesfully);
    promiseName.catch(failed);

    setInterval(() => {
        keepConeted()
    }, 5000);
}

function keepConeted() {
    const promiseKeep = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);

    promiseKeep
        .then(userkeepConected)
        .catch(userDontKeeped)
}

function userkeepConected(conected) {

}

function userDontKeeped(disconected) {
    alert('você foi desconectado')
    window.location.reload();
}


function failed(notGreat) {
    alert('usuário conectado/outro erro')
    window.location.reload();
}

function getMessages() {
    const promiseLogMsg = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')

    promiseLogMsg
        .then((logData) => logData.data)
        .then(msgConstructor)
        .then(chatRender);

}

function msgConstructor(log) {
    let acc = '';
    log.forEach(({ type, time, from, to, text }) => {

        if (type === 'status') {
            acc += `<p class="${type}">(${time}) <span class="from">${from}</span> para <span class="to">${to}</span>: ${text}</p>`
        }
        if (type === 'message') {
            acc += `<p class="${type}">(${time}) <span class="from">${from}</span> para <span class="to">${to}</span>: ${text}</p>`
        }
        if (type === 'private_message' && (user === from || user === to)) {
            acc += `<p class="${type}">(${time}) <span class="from">${from}</span> para <span class="to">${to}</span>: ${text}</p>`
        }
        // acc += `<p class="${type}">(${time}) <span class="from">${from}</span> para <span class="to">${to}</span>: ${text}</p>`
    })

    return acc;
}

function chatRender(logChat) {
    chat.innerHTML = logChat;
    chat.querySelector('p:last-child').scrollIntoView();
}

function sideMenu() {
    sideMenuContainer.classList.toggle('hidden');
    sidebarMenuContent.classList.toggle('hidden');
}

function sendMsg() {
    const msg = {
        from: user,
        to: selectedReceiverUser,
        text: msgInput.value,
        type: msgType
    }
    const promiseSendMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);

    promiseSendMsg.then(msgConstructor)
    msgInput.value = '';
}

msgInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        sendMsg();
    }
})


function getParticipants() {
    const participants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

    participants
        .then(participantsInfo)
        .catch(participantsFail)
}

function participantsInfo(participantsObj) {
    logedUsersArea.innerHTML = `<li onclick='selectUser(this)'><ion-icon name="people"></ion-icon>Todos<ion-icon class="checkmark" name="checkmark-sharp"></ion-icon></li>`;
    const loggedUser = participantsObj.data;
    for (let i = 0; i < loggedUser.length; i++) {
        logedUsersArea.innerHTML += `<li onclick='selectUser(this)'> <ion-icon name="person-circle"></ion-icon> ${loggedUser[i].name} <ion-icon class="checkmark" name="checkmark-sharp"></ion-icon></li>`
    }

}

function participantsFail(participantsFailObj) {
}

function selectUser(user) {
    let userArea = document.querySelector('.loggedUsers')
    let selectedUser = userArea.querySelector('.checkmark.showCheckmark');
    if (selectedUser !== null) {
        selectedUser.classList.remove('showCheckmark')
    }
    user.querySelector('.checkmark').classList.add('showCheckmark')
    selectedReceiverUser = user.innerText;
}

function selectVisibility(visibility) {
    let visibilityArea = document.querySelector('.visibility');
    let selectedVisibility = visibilityArea.querySelector('.checkmark.showCheckmark');

    if (visibility.innerText === 'Público') {
        msgType = 'message';
    } else if (visibility.innerText === 'Reservadamente') {
        msgType = 'private_message';
    }

    if (selectedVisibility !== null) {
        selectedVisibility.classList.remove('showCheckmark');
    }
    visibility.querySelector('.checkmark').classList.add('showCheckmark');
}
