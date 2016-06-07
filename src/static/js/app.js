'use strict';
var module = angular.module('app', ['ngAnimate', 'ngCookies', 'ui.router']);
module.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
    window.cheepow = {};
});
var app = {
    init: function () {
        angular.bootstrap(document, ['app']);
    }
};
$(document).ready(function () {
    app.init();
});
