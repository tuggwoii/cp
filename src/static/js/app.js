'use strict';
var module = angular.module('app', ['ngAnimate', 'ngCookies', 'ui.router']);
module.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});
var app = {
    onReady: function () {
        angular.bootstrap(document, ['app']);
    }
};
$(document).ready(function () {
    app.onReady();
});
