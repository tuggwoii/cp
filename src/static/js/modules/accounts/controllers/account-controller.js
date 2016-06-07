'use strict';
module.controller('AccountController', ['$scope', '$rootScope', '$cookies', 'AccountService', function ($scope, $rootScope, $cookies, AccountService) {

    $scope.init = function () {
       
    };

    $scope.logout = function () {
        AccountService.logout().success(function () {
            $cookies.remove('Authorization');
            window.location.href = '/';
        });
    };

    $scope.$on('USER_LOADED', $scope.init);
}]);
