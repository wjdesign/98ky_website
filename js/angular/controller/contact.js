(function () {
    'use strict';
    angular.module('mainApp').controller('contactCtrl', contactCtrl);

    function contactCtrl($scope, $state, $timeout) {

        // 取得頁數
        $scope.GetTotalPage = function() {
            $scope.TotalPage = 4;   // 總頁數
            $scope.PageRange = [];
            for(let i=1;i<=$scope.TotalPage;i++) {
                $scope.PageRange.push(i);
            }
            $scope.Page = 1;        // 預設頁數
        };

        // 跳轉到指定頁數
        $scope.ChangePage = function (_page) {
            $scope.Page = _page;
        };

        // 加減頁數
        $scope.AddPage = function (_num) {
            if ($scope.PageRange.includes($scope.Page + _num)) {
                $scope.Page+=_num;
            }
        };

        // Init
        function Init() {
            $scope.$parent.ShowLoading();
            $scope.$parent.GoTop(); // 滾動至頁頂
            $scope.GetTotalPage();  // 取得頁數
            // console.log('contact');
            $scope.$parent.CloseLoading();
        }
        Init();
    }
})();
