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
                var defaultpath;
                if (localStorageService.get('testLevel')) {
                    switch (localStorageService.get('testLevel')) {
                        case "5":
                        case "4":
                            defaultpath = ngAppSettings.baseUri + '/admin_login.php';
                            break;
                        case "3":
                        case "2":
                            defaultpath = ngAppSettings.baseUri + '/sagent_login.php';
                            break;
                        case "1":
                            defaultpath = ngAppSettings.baseUri + '/agent_login.php';
                            break;
                        default:
                            defaultpath = ngAppSettings.baseUri + '/admin_login.php';
                    }
                } else {
                    defaultpath = ngAppSettings.baseUri + '/admin_login.php';
                }
                $scope.urlpath = defaultpath;
                var data = $.param({
                    'account': $scope.UserData.Account,
                    'password': $scope.UserData.Password
                });
                $http.post($scope.urlpath, data, config)
                    .success(function (response) {
                        if (response.errCode == 1) {
                            swal({
                                title: response.msg,
                                type: 'warning',
                                showCancelButton: false,  //顯示取消按鈕
                            });
                            $scope.UserData.Password = "";
                        } else {
                            if ($scope.RememberAccount) {
                                localStorageService.set("RememberAccount", response.data.account);
                            } else {
                                localStorageService.remove("RememberAccount")
                            }
                            localStorageService.set("token", response.data.uid);
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
            if (localStorageService.get('testLevel')) {
                switch (localStorageService.get('testLevel')) {
                    case "5":
                    case "4":
                        $scope.LoginTitle = "股東登入";
                        break;
                    case "3":
                    case "2":
                        $scope.LoginTitle = "總代理登入";
                        break;
                    case "1":
                        $scope.LoginTitle = "代理登入";
                        break;
                    default:
                        $scope.LoginTitle = "股東登入";
                }
            } else {
                $scope.LoginTitle = "股東登入";
            }
        }
        Init();
    }
})();
