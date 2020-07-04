(function () {
    'use strict';

    var app = angular.module('mainApp', ["ui.router", "ui.bootstrap", "ngSanitize", "ngAnimate"]);
    app.config(['$interpolateProvider', function ($interpolateProvider) {
            $interpolateProvider.startSymbol('[{');
            $interpolateProvider.endSymbol('}]');
    }]).config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/main");
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
            // 客戶管理
            .state('main.manager', {
                url: '/manager',
                templateUrl: ('/98ky_website/html/manager.html'+Version)
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
    });
})();
