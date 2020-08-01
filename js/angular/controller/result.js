(function () {
    'use strict';
    angular.module('mainApp').controller('resultCtrl', resultCtrl);

    function resultCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, PagerService) {

        $scope.Pager = {};          // 頁數資料
        $scope.TotalPages = [];     // 全部資料
        $scope.ShowData = [];       // 當前顯示的資料
        $scope.setPage = function (page) {
            if (page < 1 || page > $scope.Pager.totalPages) {
                return;
            }
            // get pager object from service
            $scope.Pager = PagerService.GetPager($scope.TotalPages.length, page, 10);
            // get current page of items
            $scope.ShowData = $scope.TotalPages.slice($scope.Pager.startIndex, $scope.Pager.endIndex + 1);
        };

        // Reset Search Tools
        $scope.Reset = function () {
            $scope.GameGroupSelect = '';// 遊戲群組
        };

        // 取得遊戲群組資訊
        $scope.GetGameGroupData = function () {
            var defaultpath = ngAppSettings.baseUri + '/gameGroupData.php';
            $scope.urlpath = defaultpath;
            var data = $.param({});
            $scope.$parent.ShowLoading();
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    $scope.GameGroup = response.data
                }).error(function (err) {
                $scope.$parent.MsgError(err);
            });
            $scope.$parent.CloseLoading();
        };

        // 搜尋賽果
        $scope.Search = function () {
            switch ($scope.GameGroupSelect) {
                case "1":
                    // 妞妞賽果
                    var defaultpath = ngAppSettings.baseUri + '/historyResult.php';
                    break;
                case "2":
                    // 推筒子賽果
                    var defaultpath = ngAppSettings.baseUri + '/historyResult_bobbin.php';
                    break;
                case "3":
                    // 牌九賽果
                    var defaultpath = ngAppSettings.baseUri + '/historyResult_pk9.php';
                    break;
                default:
                    return
            }
            $scope.urlpath = defaultpath;
            var data = $.param({});
            $scope.$parent.ShowLoading();
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    $scope.GameResult = response.data
                    $scope.TotalPages = _.range(0, response.data.length); // 全部資料
                    $scope.setPage(1);
                }).error(function (err) {
                $scope.$parent.MsgError(err);
            });
            $scope.$parent.CloseLoading();
        };

        // Init
        function Init() {
            $scope.$parent.ShowLoading();
            $scope.$parent.GoTop(); // 滾動至頁頂
            $scope.Reset();
            $scope.GetGameGroupData();
            $scope.$parent.CloseLoading();
        }
        Init();
    }
})();
