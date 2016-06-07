'use strict';
module.controller('LoginController', ['$scope', '$cookies', 'AccountService', 'NotificationService', function ($scope, $cookies, AccountService, NotificationService) {

    $scope.model = {};
    $scope.status = {};

    $scope.onLoad = function () {
        NotificationService.loading();
        /*
        AccountService.me()
            .success(function () {
                window.location.href = '/dashboard';
            }).error(function () {
                NotificationService.stopLoading();
            });
        */
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user);
            } else {
                console.log('no user');
                NotificationService.stopLoading();
            }
        });
    };

    $scope.login = function (form) {
        $scope.status = {};
        if (form.$valid) {
            NotificationService.loading();
            /*
            AccountService.login($scope.model)
                .success(function (res) {
                    $cookies.put('Authorization', res.data.token);
                    window.location.href = '/dashboard';
                })
                .error(function (ressponse, status) {
                    if (status === 400) {
                        $scope.status.invalid = true;
                    }
                    else {
                        $scope.status.error = true;
                    }
                }).finally(function () {
                    NotificationService.stopLoading();
                });
                */

            firebase.auth().signInWithEmailAndPassword($scope.model.email, $scope.model.password).catch(function (error) {
                console.log(error);
                $scope.status.invalid = true;
                NotificationService.stopLoading();
            });
        }
    };
	
	$scope.facebookLogin = function (data) {
		NotificationService.loading();
		AccountService.login(data)
			.success(function (res) {
				$cookies.put('Authorization', res.data.token);
				window.location.href = '/dashboard';
			})
			.error(function (ressponse, status) {
				if (status === 400) {
					$scope.status.invalid = true;
				}
				else {
					$scope.status.error = true;
				}
				console.log(response);
			}).finally(function () {
				NotificationService.stopLoading();
			});
	};

    $scope.onLoad();

}]);
