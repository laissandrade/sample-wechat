'use strict';

const DOMAIN = window.location.hostname;
const MESSAGES_ENDPOINT = 'http://data.'+ DOMAIN + '/messages';
const ELEMS = {
  conversation: document.querySelector('.conversation-container'),
  form: document.querySelector('.conversation-compose')
};


function main () {
  let user = initUser();

  initConversation(MESSAGES_ENDPOINT, user, ELEMS.conversation);
  listenToMessagesReceived(MESSAGES_ENDPOINT, user, ELEMS.conversation);
  listenToMessageSubmission(ELEMS.form, user, ELEMS.conversation);
}


/**
 * Initializes the user, either for the localstorage or by
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
  Launchpad.url(messagesEndpoint)
    .limit(100)
    .sort('id', 'asc')
    .get()
    .then((result) => {
      result
        .body()
        .forEach(appendMessage.bind(null, user, conversationElement));
    });
}


function listenToMessagesReceived (messagesEndpoint, user, conversationElement) {
  Launchpad.url(MESSAGES_ENDPOINT)
    .limit(1)
    .sort('id', 'desc')
    .watch()
    .on('changes', (result) => {
      let data = result.pop();
      let element = document.getElementById(data.id);

      if (element) {
        animateMessage(element);
      } else {
        appendMessage(user, conversationElement, data);
      }
    });
}


/**
 * Appends a message to the conversation element.
 */
function appendMessage(user, conversationElement, data) {
	var element = buildMessage(data, user);

	element.id = data.id;
	conversationElement.appendChild(element);
	conversationElement.scrollTop = conversationElement.scrollHeight;
}


function listenToMessageSubmission(form, user, conversationElement) {
  form.addEventListener('submit', (e) => {
    let {input} = e.target;

    if (input.value) {
      var data = {
        id: 'uuid' + Date.now(),
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
        .url(MESSAGES_ENDPOINT)
        .post(data);
    }

    input.value = '';
    conversationElement.scrollTop = conversationElement.scrollHeight;

    e.preventDefault();
  });
}


/**
 * Generates a message element from the data object
 */
function buildMessage(data, user) {
	const color = (data.author.id !== user.id) ? data.author.color : '';
	const sender = (data.author.id !== user.id) ? 'received' : 'sent';
	let element = document.createElement('div');

	element.classList.add('message', sender);
	element.innerHTML = '<span class="user ' + color + '">' + data.author.name + '</span>' +
		'<span class="text">' + data.content + '</span>' +
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
	var tick = message.querySelector('.tick');
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
