(function () {
    'use strict';
    angular.module('mainApp').controller('reportCtrl', reportCtrl);

    function reportCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, PagerService) {

        $scope.DateTimeFormat = 'YYYY/MM/DD HH:mm';
        $scope.Pager = {};          // 頁數資料
        $scope.TotalPages = {};     // 全部資料
        $scope.ShowData = {};       // 當前顯示的資料
        $scope.setPage = function (page, type) {
            if (!$scope.Pager[type]) $scope.Pager[type] = {};
            if (page < 1 || page > $scope.Pager[type].totalPages) {
                return;
            }
            // get pager object from service
            $scope.Pager[type] = PagerService.GetPager($scope.TotalPages[type].length, page, 10);
            // get current page of items
            if (!$scope.ShowData[type]) $scope.ShowData[type] = [];
            $scope.ShowData[type] = $scope.TotalPages[type].slice($scope.Pager[type].startIndex, $scope.Pager[type].endIndex + 1);
        };

        // 選擇日期區間
        $scope.SelectTimeArea = function (_area) {
            switch (_area) {
                case 'Today':
                    $scope.DateZoom = 'Today';
                    $scope.DateTime.Start = moment().format('YYYY/MM/DD') + ' 00:00';
                    $scope.DateTime.End = moment().format('YYYY/MM/DD') + ' 23:59';
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
                    var weekStart = moment().clone().startOf('Month');
                    var weekEnd = moment().clone().endOf('Month');
                    $scope.DateTime.Start = moment(weekStart).format($scope.DateTimeFormat);
                    $scope.DateTime.End = moment(weekEnd).format($scope.DateTimeFormat);
                    break;
            }
            $scope.DateTime.Start = moment($scope.DateTime.Start).format($scope.DateTimeFormat);
        };

        // Reset Search Tools
        $scope.Reset = function () {
            $scope.Type = 'All';        // 點數類型
            $scope.DateZoom = '';
            $scope.DateTime = {         // 搜尋時間
                'Start': '',
                'End': ''
            };
        };

        $scope.Search = function () {
            var Start = (!$scope.DateTime.Start) ? moment(new Date()).format('YYYY/MM/DD') + ' 00:00' : moment($scope.DateTime.Start).format($scope.DateTimeFormat);
            var End = (!$scope.DateTime.End) ? moment(new Date()).format('YYYY/MM/DD') + ' 23:59' : moment($scope.DateTime.End).format($scope.DateTimeFormat);

            var defaultpath = ngAppSettings.baseUri + '/agent_report.php';
            $scope.urlpath = defaultpath;
            var data = $.param({
                'datetimes': Start + '-' + End,
                'agent_id': 1
            });
            $scope.$parent.ShowLoading();
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    console.log(response)
                    if (response.errCode === 0) {
                        if (!$scope.TotalPages['Credit']) $scope.TotalPages['Credit'] = [];
                        $scope.TotalPages['Credit'] = response.credit;
                        $scope.setPage(1, 'Credit');

                        if (!$scope.TotalPages['Cash']) $scope.TotalPages['Cash'] = [];
                        $scope.TotalPages['Cash'] = response.cash;
                        $scope.setPage(1, 'Cash');
                    }
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
            $scope.$parent.CloseLoading();
        }
        Init();
    }
})();
