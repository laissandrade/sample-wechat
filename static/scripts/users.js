'use strict';

const AUTH_DOMAIN = 'http://auth.'+ DOMAIN;

const ELEMS = {
	phoneButton: document.querySelector('.actions.phone'),
	informationsMenu: document.querySelector('.actions.more'),
	userList: document.querySelector('.conversation-container'),
	informations: document.querySelector('.chat-informations')
};

function main () {
	bindInformationsMenu(ELEMS);
	initUserList(AUTH_DOMAIN, ELEMS.userList);
}

function bindInformationsMenu(elems){
	let info = elems.informationsMenu;
	info.addEventListener('click', function(){
		info.classList.add('opened');
	});
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

main();
