'use strict';

const DOMAIN = window.location.hostname.split(".").slice(-3).join(".");
const AUTH_DOMAIN = 'http://auth.'+ DOMAIN;

const ELEMS = {
	chatLogin: document.querySelector('#chat-login'),
};

function main () {
	listenToSocialsLogin('facebook', AUTH_DOMAIN);
	listenToSocialsLogin('google', AUTH_DOMAIN);
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

main();
