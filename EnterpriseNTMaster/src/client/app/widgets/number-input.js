/* jshint ignore:start */
(function () {
    var app = angular.module('number-input', []);

    app.directive('numberInput', function () {
        return {
            restrict: 'EA',

            templateUrl: 'app/widgets/number-input.html',

            scope: {
                model: '=ngModel',
                onChange: '&ngChange',
                start: '=?start',
                min: '=?min',
                max: '=?max',
                step: '=?step',
                hint: '@?hint',
                hideHint: '=?hideHint',
                disabledecimal: '=?disabledecimal',
                decimalplaces: '=decimalplaces',
                aligntext: '=?aligntext',
                prefix: '@?prefix',
                postfix: '@?postfix',
                options: '=?options',
                disable: '=?disable',
                acceptclean: '=?acceptclean',
                blurexit: '=?blurexit',
                id: '=?id',
                name: '=?name'
            },

            controller: ['$scope', function ($scope) {

                // used to validate key presses
                var prevKey = null;

                var KEY_ZERO = 48;
                var KEY_NINE = 57;
                var KEY_PERIOD = 190;
                var KEY_DASH = 189;
                var KEY_SPACE = 32;
                var KEY_POINT = 110;

                this.id = $scope.id;
                this.name = $scope.name;
                this.aligntext = "'" + $scope.aligntext + "'";
                var decimals = $scope.disabledecimal ? 0 : $scope.decimalplaces;
                var stepvar = $scope.step < 1 ? 1 : Math.round($scope.step);
                // try{$scope.decimalplaces = $scope.disabledecimal ? 0 : $scope.decimalplaces;}catch(e){}

                //$scope.decimalplaces = $scope.decimalplaces == 0 ? 1 : $scope.decimalplaces;
                // $scope.model = $scope.start || 0;




                // allow custom onChange functions
                $scope.$watch('model', function () {
                    $scope.onChange();
                });


                // increment model by step
                this.inc = function () {
                    if (isMaxed() || prevKey != null)
                        return;

                    //$scope.model += $scope.step; num
                    $scope.model = parseFloat($scope.model) + (stepvar / Math.pow(10, decimals));
                    validate();

                    // angular.element('#' + $scope.idcontrol).focus(); 
                    // var star = $('#' + $scope.idcontrol)[0].selectionStart;
                    // if (star <= 2) { 
                    //   star = 3; 
                    // } 
                    // angular.element('#' + $scope.idcontrol)[0].selectionStart = 0;

                };

                // decrement model by step
                this.dec = function () {
                    if (isMinnd() || prevKey != null)
                        return;

                    //$scope.model -= $scope.step;
                    $scope.model = parseFloat($scope.model) - (stepvar / Math.pow(10, decimals));
                    validate();
                    // angular.element('#' + $scope.idcontrol).focus();
                };

                this.onKeyPress = function (e) {
                    if (e.keyCode == KEY_SPACE)
                        validate();

                    if (e.keyCode === 38) this.inc();
                    if (e.keyCode === 40) this.dec();

                    if (validKey(e.keyCode))
                        prevKey = e.keyCode;
                };

                this.onChange = function () {
                    if (!isModelMaxLength()) {
                        return;
                    }

                    // skip validation for certain keys
                    if (prevKey == KEY_PERIOD ||
                        prevKey == KEY_DASH ||
                        (prevKey == KEY_ZERO && numberHasDecimal($scope.model))) return;

                    validate();
                };

                // when the input goes up of key
                this.onKeyUp = function (e) {
                    if (e.keyCode !== KEY_POINT || $scope.disabledecimal)
                        validate();

                    if ($scope.acceptclean === false || $scope.acceptclean === undefined) {
                        if (!$scope.model)
                            $scope.model = $scope.start || 0;
                    }
                };
                // when the input goes out of focus
                this.onBlur = function (e) {
                    validate();

                    if ($scope.acceptclean === false || $scope.acceptclean === undefined) {
                        if (!$scope.model)
                            $scope.model = $scope.start || 0;
                    }

                    if ($scope.blurexit !== undefined) {
                        $scope.blurexit();
                    }

                };
                // when the input goes in of focus
                this.onFocus = function (e) {
                    e.target.selectionStart = 0;
                    e.target.selectionEnd = e.target.value.length;
                };
                this.hasdisabled = function () {
                    return $scope.disable;
                };
                this.hasPrefix = function () {
                    return !this.prefix == '';
                };

                this.hasPostfix = function () {
                    return !this.postfix == '';
                };

                this.getWidth = function () {
                    var w = 0;

                    if (this.hasPrefix() && this.hasPostfix()) {
                        w = $('#number-input-prefix-id').outerWidth() +
                            $('#number-input-postfix-id').outerWidth()
                    } else if (this.hasPrefix()) {
                        w = $('#number-input-prefix-id').outerWidth()
                    } else if (this.hasPostfix()) {
                        w = $('#number-input-postfix-id').outerWidth()
                    }

                    return {
                        width: $('#number-input-container-id').outerWidth() -
                            $('#number-input-btns-container-id').outerWidth() - w
                    };
                };

                var isModelMaxLength = function () {
                    //if (!isMaxValid() || !isMinValid())
                    //  return true;

                    // the length of the input only needs to be checked if both the max AND min are
                    // 1. positive
                    // 2. negative
                    // if (!(($scope.max >= 0 && $scope.min >= 0) || ($scope.max <= 0 && $scope.min <= 0)))
                    //   return true;

                    // make sure decimal places are accounted for in model length
                    var decimalLen = $scope.decimalplaces + ($scope.decimalplaces > 0 ? 1 : 0);

                    var maxStrLen = $scope.max.toString().length + decimalLen;
                    var minStrLen = $scope.min.toString().length + decimalLen;
                    var maxLen = (maxStrLen > minStrLen) ? maxStrLen : minStrLen;

                    var modelStr = $scope.model.toString();
                    var numberOfDecimals = getdecimalplaces(modelStr);

                    // max string length
                    // 1. actual string length
                    // 2. max decimal places
                    if (modelStr.length > maxLen || numberOfDecimals > $scope.decimalplaces) {
                        $scope.model = parseFloatForModel(modelStr.substring(0, modelStr.length - 1));
                    }

                    return (maxLen == $scope.model.toString().length) || (numberOfDecimals > 0 && numberOfDecimals == $scope.decimalplaces);
                }

                var getHint = function () {
                    if ($scope.hideHint) {
                        // hide hint if no max/min were given
                        if ((!isMaxValid() && !isMinValid()))
                            return $scope.hideHint = true;

                        // user specified hint
                        if ($scope.hint)
                            return $scope.hint;

                        if ($scope.options.hint)
                            return $scope.options.hint;

                        // hint if only a maximum was specified
                        if (isMaxValid() && !isMinValid())
                            return 'Less than or equal to ' + $scope.max;

                        // hint if only a minimum was specified
                        if (isMinValid() && !isMaxValid())
                            return 'Greater than or equal to ' + $scope.min;

                        // hint if both a maximum and minimum was specified
                        if (isMaxValid() && isMinValid())
                            return $scope.min + ' to ' + $scope.max;
                    }
                };

                // returns true if the model is >= the maximum
                var isMaxed = function () {
                    return isMaxValid() && $scope.model >= $scope.max;
                };

                // returns true if the model is <= the minimum
                var isMinnd = function () {
                    return isMinValid() && $scope.model <= $scope.min;
                };

                var isMaxValid = function () {
                    return !isNull($scope.max);
                };

                var isMinValid = function () {
                    return !isNull($scope.min);
                };

                var isNull = function (num) {
                    return (num === null) || (num === undefined) || (num === NaN);
                };

                var numberHasDecimal = function (num) {
                    return num.toString().indexOf('.') > -1;
                };

                var canGoNegative = function () {
                    return (!isMinValid() || $scope.min < 0);
                };

                var validKey = function (key) {
                    return (key >= KEY_ZERO && key <= KEY_NINE) ||
                        (key == KEY_DASH && canGoNegative()) ||
                        (key == KEY_PERIOD && !$scope.disabledecimal && !($scope.decimalplaces == 0));
                };

                var parseFloatForModel = function (string) {
                    if (string === '' && $scope.acceptclean === true) {
                        return string;
                    }
                    else {
                        return +parseFloat(string).toFixed($scope.decimalplaces);
                        /*    if (string !== undefined) {
                               if (typeof string==="number") {
                                   return +parseFloat(string).toFixed($scope.decimalplaces);
                               } else {
                                   var value = string.split('.');
                                   if (value[1] === undefined) {
                                       return +parseFloat(string).toFixed($scope.decimalplaces);
                                   } else {
                                       var digits = value[1].length - ($scope.decimalplaces + 0);
                                       if (digits === 0) {
                                           return parseFloat(string).toFixed($scope.decimalplaces);
                                       } else {
                                           return +parseFloat(string).toFixed($scope.decimalplaces);
                                       }
                                   }
                               }
                           } else {
                               return '';
                           }
                        */
                    }
                };

                // validates the current model
                // if it is higher/lower than max/min, will reset to max/min
                var validate = function () {
                    if ($scope.decimalplaces > 0) {
                        try {
                            var integer = $scope.model.split('.');
                            var digits = integer[1].length - ($scope.decimalplaces + 0);
                            if ($scope.model === integer[0] + '.' + '0'.repeat($scope.decimalplaces + digits)) return;
                            if ($scope.model === integer[0] + '.' + integer[1].substring(0, 1) + '0'.repeat($scope.decimalplaces + digits - 1)) {
                                return;
                            }

                        } catch (e) {

                        }
                    }

                    $scope.model = parseFloatForModel($scope.model);
                    if (isMaxed()) $scope.model = $scope.max;
                    if (isMinnd()) $scope.model = $scope.min;
                    $scope.model = isNaN($scope.model) ? null : $scope.model
                    prevKey = null;

                };

                // returns the number of decimal places in $scope.step
                var getdecimalplaces = function (str) {
                    if (str.indexOf('.') >= 0)
                        return str.split('.')[1].length;
                    return 0;
                };

                if (!$scope.options) $scope.options = {};

                // defaults
                if (isNull($scope.min)) $scope.min = $scope.options.min;
                if (isNull($scope.max)) $scope.max = $scope.options.max;

                // may still end up as null, which is okay
                if (isNull($scope.start)) $scope.start = $scope.options.start;
                if (isNull($scope.start)) $scope.start = $scope.min;

                $scope.step = $scope.step || $scope.options.step || 1;
                $scope.hint = this.hint = getHint();
                $scope.hideHint = $scope.hideHint || $scope.options.hideHint || false;
                $scope.disabledecimal = $scope.disabledecimal || $scope.options.disabledecimal || false;
                try {
                    $scope.decimalplaces = $scope.decimalplaces || $scope.options.decimalplaces || getdecimalplaces($scope.step.toString());
                } catch (e) { }

                //$scope.model = $scope.start || $scope.model || 0;
                $scope.prefix = this.prefix = $scope.prefix || $scope.options.prefix || '';
                $scope.postfix = this.postfix = $scope.postfix || $scope.options.postfix || '';
                if ($scope.acceptclean === false || $scope.acceptclean === undefined) {
                    $scope.model = $scope.start || $scope.model || 0;
                }
            }],

            controllerAs: 'numberInput'
        };
    });
})();
/* jshint ignore:end */