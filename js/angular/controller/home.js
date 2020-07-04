(function () {
    'use strict';
    angular.module('mainApp').controller('homeCtrl', homeCtrl);

    function homeCtrl($scope, $state, $timeout) {
        // Init
        function Init() {
            $scope.$parent.ShowLoading();
            $scope.$parent.GoTop(); // 滾動至頁頂
            $scope.$parent.CloseLoading();
        }
        Init();
    }
})();
