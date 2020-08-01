(function () {
    'use strict';
    angular.module('mainApp').controller('managerCtrl', managerCtrl);

    function managerCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, PagerService) {

        $scope.setPage = function (page) {
            if (page < 1 || page > $scope.Pager.totalPages) {
                return;
            }
            // get pager object from service
            $scope.Pager = PagerService.GetPager($scope.TotalPages.length, page, 10);
            // get current page of items
            $scope.ShowData = $scope.TotalPages.slice($scope.Pager.startIndex, $scope.Pager.endIndex + 1);
        };

        // 修改資料
        $scope.ShowModifyData = function (_data) {
            $scope.ModifyData = angular.copy(_data);
            $('#ModifyItem').modal('toggle');
        };

        // 送出修改資料
        $scope.SetModifyData = function () {
            console.log('ModifyData:', $scope.ModifyData)
        };

        // 送出新增資料
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
                case 'PrevMonth':
                    $scope.DateZoom = 'PrevMonth';
                    var monthStart = moment().subtract(1, 'months').startOf('month');
                    var monthEnd = moment().subtract(1, 'months').endOf('month');
                    $scope.DateTime.Start = moment(monthStart).format($scope.DateTimeFormat);
                    $scope.DateTime.End = moment(monthEnd).format($scope.DateTimeFormat);
                    break;
            }
            $scope.DateTime.Start = moment($scope.DateTime.Start).format($scope.DateTimeFormat);
        };

        // 取列表
        $scope.GetList = function () {
            var defaultpath = ngAppSettings.baseUri + '/sagent_list.php';
            $scope.urlpath = defaultpath;
            var data = $.param({});
            $scope.$parent.ShowLoading();
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    $scope.Data = response.data
                    $scope.TotalPages = _.range(0, response.data.length);
                    $scope.setPage(1);
                }).error(function (err) {
                $scope.$parent.MsgError(err);
            });
            $scope.$parent.CloseLoading();
        };

        // Reset
        $scope.Reset = function () {
            $scope.CheckPassword = '';
            $scope.RegisterData = {};   // 新增的model資料
            $scope.ModifyData = {};     // 修改的model資料
            $scope.Pager = {};          // 頁數資料
            $scope.DateZoom = '';
            $scope.DateTime = {         // 搜尋時間
                'Start': '',
                'End': ''
            };
            $scope.GetList();
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
