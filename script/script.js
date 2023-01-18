const sideMenuContainer = document.querySelector('.sidebar-background');
const sidebarMenuContent = document.querySelector('.sidebar');
const chat = document.querySelector('.chat')
let user = prompt('Seu nome:');
const userName = {
    name: user
};
const msgInput = document.querySelector('.footer input');



//armazenamentos de nome do usuário para usos futuros;
const usernameNotificationInput = document.querySelector('.notification .from');
const usernameMessageFromInput = document.querySelector('.message .from');
const usernameMessageToInput = document.querySelector('.message .to');
const usernamePrivateMessageFromInput = document.querySelector('.privateMessage .from');
const usernamePrivateMessageToInput = document.querySelector('.privateMessage .to');

const selectVisibility = function (visibility) {
    return visibility.innerHTML
}

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
        .catch(userDontKeeeped)
}

function userkeepConected(conected) {
}

function userDontKeeeped(disconected) {

}


function failed(notGreat) {
    alert('ce ta on')
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
        acc += `<p class="${type}">(${time}) <span>${from}</span> para <span>${to}</span>: ${text}</p>`
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
        to: 'Todos',
        text: msgInput.value,
        type: 'message'
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



// `<p class="${type}">(${time}) <span>${from}</span> para <span>${to}</span>: ${text}</p>`
