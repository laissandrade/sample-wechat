'use strict';

const DOMAIN = window.location.hostname.split(".").slice(-3).join(".");

function main () {
	bindInformationsMenu();
}

function bindInformationsMenu(){
	let info = document.querySelector('.actions.more');
	info.addEventListener('click', function(){
		info.classList.add('opened');
	});
}

main();
