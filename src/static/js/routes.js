'use strict';
module.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('index', {
          url: "/",
          templateUrl: "partials/index.html"
      })
      .state('login', {
          url: "/login",
          templateUrl: "partials/login.html"
      }).state('register', {
          url: "/register",
          templateUrl: "partials/register.html"
      });
});