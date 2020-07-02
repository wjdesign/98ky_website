(function () {
    'use strict';
    angular.module('mainApp').controller('aboutCtrl', aboutCtrl);

    function aboutCtrl($scope, $state, $timeout, $stateParams) {

        // 取得頁數
        $scope.GetTotalPage = function() {
            $scope.TotalPage = 4;   // 總頁數
            $scope.PageRange = [];
            for(let i=1;i<=$scope.TotalPage;i++) {
                $scope.PageRange.push(i);
            }
            $scope.Page = 1;    // 預設頁數
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

        // 切換地區
        $scope.ChangeArea = function (_area) {
            if (_area == 'All') {
                $scope.SelectArea = 'All';
            } else {
                $scope.SelectArea = _area;
            }
            $state.go($state.current.name, {area: _area});
            $scope.GetTotalPage();
            $scope.TeamData = $scope.Data.team[$scope.SelectArea];
            $scope.PlanData = $scope.Data.plan[$scope.SelectArea];
        };

        // 隊名搜尋
        $scope.SearchTeam = function () {
            if ($scope.Search) {
                console.log(`搜尋隊名：${$scope.Search}`);
            } else {
                alert('請輸入隊名進行搜尋');
                angular.element('#search').focus();
            }
        };

        // Init
        function Init() {
            $scope.$parent.ShowLoading();
            $scope.$parent.GoTop(); // 滾動至頁頂
            $scope.Data = Data;     // 取得data.js的假資料
            $scope.GetTotalPage();  // 取得頁數
            if ($state.params.area) {
                $scope.SelectArea = $state.params.area;
            } else {
                $scope.SelectArea = 'All';
            }
            $scope.TeamData = $scope.Data.team[$scope.SelectArea];
            $scope.PlanData = $scope.Data.plan[$scope.SelectArea];
            console.log('about');
            console.log();
            $scope.$parent.CloseLoading();
        }
        Init();
    }
})();
