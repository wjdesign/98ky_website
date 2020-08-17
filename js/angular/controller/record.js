(function () {
    'use strict';
    angular.module('mainApp').controller('recordCtrl', recordCtrl);

    function recordCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, PagerService) {

        $scope.DateTimeFormat = 'YYYY/MM/DD HH:mm';

        $scope.setPage = function (page) {
            if (page < 1 || page > $scope.Pager.totalPages) {
                return;
            }
            // get pager object from service
            $scope.Pager = PagerService.GetPager($scope.TotalPages.length, page, 10);
            // get current page of items
            $scope.ShowData = $scope.TotalPages.slice($scope.Pager.startIndex, $scope.Pager.endIndex + 1);
        };

        // 選擇日期區間
        $scope.SelectTimeArea = function (_area) {
            switch (_area) {
                case 'Today':
                    $scope.DateZoom = 'Today';
                    $scope.DateTime.Start = moment().format('YYYY/MM/DD 00:00');
                    $scope.DateTime.End = moment().format('YYYY/MM/DD 23:59');
                    break;
                case 'Week':
                    $scope.DateZoom = 'Week';
                    var weekStart = moment().clone().startOf('isoWeek');
                    var weekEnd = moment().clone().endOf('isoWeek');
                    $scope.DateTime.Start = moment(weekStart).format($scope.DateTimeFormat);
                    $scope.DateTime.End = moment(weekEnd).format($scope.DateTimeFormat);
                    break;
                case 'PrevWeek':
                    $scope.DateZoom = 'PrevWeek';
                    $scope.DateTime.Start = moment().subtract(1, 'weeks').startOf('isoWeek').format($scope.DateTimeFormat);
                    $scope.DateTime.End = moment().subtract(1, 'weeks').endOf('isoWeek').format($scope.DateTimeFormat);
                    break;
                case 'Month':
                    $scope.DateZoom = 'Month';
                    var monthStart = moment().clone().startOf('Month');
                    var monthEnd = moment().clone().endOf('Month');
                    $scope.DateTime.Start = moment(monthStart).format($scope.DateTimeFormat);
                    $scope.DateTime.End = moment(monthEnd).format($scope.DateTimeFormat);
                    break;
                case 'PrevMonth':
                    $scope.DateZoom = 'PrevMonth';
                    var monthStart = moment().subtract(1, 'months').startOf('month');
                    var monthEnd = moment().subtract(1, 'months').endOf('month');
                    $scope.DateTime.Start = moment(monthStart).format($scope.DateTimeFormat);
                    $scope.DateTime.End = moment(monthEnd).format($scope.DateTimeFormat);
                    break;
            }
            // 直接搜尋
            $scope.Search();
        };

        // 取得操作記錄
        $scope.Search = function () {

            if (!$scope.DateTime.Start && !$scope.DateTime.End) {
                swal({
                    title: "請選擇時間再進行查詢",
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                });
            } else {
                // 轉時間格式
                var Start = (!$scope.DateTime.Start) ? moment(new Date()).format('YYYY/MM/DD 00:00') : moment($scope.DateTime.Start).format($scope.DateTimeFormat);
                var End = (!$scope.DateTime.End) ? moment(new Date()).format('YYYY/MM/DD 23:59') : moment($scope.DateTime.End).format($scope.DateTimeFormat);

                var defaultpath = ngAppSettings.baseUri + '/user_log.php';
                $scope.urlpath = defaultpath;
                var data = $.param({
                    'datetimes': Start + '-' + End
                });
                $http.post($scope.urlpath,data,config)
                    .success(function (response) {
                        $scope.Data = response.data
                        $scope.Pager = {};          // 頁數資料
                        $scope.TotalPages = _.range(0, response.data.length);
                        $scope.setPage(1);
                    }).error(function (err) {
                    $scope.Data = [];
                    $scope.Pager = {};
                    $scope.TotalPages = [];
                    $scope.setPage(0);
                });
                $scope.$parent.CloseLoading();
            }
        };

        // Reset
        $scope.Reset = function () {
            $scope.DateZoom = '';
            $scope.DateTime = {         // 搜尋時間
                'Start': '',
                'End': ''
            };
            $scope.Data = [];
            $scope.Pager = {};
            $scope.TotalPages = [];
            $scope.ShowData = {};       // 當前顯示的資料
            $scope.setPage(0);
        };

        // 判斷level,為股東或股東子帳號才可進此頁面
        $scope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.url == "/record") {
                if ($rootScope.UserData.level != "5" && $rootScope.UserData.level != "4") {
                    swal({
                        title: "無權訪問此頁面",
                        type: 'warning',
                        showCancelButton: false,  //顯示取消按鈕
                    }).then(function () {
                        $state.go('main.dashboard', {reload: true});
                    });
                }
            }
        });

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
