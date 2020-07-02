(function () {
    'use strict';
    angular.module('mainApp').controller('mainCtrl', mainCtrl);

    function mainCtrl($scope, $state, $timeout) {

        $scope.CopyrightYear = (new Date()).getFullYear();

        // Show Loading
        $scope.ShowLoading = function () {
            $scope.$parent.Loading = true;
        };

        // Close Loading
        $scope.CloseLoading = function () {
            var Already = $timeout(function () {
                $scope.Loading = false;
                $scope.stop = function(){
                    $timeout.cancel(Already);
                };
            },500);
        };

        // 滾動頁頂
        $scope.GoTop = function () {
            $('html,body').animate({
                scrollTop: 0
            }, 350);
        };

        // Mobile版漢堡盒動畫
        angular.element(".ShowMenu").on("click", function () {
            $('.animated-icon').stop().toggleClass('open');
            var navMenuCont = $($(this).data('target'));
            navMenuCont.animate({
                'width': 'toggle'
            }, 350);
            $(".menu-overlay").fadeToggle(500);
        });

        angular.element(".menu-overlay").on("click", function () {
            $(".ShowMenu").trigger("click");
            $(".menu-overlay").fadeOut(500);
        });

        // Init
        function Init() {
            $scope.ShowLoading();
            $scope.GoTop();
            // console.log('main');
            $scope.CloseLoading();
        }
        Init();
    }
})();
