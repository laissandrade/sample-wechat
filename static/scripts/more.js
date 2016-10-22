'use strict';

const AUTH_DOMAIN = 'http://auth.'+ DOMAIN;
const BOT_DOMAIN = 'http://bot.'+ DOMAIN;

const ELEMS = {
	botForm: document.querySelector('#bot-form')
};

function main () {
	submitForm(ELEMS);
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

main();
