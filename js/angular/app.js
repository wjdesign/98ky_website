(function () {
    'use strict';

    var app = angular.module('mainApp', ["LocalStorageModule", "ui.router", "ui.bootstrap", "ngSanitize", "ngAnimate"]);
    app.config(['$interpolateProvider', function ($interpolateProvider) {
            $interpolateProvider.startSymbol('[{');
            $interpolateProvider.endSymbol('}]');
    }]).config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .when("", "/main/dashboard")
            .when("/login", "/login/")
            .when("/main", "/main/dashboard");

        $stateProvider
        // 外層
            // 登入
            .state('login', {
                url: '/login/:lv',
                templateUrl: ('/98ky_website/html/login.html'+Version),
                controller: 'loginCtrl'
            })
            // 外框
            .state('main', {
                url: '/main',
                templateUrl: ('/98ky_website/html/main.html'+Version),
                controller: 'mainCtrl',
                resolve: {
                    UserData: GetUserData
                }
            })
            // 基本資訊
            .state('main.dashboard', {
                url: '/dashboard',
                templateUrl: ('/98ky_website/html/dashboard.html'+Version)
            })
            // 客戶管理
            .state('main.manager', {
                url: '/manager',
                templateUrl: ('/98ky_website/html/manager.html'+Version),
                controller: 'managerCtrl'
            })
            // 額度管理
            .state('main.amount', {
                url: '/amount',
                templateUrl: ('/98ky_website/html/amount.html'+Version),
                controller: 'amountCtrl'
            })
            // 報表查詢
            .state('main.report', {
                url: '/report',
                templateUrl: ('/98ky_website/html/report.html'+Version),
                controller: 'reportCtrl'
            })
            // 歷史開獎
            .state('main.result', {
                url: '/result',
                templateUrl: ('/98ky_website/html/result.html'+Version),
                controller: 'resultCtrl'
            })
            // 帳號設定
            .state('main.account', {
                url: '/account',
                templateUrl: ('/98ky_website/html/account.html'+Version),
                controller: 'accountCtrl'
            })
            // 操作紀錄
            .state('main.record', {
                url: '/record',
                templateUrl: ('/98ky_website/html/record.html'+Version),
                controller: 'recordCtrl'
            });

        // 取Auth資料後再進入main
        async function GetUserData(ngAppSettings, $http, $state, localStorageService) {
            var Data, UID;
            if (localStorageService.get('token')) {
                UID = localStorageService.get('token');
                config.headers.token = UID;
                var defaultpath = ngAppSettings.baseUri + '/auth.php';
                await $http.post(defaultpath,{},config).then(function (response) {
                    if (response.data.errCode === 0) {
                        Data = response.data.data;
                    }
                });
            }
            return Data
        }

    }).directive('numbersOnly', function () {
        // 限制input只能輸入數字(type必須為text)
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.push(function (input) {
                    if (input == undefined) return '';
                    var inputNumber = input.toString().replace(/[^0-9]/g, '');
                    if (inputNumber != input) {
                        ctrl.$setViewValue(inputNumber);
                        ctrl.$render();
                    }
                    return parseInt(inputNumber);
                });
            }
        };
    }).directive("formatDate", function(){
        // 格式化input的date格式(type必須為datetime-local)
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, modelCtrl) {
                modelCtrl.$formatters.push(function(modelValue){
                    return new Date(modelValue);
                })
            }
        }
    }).directive('toolTip', function(){
        // 解決angular與bootstrap的tooltip執行序的衝突
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                element.hover(function(){
                    // on mouseenter
                    element.tooltip('show');
                }, function(){
                    // on mouseleave
                    element.tooltip('hide');
                });
            }
        };
    }).factory('PagerService', PagerService);

    app.constant('ngAppSettings', {
        baseUri: baseURL
    });

    // 頁碼service
    function PagerService() {
        // service definition
        var service = {};

        service.GetPager = GetPager;

        return service;

        // service implementation
        function GetPager(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || 10;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }
    }
})();
