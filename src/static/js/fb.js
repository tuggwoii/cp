function statusChangeCallback(response) {

	console.log(response);

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

function API(ac) {
	var creds = { fb_token: ac.authResponse.accessToken }
	FB.api('/me?fields=name,email', function (response) {
		var creds = response;
		creds.fb_token: ac.authResponse.accessToken }
		$.post('/api/v1/accounts/login', creds)
		.success(function(res){
			console.log(res);
		}).error(function(res){
			console.log(res);
		});
	});
}

window.fbAsyncInit = function() {
    FB.init({
      appId      : '1755533787992799',
      xfbml      : true,
      version    : 'v2.6'
    });
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));