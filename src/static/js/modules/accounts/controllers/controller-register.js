'use strict';
module.controller('RegisterController', ['$scope', '$cookies', 'AccountService', 'NotificationService', function ($scope, $cookies, AccountService, NotificationService) {

    $scope.model = {};
    $scope.status = {};

    $scope.onLoad = function () {
        NotificationService.loading();
        AccountService.me()
            .success(function () {
                window.location.href = '/dashboard';
            }).error(function () {
                NotificationService.stopLoading();
            });
    };

    $scope.submit = function (form) {
        $scope.status = {};
        angular.forEach(form.$error.required, function (field) {
            field.$setDirty();
        });
        if (form.$valid && $scope.model.password === $scope.model.confirm_password) {
            NotificationService.loading();
            AccountService.register($scope.model)
                .success(function (res) {
                    $cookies.put('Authorization', res.data.token);
                    window.location.href = '/dashboard';
                    NotificationService.stopLoading();
                })
                .error(function (ressponse, status) {
                    if (status === 400 && ressponse.error.message.toLowerCase() === 'email exist') {
                        $scope.status.exist = true;
                    }
                    else {
                        $scope.status.error = true;
                    }
                    NotificationService.stopLoading();
                });
        }
    };

    $scope.onLoad();

}]);
