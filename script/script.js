const sideMenuContainer = document.querySelector('.sidebar-background');
const sidebarMenuContent = document.querySelector('.sidebar');
const chat = document.querySelector('.chat')
const userName = 'Jhonathan'//prompt('Seu nome:');
const msgInput = document.querySelector('.footer input')

//armazenamentos de nome do usuário para usos futuros;
const usernameNotificationInput = document.querySelector('.notification .from');
const usernameMessageFromInput = document.querySelector('.message .from');
const usernameMessageToInput = document.querySelector('.message .to');
const usernamePrivateMessageFromInput = document.querySelector('.privateMessage .from');
const usernamePrivateMessageToInput = document.querySelector('.privateMessage .to');

function sideMenu() {
    sideMenuContainer.classList.toggle('hidden');
    sidebarMenuContent.classList.toggle('hidden');
}

function sendMsg(){

    chat.innerHTML+= `<p class="message"><span class="from">${userName}</span> para <span class="to">Todos</span>: ${msgInput.value} </p>`
    msgInput.value = '';
}