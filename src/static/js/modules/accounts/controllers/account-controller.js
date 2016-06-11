'use strict';
module.controller('AccountController', ['$scope', '$rootScope', '$cookies', 'AccountService', function ($scope, $rootScope, $cookies, AccountService) {

    $scope.init = function () {
       
    };

    $scope.logout = function () {
        AccountService.logout().then(function () {
            $cookies.remove('Authorization');
            window.location.href = '/';
        }).catch(function () {
            alert('ERROR');
        });
    };

    $scope.$on('USER_LOADED', $scope.init);
}]);
