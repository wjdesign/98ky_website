(function () {
    'use strict';
    angular.module('mainApp').controller('reportCtrl', reportCtrl);

    function reportCtrl(UserData, $scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, PagerService) {

        $scope.DateTimeFormat = 'YYYY/MM/DD HH:mm';

        // 設定Page
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
            $scope.DateTime.Start = moment($scope.DateTime.Start).format($scope.DateTimeFormat);
        };

        // Reset Search Tools
        $scope.Reset = function () {
            switch ($rootScope.UserData.level) {
                case "5":
                case "4":
                    // 身份若為股東時
                    $scope.Step = 'sagent';             // 預設第一層
                    $scope.SearchSAgentAccount = '';    // 搜尋的總代帳號
                    $scope.SearchAgentAccount = '';     // 搜尋的代理帳號
                    $scope.SearchUserAccount = '';      // 搜尋的會員帳號
                    $scope.GetSAgentList();
                    break;
                case "3":
                case "2":
                    // 身份若為總代時
                    $scope.Step = 'agent';             // 預設第二層
                    $scope.SearchSAgentAccount = $rootScope.UserData.account;   // 預設總代帳號為自己
                    $scope.SearchAgentAccount = '';     // 搜尋的代理帳號
                    $scope.SearchUserAccount = '';      // 搜尋的會員帳號
                    $scope.SearchUID = $rootScope.UserData.uid;                 // 預設搜尋的UID為自己
                    break;
                case "1":
                    // 身份若為代理時
                    console.log('todo');
                    break;
            }
            $scope.Type = 'All';                // 點數類型
            $scope.DateZoom = '';
            $scope.DateTime = {         // 搜尋時間
                'Start': '',
                'End': ''
            };
            $scope.TotalPages = {};     // 全部資料
            $scope.ShowData = {};       // 當前顯示的資料
            $scope.Pager = {};          // 頁數資料
            $scope.Data = {};           // 存放資料
        };

        // 取總代理列表
        $scope.GetSAgentList = function () {
            var defaultpath = ngAppSettings.baseUri + '/sagent_list.php';
            $scope.urlpath = defaultpath;
            var data = $.param({});
            $scope.$parent.ShowLoading();
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    $scope.SagentList = response.data
                }).error(function (err) {
                $scope.$parent.MsgError(err);
            });
            $scope.$parent.CloseLoading();
        };

        // 切換點數類型
        $scope.ChangeType = function (_type) {
            $scope.Type = _type
        };

        // 搜尋
        $scope.Search = function () {
            // 轉時間格式
            var Start = (!$scope.DateTime.Start) ? moment(new Date()).format('YYYY/MM/DD 00:00') : moment($scope.DateTime.Start).format($scope.DateTimeFormat);
            var End = (!$scope.DateTime.End) ? moment(new Date()).format('YYYY/MM/DD 23:59') : moment($scope.DateTime.End).format($scope.DateTimeFormat);

            var data, defaultpath;
            switch ($scope.Step) {
                case 'agent':
                    defaultpath = ngAppSettings.baseUri + '/sagent_report.php';
                    data = $.param({
                        'datetimes': Start + '-' + End,
                        'sagent_uid': $scope.SearchUID
                    });
                    break;
                case 'user':
                    defaultpath = ngAppSettings.baseUri + '/agent_report.php';
                    data = $.param({
                        'datetimes': Start + '-' + End,
                        'agent_uid': $scope.SearchUID
                    });
                    break;
                case 'detail':
                    defaultpath = ngAppSettings.baseUri + '/user_report.php';
                    data = $.param({
                        'datetimes': Start + '-' + End,
                        'uid': $scope.SearchUID
                    });
                    break;
            }
            $scope.urlpath = defaultpath;
            $scope.$parent.ShowLoading();
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    if ($scope.Step == 'detail') {
                        // 單一會員報表資料
                        if (response.data && response.data.length > 0) {
                            if (!$scope.TotalPages['Detail']) $scope.TotalPages['Detail'] = [];
                            $scope.Data['Detail'] = response.data;
                            $scope.TotalPages['Detail'] = _.range(0, response.data.length);
                            $scope.setPage(1, 'Detail');
                        } else {
                            $scope.TotalPages['Detail'] = [];
                            $scope.Data['Detail'] = [];
                            $scope.setPage(0, 'Detail');
                        }
                    } else {
                        // 其他
                        if (response.data) {
                            if (response.data.credit && response.data.credit.length > 0) {
                                if (!$scope.TotalPages['Credit']) $scope.TotalPages['Credit'] = [];
                                $scope.TotalPages['Credit'] = _.range(0, response.data.credit.length);
                                $scope.Data['Credit'] = response.data.credit;
                                $scope.setPage(1, 'Credit');
                            } else {
                                $scope.TotalPages['Credit'] = [];
                                $scope.Data['Credit'] = [];
                                $scope.setPage(0, 'Credit');
                            }
                            if (response.data.cash && response.data.cash.length > 0) {
                                if (!$scope.TotalPages['Cash']) $scope.TotalPages['Cash'] = [];
                                $scope.TotalPages['Cash'] = _.range(0, response.data.cash.length);
                                $scope.Data['Cash'] = response.data.cash;
                                $scope.setPage(1, 'Cash');
                            } else {
                                $scope.TotalPages['Cash'] = [];
                                $scope.Data['Cash'] = [];
                                $scope.setPage(0, 'Cash');
                            }
                        }
                    }
                }).error(function (err) {
                $scope.$parent.MsgError(err);
                if ($scope.Step == 'detail') {
                    // 單一會員報表資料清空
                    $scope.TotalPages['Detail'] = [];
                    $scope.setPage(0, 'Detail');
                } else {
                    // 信用報表資料清空
                    $scope.TotalPages['Credit'] = [];
                    $scope.Data['Credit'] = [];
                    $scope.setPage(0, 'Credit');

                    // 現金報表資料清空
                    $scope.TotalPages['Cash'] = [];
                    $scope.Data['Cash'] = [];
                    $scope.setPage(0, 'Cash');
                }
            });
            $scope.$parent.CloseLoading();
        };

        // 設定搜尋的代理資料
        $scope.SetSearch = function (_data, _level) {
            console.log('_data:', _data)
            switch (_level) {
                case 'sagent':
                    $scope.SearchSAgentName = angular.copy(_data.name)
                    $scope.SearchSAgentAccount = angular.copy(_data.account)
                    $scope.SearchSAgentUID = angular.copy(_data.sagent_uid)
                    $scope.SearchUID = _data.sagent_uid
                    $scope.Step = 'agent'
                    break;
                case 'agent':
                    $scope.SearchAgentName = angular.copy(_data.name)
                    $scope.SearchAgentAccount = angular.copy(_data.account)
                    $scope.SearchAgentUID = angular.copy(_data.agent_uid)
                    $scope.SearchUID = _data.agent_uid
                    $scope.Step = 'user'
                    $scope.Search()
                    break;
                case 'user':
                    $scope.SearchUserName = angular.copy(_data.name)
                    $scope.SearchUserAccount = angular.copy(_data.account)
                    $scope.SearchUserUID = angular.copy(_data.uid)
                    $scope.SearchUID = _data.uid
                    $scope.Step = 'detail'
                    $scope.Search()
                    break;
            }
        };

        // 往回倒退
        $scope.BackToReport = function (_level) {
            switch (_level) {
                case 'agent':
                    $scope.SearchAgentAccount = ''
                    $scope.SearchUserAccount = ''
                    $scope.SearchUID = angular.copy($scope.SearchSAgentUID)
                    $scope.Step = _level
                    // 回總代報表
                    $scope.Search('sagent')
                    break;
                case 'user':
                    $scope.SearchUserAccount = ''
                    $scope.SearchUID = angular.copy($scope.SearchAgentUID)
                    $scope.Step = _level
                    // 回代理報表
                    $scope.Search('agent')
                    break;
                default:
                    $scope.Reset();
            }

        };

        // Init
        function Init() {
            $scope.$parent.ShowLoading();
            $scope.$parent.GoTop(); // 滾動至頁頂
            $scope.Reset();
            console.log('UserData:', $rootScope.UserData)
            $scope.$parent.CloseLoading();
        }
        Init();
    }
})();
