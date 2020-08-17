(function () {
    'use strict';
    angular.module('mainApp').controller('amountCtrl', amountCtrl);

    function amountCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, PagerService) {

        // 送出上分
        $scope.SetAmountData = function () {
            var defaultpath = ngAppSettings.baseUri + '/accountTransportAmount.php';
            var data = $.param({
                'account': $scope.AmountData.Account,
                'amount': $scope.AmountData.Amount,
                'comment': $scope.AmountData.Comment,
                'password': $scope.AmountData.Password,
            });
            $scope.urlpath = defaultpath;
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    if (response.errCode === 0) {
                        swal({
                            title: '上分成功',
                            type: 'success',
                            showCancelButton: false,  //顯示取消按鈕
                        }).then(function() {
                            $('#SentAmount').modal('hide');
                            $scope.Search();
                        });
                    }
                }).error(function (err) {
                $scope.$parent.MsgError(err);
            });
            $scope.$parent.CloseLoading();
        };

        // 取列表
        $scope.Search = function () {
            if ($scope.Account && $scope.Account != "") {
                var defaultpath = ngAppSettings.baseUri + '/amountLog.php';
                var data = $.param({
                    'account': $scope.Account
                });
                $scope.urlpath = defaultpath;
                $scope.$parent.ShowLoading();
                $http.post($scope.urlpath,data,config)
                    .success(function (response) {
                        $scope.AmountReportData = response.data;
                    }).error(function (err) {
                    $scope.$parent.MsgError(err);
                    $scope.AmountReportData = [];
                });
                $scope.$parent.CloseLoading();
            } else {
                swal({
                    title: '請輸入帳號再查詢',
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                });
            }
        };

        // Reset
        $scope.Reset = function () {
            $scope.Account = '';        // 帳號搜尋
            $scope.AmountReportData = [];   // 額度紀錄資料
            $scope.AmountData = {};     // 額度紀錄model資料
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
