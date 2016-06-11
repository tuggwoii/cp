'use strict';
module.factory('AccountService', ['$http', '$q', 'URLS', function ($http, $q, URLS) {
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
            return $q(function (resolve, reject) {
                FB.logout(function (response) {
                    $http.post(URLS.model('accounts').logout).success(resolve).error(reject);
                });
            });
        }
    };
}]);
