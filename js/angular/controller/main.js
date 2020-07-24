(function () {
    'use strict';
    angular.module('mainApp').controller('mainCtrl', mainCtrl);

    function mainCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http) {

        $scope.CopyrightYear = (new Date()).getFullYear();

        // Show Loading
        $scope.ShowLoading = function () {
            $scope.$parent.Loading = true;
        };

        // Close Loading
        $scope.CloseLoading = function () {
            var Already = $timeout(function () {
                $scope.Loading = false;
                $scope.stop = function(){
                    $timeout.cancel(Already);
                };
            },500);
        };

        // ClearLocalStorage
        $scope.ClearStorage = function () {
            localStorageService.remove('token');
        };

        // 錯誤訊息
        $scope.MsgError = function(err) {
            if (err.errCode == 1) {
                swal({
                    title: "驗證過期，請重新登入。",
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                }).then(function () {
                    $scope.ClearStorage();
                });
            } else if (err.errCode == 2) {
                swal({
                    title: err.msg,
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                });
            }
        };

        // 滾動頁頂
        $scope.GoTop = function () {
            $('html,body').animate({
                scrollTop: 0
            }, 350);
        };

        // Mobile版漢堡盒動畫
        angular.element(".ShowMenu").on("click", function () {
            $('.animated-icon').stop().toggleClass('open');
            var navMenuCont = $($(this).data('target'));
            navMenuCont.animate({
                'width': 'toggle'
            }, 350);
            $(".menu-overlay").fadeToggle(500);
        });

        angular.element(".menu-overlay").on("click", function () {
            $(".ShowMenu").trigger("click");
            $(".menu-overlay").fadeOut(500);
        });

        $scope.CheckAuth = function () {
            if ($rootScope.UID) {
            } else if (localStorageService.get('token')) {
                $rootScope.UID = localStorageService.get('token');
            } else {
                $state.go('login');
                return;
            }
            config.headers.token = $rootScope.UID;
            Init();
        };

        // 登出
        $scope.Logout = function () {
            swal({
                title: '確定登出?',
                type: 'warning',
                showCancelButton: true,  //顯示取消按鈕
                confirmButtonText: '登出',
                cancelButtonText: '取消',
            }).then(function(res) {
                if (res.value) {
                    var defaultpath = ngAppSettings.baseUri + '/logout.php';
                    $scope.urlpath = defaultpath;
                    var data = $.param({});
                    $http.post($scope.urlpath, data, config)
                        .success(function (response) {
                            swal({
                                title: "已登出",
                                type: 'warning',
                                showCancelButton: false,  //顯示取消按鈕
                            }).then(function () {
                                $scope.ClearStorage();
                                $state.go('login');
                            });
                        }).error(function (err) {
                            console.log(err)
                    });
                }
            });
        };

        // Init
        function Init() {
            $scope.ShowLoading();
            $scope.GoTop();
            $scope.CloseLoading();
        }
        $scope.CheckAuth();
    }
})();
