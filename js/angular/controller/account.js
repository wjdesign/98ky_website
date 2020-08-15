(function () {
    'use strict';
    angular.module('mainApp').controller('accountCtrl', accountCtrl);

    function accountCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, PagerService) {

        // 變更密碼
        $scope.ChangePassword = function () {
            if ($scope.OwnData.OldPassword && $scope.OwnData.OldPassword.length >= 8 && $scope.OwnData.Password && $scope.OwnData.Password.length >= 8 && $scope.OwnData.Password == $scope.OwnData.CheckPassword) {
                var defaultpath = ngAppSettings.baseUri + '/change_pw.php';
                $scope.urlpath = defaultpath;
                var data = $.param({
                    'password': $scope.OwnData.OldPassword,
                    'new_password': $scope.OwnData.Password
                });
                $http.post($scope.urlpath,data,config)
                    .success(function (response) {
                        if (response.errCode === 0) {
                            swal({
                                title: '修改成功，下次請使用新密碼登入。',
                                type: 'success',
                                showCancelButton: false,  //顯示取消按鈕
                            });
                            $scope.OwnData.OldPassword = '';
                            $scope.OwnData.Password = '';
                            $scope.OwnData.CheckPassword = '';
                        }
                    }).error(function (err) {
                    $scope.$parent.MsgError(err);
                });
                $scope.$parent.CloseLoading();
            }
        };

        // 取得子帳號列表
        $scope.Search = function () {
            var defaultpath = ngAppSettings.baseUri + '/child_list.php';
            $scope.urlpath = defaultpath;
            var data = $.param({});
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    console.log(response);
                    $scope.ChildListData = response.data;
                }).error(function (err) {
                    $scope.ChildListData = [];
            });
            $scope.$parent.CloseLoading();
        };

        // 送出子帳號申請
        $scope.SetChild = function () {
            console.log($scope.AddChild)
            if ($scope.AddChild.Password && $scope.AddChild.Password.length >= 8 && $scope.AddChild.Password == $scope.AddChild.CheckPassword) {
                var defaultpath = ngAppSettings.baseUri + '/insert_child.php';
                $scope.urlpath = defaultpath;
                var data = $.param({
                    "account": $scope.AddChild.Account,
                    "name": $scope.AddChild.Name,
                    "password": $scope.AddChild.Password,
                    "comment": $scope.AddChild.Comment
                });
                $http.post($scope.urlpath,data,config)
                    .success(function (response) {
                        if (response.errCode === 0) {
                            swal({
                                title: '新增成功',
                                type: 'success',
                                showCancelButton: false,  //顯示取消按鈕
                            }).then(function() {
                                $('#AddChild').modal('hide');
                                $scope.Search();
                            });
                        }
                    }).error(function (err) {
                        $scope.$parent.MsgError(err);
                });
                $scope.$parent.CloseLoading();
            }
        };

        // 打開子帳號修改彈窗
        $scope.ShowModifyData = function (_data) {
            $scope.ModifyData = {};
            $scope.ModifyData.Account = _data.account;
            $scope.ModifyData.Name = _data.name;
            $scope.ModifyData.Password = '';
            $scope.ModifyData.CheckPassword = '';
            $scope.ModifyData.Status = _data.status;
            $scope.ModifyData.Comment = _data.comment;
            $('#ModifyItem').modal('show');
        };

        // 送出子帳號修改資料
        $scope.SetModifyData = function () {
            if ($scope.ModifyData.Password) {
                if ($scope.ModifyData.Password.length < 8) {
                    swal({
                        title: '設定的密碼有誤',
                        type: 'warning',
                        showCancelButton: false,  //顯示取消按鈕
                    }).then(function() {
                        $('#ModifyPassWD').val('');
                        $('#ModifyPassWDConfirm').val('');
                    });
                    return
                } else if ($scope.ModifyData.Password != $scope.ModifyData.CheckPassword) {
                    swal({
                        title: '密碼與確認密碼不符',
                        type: 'warning',
                        showCancelButton: false,  //顯示取消按鈕
                    }).then(function() {
                        $('#ModifyPassWD').val('');
                        $('#ModifyPassWDConfirm').val('');
                    });
                    return
                }
            }
            var defaultpath = ngAppSettings.baseUri + '/update_child.php';
            $scope.urlpath = defaultpath;
            var data = $.param({
                "account": $scope.ModifyData.Account,
                "name": $scope.ModifyData.Name,
                "password": $scope.ModifyData.Password,
                "status": $scope.ModifyData.Status,
                "comment": $scope.ModifyData.Comment
            });
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    if (response.errCode === 0) {
                        swal({
                            title: '編輯成功',
                            type: 'success',
                            showCancelButton: false,  //顯示取消按鈕
                        }).then(function() {
                            $('#ModifyItem').modal('hide');
                            $scope.Search();
                        });
                    }
                }).error(function (err) {
                $scope.$parent.MsgError(err);
            });
            $scope.$parent.CloseLoading();
        };

        // Reset
        $scope.Reset = function () {
            $scope.Step = 'sagent';
            $scope.ShowChildList = false;               // 是否顯示子帳號列表
            $scope.AccountData = {};
            $scope.AddChild = {};                       // 新增子帳號的modal
            $scope.OwnData = $rootScope.UserData;       // 自身帳號資料
            $scope.OwnData.OldPassword = '';
            $scope.OwnData.Password = '';
            $scope.OwnData.CheckPassword = '';
            if ($scope.OwnData.level == '5' || $scope.OwnData.level == '3') {
                // 股東或總代才有子帳號列表
                $scope.ShowChildList = true;
                $scope.Search();
            }
        };

        // Init
        function Init() {
            $scope.$parent.ShowLoading();
            $scope.$parent.GoTop(); // 滾動至頁頂
            $scope.Reset();
            $scope.$parent.CloseLoading();
        }
        Init();
    }
})();
