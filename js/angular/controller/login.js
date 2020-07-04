(function () {
    'use strict';
    angular.module('mainApp').controller('loginCtrl', loginCtrl);

    function loginCtrl($scope, $state, $timeout) {

        // 登入
        $scope.login = function () {
            console.log('login');
            $state.go('main');
        };

        // Init
        function Init() {
        }
        Init();
    }
})();
