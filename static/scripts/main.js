'use strict';

const DOMAIN = window.location.hostname.split(".").slice(-3).join(".");
const MESSAGES_ENDPOINT = 'http://data.'+ DOMAIN + '/messages';
const FAVORITES_ENDPOINT = 'http://favorites.'+ DOMAIN + '/messages';

const ELEMS = {
  conversation: document.querySelector('.conversation-container'),
  form: document.querySelector('.conversation-compose'),
  chatStatus: document.querySelector('#chat-status'),
  chatLogin: document.querySelector('#chat-login')
};


function main () {
  let user = initUser();

  initLogin(ELEMS.chatLogin);
  initConversation(MESSAGES_ENDPOINT, user, ELEMS.conversation);
  listenToMessagesReceived(MESSAGES_ENDPOINT, user, ELEMS.conversation);
  listenToMessageSubmission(MESSAGES_ENDPOINT, ELEMS.form, user, ELEMS.conversation);
}


function initLogin (loginElement) {
  loginElement.addEventListener('click', e => {
    let auth = new WeDeploy.AuthApiHelper('http://auth.dashboard.wedeploy.me');
		let githubProvider = new WeDeploy.GithubAuthProvider();
		let googleProvider = new WeDeploy.GoogleAuthProvider();

		googleProvider.setProviderScope('profile');

		auth.onSignIn((token) => {
			console.log('Sign-in', token);
    });
  });
}


/**
 * Initializes the user, either from localstorage or by
 * creating it and then storing it on localstorage.
 */
function initUser () {
  if (localStorage.myUser) {
    return JSON.parse(localStorage.myUser);
  }

  let user = {
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
function initConversation (messagesEndpoint, user, conversationElement) {
  const BOT_USER = {
    "id": 'TheBot',
    "name": 'TheBot',
    "color": 'color-1'
  };

  Launchpad.url(messagesEndpoint)
    .limit(100)
    .sort('id', 'desc')
    .get()
    .then((result) => {

      ELEMS.chatStatus.innerHTML = 'online';

      result
        .body()
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


function listenToMessagesReceived (messagesEndpoint, user, conversationElement) {
  Launchpad.url(messagesEndpoint)
    .limit(1)
    .sort('id', 'desc')
    .watch()
    .on('changes', (result) => {
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


function listenToMessageSubmission(messagesEndpoint, form, user, conversationElement) {
  form.addEventListener('submit', (e) => {
    let {input} = e.target;

    if (input.value) {
      let data = {
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

      Launchpad
        .url(messagesEndpoint)
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
  element.addEventListener('click', (e) => {
    let {id} = e.target.parentElement;

    Launchpad
      .url(FAVORITES_ENDPOINT)
      .path("favorites")
      .post({ messageId: id })
      .then(() => {
        console.log("Success!", arguments); 
      }).catch(() => {
        console.log("Error!", arguments); 
      });
  });
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
