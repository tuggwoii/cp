function statusChangeCallback(response) {
	if (response.status === 'connected') {
		API(response);
	} else {
		
	}
}

function checkLoginState() {
	FB.getLoginStatus(function (response) {
		statusChangeCallback(response);
	});
}

function API(fb_creds) {
	FB.api('/me?fields=name,email', function (response) {
		var creds = response;
		creds.fb_token = fb_creds.authResponse.accessToken;
		angular.element(document.getElementById('loginForm')).scope().facebookLogin(creds);
	});
}
