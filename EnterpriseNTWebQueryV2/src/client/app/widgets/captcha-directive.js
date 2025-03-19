/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('captchadirective', captchadirective);

    captchadirective.$inject = [];

    /* @ngInject */
    function captchadirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/captcha-directive.html',
            scope: {
                view: '=?view'
            },

            controller: ['$scope', '$filter', function ($scope, $filter) {
                var vm = this;
                vm.Captcha = Captcha;
                vm.validCaptcha = validCaptcha;
                vm.removeSpaces = removeSpaces;
                vm.errorcaptchan = false;
                vm.Captcha();
                vm.dynamicPopover = {
                    templateUrl: 'myPopoverTemplate.html',
                    title: $filter('translate')('0240')
                };
                function Captcha() {
                    var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0');
                    var i;
                    for (i = 0; i < 6; i++) {
                        var a = alpha[Math.floor(Math.random() * alpha.length)];
                        var b = alpha[Math.floor(Math.random() * alpha.length)];
                        var c = alpha[Math.floor(Math.random() * alpha.length)];
                        var d = alpha[Math.floor(Math.random() * alpha.length)];
                        var e = alpha[Math.floor(Math.random() * alpha.length)];
                        var f = alpha[Math.floor(Math.random() * alpha.length)];
                        var g = alpha[Math.floor(Math.random() * alpha.length)];
                    }
                    var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
                    vm.code = code;
                }
                function validCaptcha() {
                    vm.validatedcapchat = false;
                    var string = vm.removeSpaces(vm.code)
                    if (string != vm.captchadata) {
                        vm.Captcha();
                        vm.captchadata = '';
                        vm.errorcaptchan = true;
                    } else {
                        vm.errorcaptchan = false;
                        vm.validatedcapchat = true;
                        $scope.view = true;
                    }
                }
                function removeSpaces(string) {
                    return string.split(' ').join('');
                }
            }],
            controllerAs: 'captchadirective'
        };
        return directive;
    }
})();
/* jshint ignore:end */



