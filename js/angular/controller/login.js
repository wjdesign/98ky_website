(function () {
    'use strict';
    angular.module('mainApp').controller('loginCtrl', loginCtrl);

    function loginCtrl($scope, $rootScope, $state, $stateParams, $timeout, localStorageService, ngAppSettings, $http) {

        $scope.UserData = {
            Account: localStorageService.get('RememberAccount') || "",
            Password: ""
        };
        $scope.RememberAccount = !!localStorageService.get('RememberAccount');

        // 登入
        $scope.login = function () {
            if ($scope.UserData.Account && $scope.UserData.Password) {
                var defaultpath;

                // URL參數lv帶 admin:股東登入 , sagent:總代登入 , 未帶或帶agent:代理登入
                if ($stateParams.lv) {
                    switch ($stateParams.lv) {
                        case "admin":
                            defaultpath = ngAppSettings.baseUri + '/admin_login.php';
                            break;
                        case "sagent":
                            defaultpath = ngAppSettings.baseUri + '/sagent_login.php';
                            break;
                        default:
                            defaultpath = ngAppSettings.baseUri + '/agent_login.php';
                    }
                } else {
                    defaultpath = ngAppSettings.baseUri + '/agent_login.php';
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
            if ($stateParams.lv) {
                switch ($stateParams.lv) {
                    case "admin":
                        $scope.LoginTitle = "股東登入";
                        break;
                    case "sagent":
                        $scope.LoginTitle = "總代理登入";
                        break;
                    default:
                        $scope.LoginTitle = "代理登入";
                }
            } else {
                $scope.LoginTitle = "代理登入";
            }
        }
        Init();
    }
})();
