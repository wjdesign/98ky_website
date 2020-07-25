(function () {
    'use strict';

    var app = angular.module('mainApp', ["LocalStorageModule", "ui.router", "ui.bootstrap", "ngSanitize", "ngAnimate"]);
    app.config(['$interpolateProvider', function ($interpolateProvider) {
            $interpolateProvider.startSymbol('[{');
            $interpolateProvider.endSymbol('}]');
    }]).config(function($stateProvider, $urlRouterProvider) {

        // $urlRouterProvider.otherwise("/main/dashboard");
        $urlRouterProvider
            .when("", "/main/dashboard")
            .when("/main", "/main/dashboard");

        $stateProvider
        // 外層
            // 登入
            .state('login', {
                url: '/login',
                templateUrl: ('/98ky_website/html/login.html'+Version),
                controller: 'loginCtrl'
            })
            // 外框
            .state('main', {
                url: '/main',
                templateUrl: ('/98ky_website/html/main.html'+Version),
                controller: 'mainCtrl'
            })
            // 基本資訊
            .state('main.dashboard', {
                url: '/dashboard',
                templateUrl: ('/98ky_website/html/dashboard.html'+Version)
            })
            // 代理管理
            .state('main.manager', {
                url: '/manager',
                templateUrl: ('/98ky_website/html/manager.html'+Version),
                controller: 'managerCtrl'
            })
            // 額度管理
            .state('main.amount', {
                url: '/amount',
                templateUrl: ('/98ky_website/html/amount.html'+Version)
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
                templateUrl: ('/98ky_website/html/account.html'+Version)
            })

    }).directive('closeCollapse', function() {
        // Mobile版關閉漢堡盒
        return function(scope, element, attrs) {
            link: {
                element.bind('click',function(){
                    $(".ShowMenu").trigger("click");
                    $(".menu-overlay").fadeOut(500);
                })
            }
        }
    }).directive('numbersOnly', function () {
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
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, modelCtrl) {
                modelCtrl.$formatters.push(function(modelValue){
                    return new Date(modelValue);
                })
            }
        }
    }).factory('PagerService', PagerService);

    app.constant('ngAppSettings', {
        baseUri: baseURL
    });

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
