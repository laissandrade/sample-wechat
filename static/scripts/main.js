'use strict';

const DOMAIN = window.location.hostname.split(".").slice(-3).join(".");
const MESSAGES_DOMAIN = 'http://data.'+ DOMAIN;
const AUTH_DOMAIN = 'http://auth.'+ DOMAIN;
const BOT_DOMAIN = 'http://bot.'+ DOMAIN;

const ELEMS = {
	conversation: document.querySelector('.conversation-container'),
	form: document.querySelector('.conversation-compose'),
	chatStatus: document.querySelector('#chat-status'),
	chatLogin: document.querySelector('#chat-login'),
	phoneButton: document.querySelector('.actions.phone'),
	informationsMenu: document.querySelector('.actions.more'),
	botForm: document.querySelector('#bot-form'),
	userList: document.querySelector('.conversation-container'),
	informations: document.querySelector('.chat-informations')
};

function main () {

	if(ELEMS.form){
		initFakeUser();
		initConversation(MESSAGES_DOMAIN, ELEMS.conversation);
		listenToMessagesReceived(MESSAGES_DOMAIN, ELEMS.conversation);
		listenToMessageSubmission(MESSAGES_DOMAIN, ELEMS.form, ELEMS.conversation);
	}else if(ELEMS.botForm){
		submitForm(ELEMS);
	}

	if(ELEMS.informationsMenu){
		bindInformationsMenu(ELEMS);
	}else {
		listenToSocialsLogin('facebook', AUTH_DOMAIN);
		listenToSocialsLogin('google', AUTH_DOMAIN);
	}

	if(ELEMS.informations){
		initUserList(AUTH_DOMAIN, ELEMS.userList);
	}
}

function bindInformationsMenu(elems){
	let info = elems.informationsMenu;
	info.addEventListener('click', function(){
		info.classList.add('opened');
	});

	elems.conversation.addEventListener('click', function(e) {
		info.classList.remove('opened');
	})
}

function initUserList(authEndpoint, usersElement) {
  WeDeploy
  	.data(authEndpoint)
    .limit(100)
    .orderBy('name', 'asc')
    .get("users")
    .then((result) => {
      result.forEach(appendUser.bind(null, usersElement));
    });
}

function listenToSocialsLogin(provider, authEndpoint){
	document.querySelector('.'+provider+'-btn').addEventListener('click', function(){
		let auth = WeDeploy.auth(authEndpoint),
			authProvider;

		if(provider == 'facebook'){
			authProvider = new auth.provider.Facebook();
		}else {
			authProvider = new auth.provider.Google();
		}

		authProvider.setProviderScope('email');
		authProvider.setRedirectUri('http://'+DOMAIN+"/chat.html")

		auth.signInWithRedirect(authProvider);
	});


}

function submitForm(elems){
	var form = elems.botForm,
		command,
		webhook;

	form.querySelector('.submit').addEventListener('click', (e) => {
		command = form.querySelector('#bot-command').value;
		webhook = form.querySelector('#bot-webhook').value;

		if (command && webhook) {
			let data = { command, webhook};

			WeDeploy
			.url(BOT_DOMAIN)
			.path("commands")
			.post(data)
			.then((resp) => {

			if(resp.succeeded()){
				location.href = '/chat.html';
			}else {
				alert('Command already exists.');
			}
		});
		}

		e.preventDefault();
	});
}

/**
 * Initializes the user, either from localstorage or by
 * creating it and then storing it on localstorage.
 */
function initFakeUser () {
	let user;

	WeDeploy.auth(AUTH_DOMAIN).onSignIn(function(user){
		user = {
			"id": user.id,
			"name": user.name,
			"color": 'color-' + Math.floor(Math.random() * 19)
		}

		localStorage.setItem('myUser', JSON.stringify(user));
	})

	if (localStorage.myUser) {
		return JSON.parse(localStorage.myUser);
	}

	user = {
		"id": faker.random.uuid(),
		"name": faker.name.firstName(),
		"color": 'color-' + Math.floor(Math.random() * 19)
	};

  localStorage.setItem('myUser', JSON.stringify(user));

  return user;
}


