'use strict';
module.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('Dashboard', {
          url: "/",
          templateUrl: "backend/dashboard.html"
      })
      .state('hotels', {
          url: "/hotels",
          templateUrl: "backend/hotels.html"
      })
      .state('hotel', {
          url: "/hotel",
          templateUrl: "backend/hotel.html"
      })
      .state('languages', {
          url: "/languages",
          templateUrl: "backend/languages.html"
      });
});