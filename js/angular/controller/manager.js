(function () {
    'use strict';
    angular.module('mainApp').controller('managerCtrl', managerCtrl);

    function managerCtrl($scope, $rootScope, $state, $timeout, localStorageService, ngAppSettings, $http, PagerService) {

        $scope.DivideRange = [
            { label: '0%', value: 0 },
            { label: '10%', value: 10 },
            { label: '20%', value: 20 },
            { label: '30%', value: 30 },
            { label: '40%', value: 40 },
            { label: '50%', value: 50 },
            { label: '60%', value: 60 },
            { label: '70%', value: 70 },
            { label: '80%', value: 80 },
            { label: '90%', value: 90 },
            { label: '100%', value: 100 }
        ];
        $scope.setPage = function (page) {
            if (page < 1 || page > $scope.Pager.totalPages) {
                return;
            }
            // get pager object from service
            $scope.Pager = PagerService.GetPager($scope.TotalPages.length, page, 10);
            // get current page of items
            $scope.ShowData = $scope.TotalPages.slice($scope.Pager.startIndex, $scope.Pager.endIndex + 1);
        };

        // 顯示備註用
        $scope.ShowComment = function (_comment) {
            swal({
                title: _comment,
                icon: 'info',
                showConfirmButton: false
            });
        };

        // 切換點數類型
        $scope.ChangeStatus = function (_status) {
            $scope.Status = _status
        };

        // 建立總代理
        $scope.SetSagentRegister = function () {
            if ($scope.RegisterSagentData.CheckPassword == '' || $scope.RegisterSagentData.Password != $scope.RegisterSagentData.CheckPassword) {
                swal({
                    title: '密碼與確認密碼不符',
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                }).then(function() {
                    $('#AgentPassWD').val('');
                    $('#AgentPassWDConfirm').val('');
                });
            } else if ($scope.RegisterSagentData.Password.length < 8) {
                swal({
                    title: '設定的密碼有誤',
                    type: 'warning',
                    showCancelButton: false,  //顯示取消按鈕
                }).then(function() {
                    $('#SagentPassWD').val('');
                    $('#SagentPassWDConfirm').val('');
                });
            } else {
                // 送出建立
                var defaultpath = ngAppSettings.baseUri + '/insert_sagent.php';
                $scope.urlpath = defaultpath;
                var data = $.param({
                    'account': $scope.RegisterSagentData.Account,
                    'name': $scope.RegisterSagentData.Name,
                    'password': $scope.RegisterSagentData.Password,
                    'amount': $scope.RegisterSagentData.Credit,
                    'comment': $scope.RegisterSagentData.Comment,

                });
                $scope.$parent.ShowLoading();
                $http.post($scope.urlpath,data,config)
                    .success(function (response) {
                        if (response.errCode === 0) {
                            swal({
                                title: '建立成功',
                                type: 'success',
                                showCancelButton: false,  //顯示取消按鈕
                            }).then(function() {
                                $scope.RegisterSagentData = {}; // 清空註冊資訊
                                $('#AddSagent').modal('hide');
                                $scope.Account = '';
                                $scope.Search();
                            });
                        }
                    }).error(function (err) {
                    $scope.$parent.MsgError(err);
                });
                $scope.$parent.CloseLoading();
            }
        };

        // 新增資料彈窗
        $scope.ShowAddData = function (_data) {
            if ($scope.Step == 'sagent') {
                $scope.AddData.UpUid = _data.uid;
                $scope.AddData.UpAccount = _data.account;
                $('#AddItem').modal('show');
            }
        };

        // 送出新增資料
        $scope.SetAddData = function () {
            if ($scope.AddData.Password) {
                if ($scope.AddData.Password.length < 8) {
                    swal({
                        title: '設定的密碼有誤',
                        type: 'warning',
                        showCancelButton: false,  //顯示取消按鈕
                    }).then(function() {
                        $('#AddDataPassWD').val('');
                        $('#AddDataPassWDConfirm').val('');
                    });
                    return
                } else if ($scope.AddData.Password != $scope.AddData.CheckPassword) {
                    swal({
                        title: '密碼與確認密碼不符',
                        type: 'warning',
                        showCancelButton: false,  //顯示取消按鈕
                    }).then(function() {
                        $('#AddDataPassWD').val('');
                        $('#AddDataPassWDConfirm').val('');
                    });
                    return
                }
                var defaultpath = ngAppSettings.baseUri + '/insert_agent.php';
                $scope.urlpath = defaultpath;
                var data = $.param({
                    'uid': $scope.AddData.UpUid,
                    'account': $scope.AddData.Account,
                    'name': $scope.AddData.Name,
                    'password': $scope.AddData.Password,
                    'amount': $scope.AddData.Credit,
                    'comment': $scope.AddData.Comment
                });
                $scope.$parent.ShowLoading();
                $http.post($scope.urlpath, data, config)
                    .success(function (response) {
                        swal({
                            title: "建立成功",
                            type: 'success',
                            showCancelButton: false,  //顯示取消按鈕
                        }).then(function () {
                            $scope.AddData = {};
                            $('#AddItem').modal('hide');
                            $scope.Search();
                        });
                    }).error(function (err) {
                    $scope.$parent.MsgError(err);
                });
                $scope.$parent.CloseLoading();
            }
        };

        // 修改資料彈窗
        $scope.ShowModifyData = function (_data) {
            $scope.ModifyData = {};
            switch ($scope.Step) {
                case "sagent":
                    $scope.ModifyData.Uid = _data.uid;
                    $scope.ModifyData.Account = _data.account;
                    $scope.ModifyData.Name = _data.name;
                    $scope.ModifyData.Password = '';
                    $scope.ModifyData.CheckPassword = '';
                    $scope.ModifyData.Status = _data.status;
                    $scope.ModifyData.Credit = _data.balance;
                    $scope.ModifyData.Comment = _data.comment;
                    break;
                case "agent":
                    $scope.ModifyData.Uid = _data.uid;
                    $scope.ModifyData.Account = _data.account;
                    $scope.ModifyData.Name = _data.name;
                    $scope.ModifyData.Password = '';
                    $scope.ModifyData.CheckPassword = '';
                    $scope.ModifyData.Status = _data.status;
                    $scope.ModifyData.Credit = _data.balance;
                    $scope.ModifyData.Comment = _data.comment;
                    $scope.ModifyData.Sagent_Divide = _data.sagent_divide;
                    $scope.ModifyData.Agent_Divide = _data.agent_divide;
                    break;
                case "user":
                    $scope.ModifyData.Uid = _data.uid;
                    $scope.ModifyData.Account = _data.account;
                    $scope.ModifyData.Name = _data.name;
                    $scope.ModifyData.Password = '';
                    $scope.ModifyData.CheckPassword = '';
                    $scope.ModifyData.Status = _data.status;
                    $scope.ModifyData.Credit = _data.balance;
                    $scope.ModifyData.CashType = _data.cash_type;
                    $scope.ModifyData.Limit = _data.single_limit;
                    break;
            }
            $('#ModifyItem').modal('show');
        };

        // 送出修改資料
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
            var data, defaultpath;
            switch ($scope.Step) {
                case "sagent":
                    // 修改總代資料
                    defaultpath = ngAppSettings.baseUri + '/update_sagent.php';
                    data = $.param({
                        'uid': $scope.ModifyData.Uid,
                        'name': $scope.ModifyData.Name,
                        'status': $scope.ModifyData.Status,
                        'comment': $scope.ModifyData.Comment
                    });
                    break;
                case "agent":
                    // 修改代理資料
                    defaultpath = ngAppSettings.baseUri + '/update_agent.php';
                    data = $.param({
                        'uid': $scope.ModifyData.Uid,
                        'name': $scope.ModifyData.Name,
                        'status': $scope.ModifyData.Status,
                        'comment': $scope.ModifyData.Comment,
                        'sagent_divide': $scope.ModifyData.Sagent_Divide,
                        'agent_divide': $scope.ModifyData.Agent_Divide
                    });
                    break;
                case "user":
                    // 修改會員資料
                    defaultpath = ngAppSettings.baseUri + '/update_user.php';
                    data = $.param({
                        'uid': $scope.ModifyData.Uid,
                        'name': $scope.ModifyData.Name,
                        'status': $scope.ModifyData.Status,
                        'cash_type': $scope.ModifyData.CashType,
                        'single_limit': $scope.ModifyData.Limit
                    });
                    break;
            }
            $scope.urlpath = defaultpath;
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

        // 修改占成設定
        $scope.ModifyDivide = function (_level) {
            if (_level == 'sagent') {
                $scope.ModifyData.Agent_Divide = 100 - $scope.ModifyData.Sagent_Divide;
            } else {
                $scope.ModifyData.Sagent_Divide = 100 - $scope.ModifyData.Agent_Divide;
            }
        };

        // 額度紀錄彈窗
        $scope.ShowAmount = function (_data) {
            $scope.AmountData = {};     // 額度紀錄model資料
            $scope.AmountData.Account = _data.account;
            $scope.AmountData.Uid = _data.uid;
            $scope.AmountData.Name = _data.name;
            $scope.AmountData.Credit = _data.balance;
            $scope.AmountData.Amount = '';
            $scope.AmountData.Password = '';
            $('#Amount').modal('show');
            $scope.GetAmountReport();
        };

        // 取額度紀錄
        $scope.GetAmountReport = function () {
            var data, defaultpath;
            switch ($scope.Step) {
                case "sagent":
                    defaultpath = ngAppSettings.baseUri + '/sagentAmountLog.php';
                    break;
                case "agent":
                    defaultpath = ngAppSettings.baseUri + '/agentAmountLog.php';
                    break;
                case "user":
                    defaultpath = ngAppSettings.baseUri + '/userAmountLog.php';
                    break;
                default:
                    swal({
                        title: '身份錯誤',
                        type: 'warning',
                        showCancelButton: false,
                    });
                    return
            }
            data = $.param({
                'uid': $scope.AmountData.Uid
            });
            $scope.urlpath = defaultpath;
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    $scope.AmountReportData = response.data || []
                }).error(function (err) {
                $scope.AmountReportData = [];
            });
            $scope.$parent.CloseLoading();
        };

        // 送出上分
        $scope.SetAmountData = function () {
            var data, defaultpath;
            switch ($scope.Step) {
                case "sagent":
                    defaultpath = ngAppSettings.baseUri + '/transport_adminTosagent.php';
                    break;
                case "agent":
                    defaultpath = ngAppSettings.baseUri + '/transport_agent.php';
                    break;
                case "user":
                    defaultpath = ngAppSettings.baseUri + '/transport_credit.php';
                    break;
                default:
                    swal({
                        title: '身份錯誤',
                        type: 'warning',
                        showCancelButton: false,
                    });
                    return
            }
            data = $.param({
                'uid': $scope.AmountData.Uid,
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
                            $('#Amount').modal('hide');
                            $scope.Search();
                        });
                    }
                }).error(function (err) {
                $scope.$parent.MsgError(err);
            });
            $scope.$parent.CloseLoading();
        };

        // 取列表
        $scope.Search = function (_type) {
            var data, defaultpath;
            switch ($scope.Step) {
                case 'sagent':
                    defaultpath = ngAppSettings.baseUri + '/sagent_list.php';
                    data = $.param({
                        'status': $scope.Status,
                        'download': _type || null
                    });
                    break;
                case 'agent':
                    defaultpath = ngAppSettings.baseUri + '/agent_list.php';
                    data = $.param({
                        'status': $scope.Status,
                        'uid': $scope.SearchUID,
                        'download': _type || null
                    });
                    $scope.Account = '';
                    break;
                case 'user':
                    defaultpath = ngAppSettings.baseUri + '/user_list.php';
                    data = $.param({
                        'status': $scope.Status,
                        'uid': $scope.SearchUID,
                        'download': _type || null
                    });
                    $scope.Account = '';
                    break;
            }
            $scope.urlpath = defaultpath;
            $scope.$parent.ShowLoading();
            $http.post($scope.urlpath,data,config)
                .success(function (response) {
                    if (_type && _type == 'pdf') {
                        // 導出報表
                        if (response.data) {
                            $scope.DownloadFile(response.data, "代理列表", _type);
                        } else {
                            swal({
                                title: "找不到檔案連結",
                                icon: 'warning',
                                showConfirmButton: false
                            });
                        }
                    } else {
                        if (response.data) {
                            $scope.OriginData = angular.copy(response.data)
                            $scope.Data = response.data
                            $scope.Pager = {};          // 頁數資料
                            $scope.TotalPages = _.range(0, response.data.length);
                            $scope.setPage(1);
                        } else {
                            $scope.OriginData = [];
                            $scope.Data = [];
                            $scope.Pager = {};
                            $scope.TotalPages = [];
                            $scope.setPage(0);
                        }
                    }
                }).error(function (err) {
                $scope.$parent.MsgError(err);
                $scope.OriginData = [];
                $scope.Data = [];
                $scope.Pager = {};
                $scope.TotalPages = [];
                $scope.setPage(0);
            });
            $scope.$parent.CloseLoading();
        };

        // 設定搜尋的代理資料
        $scope.SetSearch = function (_data) {
            switch ($scope.Step) {
                case 'sagent':
                    $scope.SearchSAgentName = angular.copy(_data.name)
                    $scope.SearchSAgentAccount = angular.copy(_data.account)
                    $scope.SearchSAgentUID = angular.copy(_data.uid)
                    $scope.SearchUID = _data.uid
                    $scope.Step = 'agent'
                    $scope.Search()
                    break;
                case 'agent':
                    $scope.SearchAgentName = angular.copy(_data.name)
                    $scope.SearchAgentAccount = angular.copy(_data.account)
                    $scope.SearchAgentUID = angular.copy(_data.uid)
                    $scope.SearchUID = _data.uid
                    $scope.Step = 'user'
                    $scope.Search()
                    break;
            }
        };

        // 往回倒退
        $scope.BackToReport = function (_level) {
            switch (_level) {
                case 'sagent':
                    $scope.SearchSAgentAccount = ''
                    $scope.SearchAgentAccount = ''
                    $scope.SearchUID = angular.copy($scope.SearchSAgentUID)
                    $scope.Step = _level
                    // 回總代報表
                    $scope.Search()
                    break;
                case 'agent':
                    $scope.SearchAgentAccount = ''
                    $scope.SearchUID = angular.copy($scope.SearchSAgentUID)
                    $scope.Step = _level
                    // 回代理報表
                    $scope.Search()
                    break;
                default:
                    $scope.Reset();
            }

        };

        // 帳號搜尋(前端過濾)
        $scope.FilterAccount = function () {
            if ($scope.OriginData.length > 0) {
                if (!$scope.Account) {
                    $scope.Data = $scope.OriginData
                    $scope.TotalPages = _.range(0, $scope.OriginData.length);
                } else {
                    var datas = []
                    $scope.OriginData.filter(function (data) {
                        if (data.account.indexOf($scope.Account) > -1) {
                            datas.push(data)
                        }
                    });
                    $scope.Data = datas
                    $scope.TotalPages = _.range(0, datas.length);
                }
                $scope.Pager = {};          // 頁數資料
                $scope.setPage(1);
            }
        };

        // Reset
        $scope.Reset = function () {
            $scope.Status = 'All';      // 查詢狀態
            $scope.CanAddSagent = false;// 可否建立總代理
            switch ($rootScope.UserData.level) {
                case "5":
                case "4":
                    $scope.Step = 'sagent';
                    $scope.CanAddSagent = true;
                    break;
                case "3":
                case "2":
                    $scope.Step = 'agent';
                    $scope.SearchUID = $rootScope.UserData.Uid;
                    break;
                case "1":
                    $scope.Step = 'user';
                    $scope.SearchUID = $rootScope.UserData.Uid;
                    break;
            }
            $scope.Account = '';        // 帳號搜尋
            $scope.RegisterSagentData = {};   // 新增的總代model資料
            $scope.AddData = {};        // 新增的model資料
            $scope.ModifyData = {};     // 修改的model資料
            $scope.AmountData = {};     // 額度紀錄model資料
            $scope.Search();
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
