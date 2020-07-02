(function () {
    'use strict';
    angular.module('mainApp').controller('homeCtrl', homeCtrl);

    function homeCtrl($scope, $state, $timeout) {

        // 輪播廣告
        $scope.RunCarousel = function () {
            $(function () {
                $('#Banner').slick({
                    autoplay: true,
                    autoplaySpeed: 3500,
                    dots: true,
                    prevArrow: $('.prev'),
                    nextArrow: $('.next')
                });
            });
        };

        // 活動成果
        $scope.RunActive = function () {
            $(function () {
                $('#activeSlide').slick({
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    autoplay: false,
                    // autoplaySpeed: 3500,
                    dots: false,
                    prevArrow: $('.activePrev'),
                    nextArrow: $('.activeNext'),
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        }
                    ]
                });
            });
        };

        // 生成QRCode
        $scope.MakeQRCode = function () {
            $('#QRCode').qrcode({
                width: 100,
                height: 100,
                text: 'https://layout.wjdesign.cf/EPB_website/#/home'
            });
        };

        // Init
        function Init() {
            $scope.$parent.ShowLoading();
            $scope.$parent.GoTop(); // 滾動至頁頂
            $scope.Data = Data;     // 取得data.js的假資料
            // console.log('home');
            $scope.RunCarousel();
            $scope.RunActive();
            $scope.MakeQRCode();
            $scope.$parent.CloseLoading();
        }
        Init();
    }
})();
