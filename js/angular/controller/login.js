(function () {
    'use strict';
    angular.module('mainApp').controller('loginCtrl', loginCtrl);

    function loginCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http) {

        $scope.UserData = {
            Account: localStorageService.get('RememberAccount') || "",
            Password: ""
        };
        $scope.RememberAccount = !!localStorageService.get('RememberAccount');

        // 登入
        $scope.login = function () {
            if ($scope.UserData.Account && $scope.UserData.Password) {
                var defaultpath = ngAppSettings.baseUri + '/admin_login.php';
                $scope.urlpath = defaultpath;
                var data = $.param({
                    'account': $scope.UserData.Account,
                    'password': $scope.UserData.Password
                });
                $http.post($scope.urlpath, data, config)
                    .success(function (response) {
                        if (response.error === 1) {
                            swal({
                                title: response.msg,
                                type: 'warning',
                                showCancelButton: false,  //顯示取消按鈕
                            });
                            $scope.UserData.Password = "";
                        } else {
                            if ($scope.RememberAccount) {
                                localStorageService.set("RememberAccount", response.data.account);
                            }
                            localStorageService.set("token", response.data.uid);
                            $rootScope.UID = response.data.uid;
                            $state.go('main.dashboard');
                        }
                    }).error(function (err) {
                    swal({
                        title: err.msg,
                        type: 'warning',
                        showCancelButton: false,  //顯示取消按鈕
                    });
                });
            }
            // $state.go('main.dashboard');
        };

        // Init
        function Init() {
        }
        Init();
    }
})();
