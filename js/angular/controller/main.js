(function () {
    'use strict';
    angular.module('mainApp').controller('mainCtrl', mainCtrl);

    function mainCtrl(UserData, $scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, $window) {

        $scope.CopyrightYear = (new Date()).getFullYear();
        // 身分名稱
        $scope.LevelName = {
            "1": "代理",
            "2": "總代理子帳號",
            "3": "總代理",
            "4": "股東子帳號",
            "5": "股東"
        };
        // 下線名稱
        $scope.UserNumName = {
            "1": "會員",
            "2": "會員",
            "3": "代理數",
            "4": "代理數",
            "5": "總代理數"
        };

        // Show Loading
        $scope.ShowLoading = function () {
            $scope.Loading = true;
        };

        // Close Loading
        $scope.CloseLoading = function () {
            var Already = $timeout(function () {
                $scope.Loading = false;
                $scope.stop = function(){
                    $timeout.cancel(Already);
                };
            },1000);
        };

        // ClearLocalStorage
        $scope.ClearStorage = function () {
            localStorageService.remove('token');
        };

        // 錯誤訊息
        $scope.MsgError = function(err, opt) {
            if (err.errCode == 1) {
                swal({
                    title: "驗證過期，請重新登入。",
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                }).then(function () {
                    $scope.ClearStorage();
                });
            } else if (err.errCode == 2) {
                if (opt) {
                    swal(opt);
                } else {
                    swal({
                        title: err.msg,
                        type: 'warning',
                        showCancelButton: false,  //顯示取消按鈕
                    });
                }
            }
        };

        // 滾動頁頂
        $scope.GoTop = function () {
            $('html,body').animate({
                scrollTop: 0
            }, 350);
        };

        // 拷貝至剪貼簿
        $scope.CopyToClipboard = function (_textRange, _inputID) {
            if (_textRange) {
                // 將textRange拷貝至剪貼簿
                var aux = document.createElement("input");
                aux.setAttribute("value", _textRange);
                document.body.appendChild(aux);
                aux.select();
                document.execCommand("copy");
                document.body.removeChild(aux);

                // 有inputID的話反白inputID
                if (_inputID) {
                    document.getElementById(_inputID).select();
                }
                swal({
                    title: "已拷貝至剪貼簿。",
                    timer: 700,
                    animation: 'fadeOut',
                    showConfirmButton: false
                });
            }
        };

        // 開關Menu
        $scope.ToggleMenuFN = function (_toggle) {
            if (_toggle) {
                $scope.ToggleMenu = _toggle
            } else {
                $scope.ToggleMenu = !$scope.ToggleMenu
            }
            localStorageService.set('toggleMenu', $scope.ToggleMenu);
        };

        // 切換路由
        $scope.ChangeRouter = function (_path) {
            if ($scope.Loading) return;
            if (angular.element($window).width() <= 768) {
                $scope.ToggleMenuFN(false);
            }
            $state.go(_path);
        };

        // 下載檔案
        $scope.DownloadFile = function (_fileUrl, _fileName, _fileType) {
            var req = new XMLHttpRequest();
            req.open("GET", _fileUrl, true);
            req.responseType = "blob";

            req.onload = function (event) {
                var blob = req.response;
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = _fileName + "." + _fileType;
                link.click();
            };
            req.send();
        };

        // 登出
        $scope.Logout = function () {
            var lv = "";
            switch ($rootScope.UserData.level) {
                case "5":
                case "4":
                    lv = "admin";
                    break;
                case "3":
                case "2":
                    lv = "sagent";
                    break;
                default:
                    lv = "agent";
            }
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
                                $state.go('login', {lv: lv});
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
            $scope.MenuAuth = {
                "dashboard": true,
                "manager": true,
                "amount": true,
                "report": true,
                "result": true,
                "account": true,
                "record": false
            };
            // 判斷Menu開關
            if (localStorageService.get('toggleMenu') || typeof localStorageService.get('toggleMenu') === "boolean") {
                $scope.ToggleMenu = localStorageService.get('toggleMenu');
            } else {
                $scope.ToggleMenu = true;
                localStorageService.set('toggleMenu', true);
            }

            // 判斷是否有UserData
            if (UserData) {
                $rootScope.UserData = UserData
            } else {
                swal({
                    title: "驗證過期，請重新登入。",
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                }).then(function () {
                    $scope.ClearStorage();
                    $state.go('login');
                });
            }

            // 若為股東或股東子帳號,才有操作紀錄
            if ($rootScope.UserData.level == "5" || $rootScope.UserData.level == "4") {
                $scope.MenuAuth.record = true;
            }
            $scope.GoTop();
            $scope.CloseLoading();
        }
        Init();
    }
})();
