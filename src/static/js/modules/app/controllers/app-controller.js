'use strict';
module.controller('AppController', ['$scope', '$rootScope', '$timeout', '$cookies', 'AccountService', function ($scope, $rootScope, $timeout, $cookies, AccountService) {

    function userAuth () {
        if ($cookies.get('Authorization')) {
            AccountService.me().success(function (res) {
                window.cheepow.user = res.data;
                $scope.user = window.cheepow.user;
            }).error(function () {
                $cookies.remove('Authorization');
                notLogin();
            }).finally(function () {
                doneCheckAuth();
            });
        }
        else {
            notLogin();
            doneCheckAuth();
        }
    }

    function notLogin () {
        window.cheepow.user = {};
        $scope.user = {};
    }

    function doneCheckAuth () {
        $rootScope.$broadcast('USER_LOADED');
    }

    $scope.init = function () {
        $scope.screenTransition = 'fadeIn';
        $scope.screenReady = true;
        userAuth();
    };

    $scope.navigateTo = function (url) {
        if (url !== window.location.hash) {
            $scope.screenTransition = 'fadeOut';
            $timeout(function () {
                $scope.screenReady = false;
                $scope.screenTransition = 'fadeIn';
            }, 200);
            $timeout(function () {
                window.location.hash = url;
                $scope.screenReady = true;
            }, 500);
        }
    };

    $scope.$on('UPDATE_USER', function () {
        $scope.user = window.cheepow.user;
    });

    $scope.init();

}]);
