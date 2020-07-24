(function () {
    'use strict';
    angular.module('mainApp').controller('managerCtrl', managerCtrl);

    function managerCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, PagerService) {

        $scope.CheckPassword = '';
        $scope.RegisterData = {};       // 新增代理的model資料
        $scope.Pager = {};          // 頁數資料
        $scope.TotalPages = _.range(1, 121);
        $scope.setPage = function (page) {
            if (page < 1 || page > $scope.Pager.totalPages) {
                return;
            }
            // get pager object from service
            $scope.Pager = PagerService.GetPager($scope.TotalPages.length, page, 10);
            // get current page of items
            $scope.ShowData = $scope.TotalPages.slice($scope.Pager.startIndex, $scope.Pager.endIndex + 1);
        };

        // 送出新增代理
        $scope.SetRegister = function () {
            if ($scope.CheckPassword === '' || $scope.RegisterData.Password != $scope.CheckPassword) {
                swal({
                    title: '密碼與確認密碼不符',
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                }).then(function() {
                    $('#AgentPassWD').val('');
                    $('#AgentPassWDConfirm').val('');
                });
            } else if ($scope.RegisterData.Password.length < 8) {
                swal({
                    title: '設定的密碼有誤',
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                }).then(function() {
                    $('#AgentPassWD').val('');
                    $('#AgentPassWDConfirm').val('');
                });
            } else {
                console.log('submit register');
                console.log($scope.RegisterData);
            }
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

        // 取資料
        $scope.GetReport = function () {
            console.log($scope.RegisterData);
            return;
            var defaultpath = ngAppSettings.baseUri + '/agent_report.php';
            $scope.urlpath = defaultpath;
            var data = $.param({
                'datetimes':'2020/06/01 08:17-2020/07/14 08:17',
                'uid': 'TVE9PQ=='
            });
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    console.log(response)
                }).error(function (err) {
                $scope.$parent.MsgError(err);
            });
        };

        // Init
        function Init() {
            $scope.$parent.ShowLoading();
            $scope.$parent.GoTop(); // 滾動至頁頂
            $scope.setPage(1);
            $scope.$parent.CloseLoading();
        }
        Init();
    }
})();
