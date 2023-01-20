const sideMenuContainer = document.querySelector('.sidebar-background');
const sidebarMenuContent = document.querySelector('.sidebar');
const chat = document.querySelector('.chat')
const loginPage = document.querySelector('.loginPage');
let user = '';
const userName = { name: user };
const msgInput = document.querySelector('.footer input');
let logedUsersArea = document.querySelector('.loggedUsers');
let selectedReceiverUser = 'Todos';
let msgType = 'message';
let privacityArea = document.querySelector('.footer p');
privacityArea.innerHTML = `Enviando para ${selectedReceiverUser} (Público)`;

//armazenamentos de nome do usuário para usos futuros;
const usernameNotificationInput = document.querySelector('.notification .from');
const usernameMessageFromInput = document.querySelector('.message .from');
const usernameMessageToInput = document.querySelector('.message .to');
const usernamePrivateMessageFromInput = document.querySelector('.privateMessage .from');
const usernamePrivateMessageToInput = document.querySelector('.privateMessage .to');


function loginVerification() {

    user = loginPage.querySelector('input').value;
    userName.name = user;
    const promiseName = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);
    promiseName.then(successfully);
    promiseName.catch(failed);

    setInterval(() => {
        keepConeted()
    }, 5000);

    loginPage.innerHTML = `<img src="./assets/Quarter-Circle-Loading-Image-1.gif" alt="">`;
}

function failed(notGreat) {
    const statusError = notGreat.response.status;
    if (statusError === 400) {
        alert('nome de usuário em uso')
    } else {
        alert('erro de conexão')
    }
    window.location.reload();
}

let successfully = function (successfull) {
    const status = successfull.status;

    if (status === 200) {
        user = JSON.parse(successfull.config.data).name;
        getMessages();
        setInterval(function () {
            getMessages();
        }, 3000);
    }
    getParticipants();
    setInterval(function () {
        getParticipants();
    }, 10 * 1000);

    loginPage.classList.add('hiddenLoggin')
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

        if (type === 'status' || type === 'message') {
            acc += `<p data-test="message" class="${type}"><span class="clock">(${time})</span> <span class="from">${from}</span> para <span class="to">${to}</span>: ${text}</p>`
        }
        if (type === 'private_message' && (user === from || user === to)) {
            acc += `<p data-test="message" class="${type}"><span class="clock">(${time})</span> <span class="from">${from}</span> reservadamente para <span class="to">${to}</span>: ${text}</p>`
        }
    })

    return acc;
}

function chatRender(logChat) {
    chat.innerHTML = logChat;
    chat.querySelector('p:last-child').scrollIntoView();
}

function keepConeted() {
    const promiseKeep = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
}

function userDontKeeped(disconected) {
    window.location.reload();
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

    promiseSendMsg.then(getMessages)
    msgInput.value = '';

    axios
        .post('https://mock-api.driven.com.br/api/v6/uol/status', userName)
        .catch(userDontKeeped);
}

function getParticipants() {
    const participants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

    participants
        .then(participantsInfo)
}

function participantsInfo(participantsObj) {
    logedUsersArea.innerHTML = `<li data-test="all" onclick='selectUser(this)'><ion-icon name="people"></ion-icon>Todos<ion-icon data-test="check" class="checkmark" name="checkmark-sharp"></ion-icon></li>`;
    const loggedUser = participantsObj.data;
    for (let i = 0; i < loggedUser.length; i++) {
        logedUsersArea.innerHTML += `<li data-test="participant" data-identifier="participant" onclick='selectUser(this)'> <ion-icon name="person-circle"></ion-icon> ${loggedUser[i].name} <ion-icon data-test="check" class="checkmark" name="checkmark-sharp"></ion-icon></li>`
    }

}

function selectUser(user) {


    let userArea = document.querySelector('.loggedUsers')
    let selectedUser = userArea.querySelector('.checkmark.showCheckmark');
    if (selectedUser !== null) {
        selectedUser.classList.remove('showCheckmark')
    }
    user.querySelector('.checkmark').classList.add('showCheckmark')
    selectedReceiverUser = user.innerText;

    templateChanger(msgType, selectedReceiverUser)
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
    templateChanger(msgType, selectedReceiverUser);
}
function templateChanger(msgType, selectedReceiverUser) {
    if (msgType === 'message') {
        privacityArea.innerHTML = `Enviando para ${selectedReceiverUser} (Público)`;
    } else if (msgType === 'private_message') {
        privacityArea.innerHTML = `Enviando para ${selectedReceiverUser} (Reservadamente)`;
    }
}
loginPage.querySelector('button').addEventListener('click', (e) => {
    let inputLogin = loginPage.querySelector('input');
    if (!inputLogin.value) return;
    loginVerification();
    e.preventDefault();
})
msgInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        sendMsg();
    }
})