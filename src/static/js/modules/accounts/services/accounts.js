'use strict';
module.factory('AccountService', ['$http', 'URLS', function ($http, URLS) {
	return {
        login: function (model) {
            return $http.post(URLS.model('accounts').login, model);
        },
        register: function (model) {
            return $http.post(URLS.model('accounts').register, model);
        },
        me: function () {
            return $http.get(URLS.model('accounts').me);
        },
        logout: function () {
            return $http.post(URLS.model('accounts').logout);
        }
    };
}]);
