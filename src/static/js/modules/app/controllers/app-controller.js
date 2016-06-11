﻿'use strict';
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
            checkLoginState();
        }
    }

    function notLogin () {
        window.cheepow.user = {};
        $scope.user = {};
    }

    function doneCheckAuth () {
        $rootScope.$broadcast('USER_LOADED');
    }

    function statusChangeCallback(response) {
        if (response.status === 'connected') {
            API(response);
        } else {
            notLogin();
            doneCheckAuth();
        }
    }

    function checkLoginState () {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    }

    function API(fb_creds) {
        FB.api('/me?fields=name,email', function (response) {
            var creds = response;
            creds.fb_token = fb_creds.authResponse.accessToken;
            facebookLogin(creds);
        });
    }

    function facebookLogin (creds) {
        AccountService.login(creds).success(function (res) {
            var date = new Date();
            var expire_date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            $cookies.put('Authorization', res.data.token, { path: '/', expires: expire_date });
            window.cheepow.user = res.data;
            $scope.user = window.cheepow.user;
        }).error(function () {
            notLogin();
        }).finally(function () {
            doneCheckAuth();
        });
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