/**
 * Initializes the conversation element
 */
function initConversation (messagesEndpoint, conversationElement) {
  const BOT_USER = {
    "id": 'TheBot',
    "name": 'TheBot',
    "color": 'color-1'
  };

  WeDeploy.data(messagesEndpoint)
    .limit(100)
    .orderBy('id', 'desc')
    .get("messages")
    .then((result) => {
	  let user = JSON.parse(localStorage.myUser);

      ELEMS.chatStatus.innerHTML = 'online';

      result
        .reverse()
        .forEach(appendMessage.bind(null, user, conversationElement));

      appendMessage(user, conversationElement, {
        content: [ 
          "Hey! I'm a TheBot.", 
          "Type `TheBot: command` to use my API.", 
          "Use `help` command to start :D " 
        ].join('<br />'),
        time: 'whatever', 
        author: BOT_USER
      }); 
    });
}


function listenToMessagesReceived (messagesEndpoint, conversationElement) {
  WeDeploy.data(messagesEndpoint)
    .limit(1)
    .orderBy('id', 'desc')
    .watch("messages")
    .on('changes', (result) => {
	  let user = JSON.parse(localStorage.myUser);
      let data = result.pop();

      if (data.domID) {
        let element = document.getElementById(data.domID);

        if (element) {
          return animateMessage(element);
        } 
      }

      appendMessage(user, conversationElement, data);
    });
}


function listenToMessageSubmission(messagesEndpoint, form, conversationElement) {
  form.addEventListener('submit', (e) => {
    let {input} = e.target;
	let user = JSON.parse(localStorage.myUser);
	let data;

    if (input.value) {
		data = {
			domID: faker.random.uuid(),
			author: {
			  id: user.id,
			  name: user.name,
			  color: user.color
			},
			content: input.value,
			time: moment().format('h:mm A')
		  };

      appendMessage(user, conversationElement, data);

      WeDeploy
        .url(messagesEndpoint)
        .path("messages")
        .post(data);
    }

    input.value = '';
    conversationElement.scrollTop = conversationElement.scrollHeight;

    e.preventDefault();
  });
}


/**
 * Appends a message to the conversation element.
 */
function appendMessage(myUser, conversationElement, data) {
	let element = buildMessage(data, myUser);

	element.id = data.domID;
	conversationElement.appendChild(element);
	conversationElement.scrollTop = conversationElement.scrollHeight;
}

function appendUser(userElement, user) {
	let element = document.createElement('figure');
	
	element.classList.add('informations--participants', 'mg-bottom-md');
	element.innerHTML = '<div><img src="' + user.photoUrl + '" alt=""></div>' +
		'<figcaption class="informations--participants-legend">' +
			'<p class="name">' + user.name + '</p>' +
			'<p class="smoth">' + user.email + '</p>' +
		'</figcaption>';

	userElement.appendChild(element);
}


/**
 * Generates a message element from the data object
 */
function buildMessage(data, myUser) {
	const color = (data.author.id !== myUser.id) ? data.author.color : '';
	const sender = (data.author.id !== myUser.id) ? 'received' : 'sent';
  const content = data.content.replace(/(?:\r\n|\r|\n)/g, '<br />');

	let element = document.createElement('div');

	element.classList.add('message', sender);
	element.innerHTML = '<span class="user ' + color + '">' + data.author.name + '</span>' +
		'<span class="text">' + content + '</span>' +
		'<span class="metadata">' +
			'<span class="time">' + data.time + '</span>' +
			'<span class="tick tick-animation">' +
				'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck" x="2047" y="2061"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#92a58c"/></svg>' +
				'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg>' +
			'</span>' +
		'</span>';

	return element;
}


function animateMessage(message) {
	let tick = message.querySelector('.tick');
	tick.classList.remove('tick-animation');
}


/**
 * Starts the ticking of the device time,
 * setting the updated time in the screen.
 */
function startDeviceTime () {
  let deviceTime = document.querySelector('.status-bar .time');

  deviceTime.innerHTML = moment().format('h:mm');
  setInterval(() => {
    deviceTime.innerHTML = moment().format('h:mm');
  }, 1000);
}

main();
