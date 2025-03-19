/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('convertnumberliteral', convertnumberliteral);

    convertnumberliteral.$inject = ['$http', '$q', 'exception', 'logger', 'settings', 'moment', '$filter', 'localStorageService'];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function convertnumberliteral($http, $q, exception, logger, settings, moment, $filter, localStorageService) {
        var service = {
            getconvertWords: getconvertWords
        };

        function getconvertWords(strNum) {
            var intNum = strNum.toString().replace(/[\, ]/g, '');
            var strNumber = strNum.toString();
            if (isNaN(parseFloat(intNum))) {
                return '---';
            } else if (strNum == parseFloat(strNum)) {
                strNumber = $filter('number')(strNum, 2);
            }

            var language = $filter('translate')('0000');
            var arrayNumber = strNumber.split('.');
            var zero = arrayNumber[0] === '0' ? 'zero' : '';
            var arrayCurrency = arrayNumber[0].split(',');

            var numThos = [{ indx: 1, str: '' }, { indx: 2, str: 'thousand' }, { indx: 3, str: 'million' }, { indx: 4, str: 'billion' }, { indx: 5, str: 'trillion' }];
            var numDang = [{ num: 0, str: zero }, { num: 1, str: 'one' }, { num: 2, str: 'two' }, { num: 3, str: 'three' }, { num: 4, str: 'four' }, { num: 5, str: 'five' }, { num: 6, str: 'six' }, { num: 7, str: 'seven' }, { num: 8, str: 'eight' }, { num: 9, str: 'nine' }];
            var numTenth = [{ num: 10, str: 'ten' }, { num: 11, str: 'eleven' }, { num: 12, str: 'twelve' }, { num: 13, str: 'thirteen' }, { num: 14, str: 'fourteen' }, { num: 15, str: 'fifteen' }, { num: 16, str: 'sixteen' }, { num: 17, str: 'seventeen' }, { num: 18, str: 'eighteen' }, { num: 19, str: 'nineteen' }];
            var numTvew = [{ num: 20, str: 'twenty' }, { num: 30, str: 'thirty' }, { num: 40, str: 'forty' }, { num: 50, str: 'fifty' }, { num: 60, str: 'sixty' }, { num: 70, str: 'seventy' }, { num: 80, str: 'eighty' }, { num: 90, str: 'ninety' }];
            var numHund = [{ num: 100, str: 'one hundred' }, { num: 200, str: 'two hundred' }, { num: 300, str: 'three hundred' }, { num: 400, str: 'four hundred' }, { num: 500, str: 'five hundred' }, { num: 600, str: 'six hundred' }, { num: 700, str: 'seven hundred' }, { num: 800, str: 'eight hundred' }, { num: 900, str: 'nine hundred' }];
            var separator = ['-', ' and ', ' and ', ' '];
            var var_with = arrayNumber[1] === '00' ? '' : (arrayNumber[1] === '01' ? 'with ## penny' : 'with ## pennys');

            if (language === 'esCo') {
                var million = strNumber.substr(0, 2) === '1,' && arrayCurrency.length === 3 ? 'millón' : 'millones';
                var billion = strNumber.substr(0, 2) === '1,' && arrayCurrency.length === 5 ? 'billón' : 'billones';
                var trillion = strNumber.substr(0, 2) === '1,' && arrayCurrency.length === 7 ? 'trillón' : 'trillones';
                zero = arrayNumber[0] === '0' ? 'cero' : ''
                numThos = [{ indx: 1, str: '' }, { indx: 2, str: 'mil' }, { indx: 3, str: million }, { indx: 4, str: 'mil' }, { indx: 5, str: billion }, { indx: 6, str: 'mil' }, { indx: 7, str: trillion }];
                numDang = [{ num: 0, str: zero }, { num: 1, str: 'un' }, { num: 2, str: 'dos' }, { num: 3, str: 'tres' }, { num: 4, str: 'cuatro' }, { num: 5, str: 'cinco' }, { num: 6, str: 'seis' }, { num: 7, str: 'siete' }, { num: 8, str: 'ocho' }, { num: 9, str: 'nueve' }];
                numTenth = [{ num: 10, str: 'diez' }, { num: 11, str: 'once' }, { num: 12, str: 'doce' }, { num: 13, str: 'trece' }, { num: 14, str: 'catorce' }, { num: 15, str: 'quince' }, { num: 16, str: 'dieciséis' }, { num: 17, str: 'diecisiete' }, { num: 18, str: 'dieciocho' }, { num: 19, str: 'diecinueve' }];
                numTvew = [{ num: 20, str: 'veinte' }, { num: 30, str: 'treinta' }, { num: 40, str: 'cuarenta' }, { num: 50, str: 'cincuenta' }, { num: 60, str: 'sesenta' }, { num: 70, str: 'setenta' }, { num: 80, str: 'ochenta' }, { num: 90, str: 'noventa' }];
                numHund = [{ num: 100, str: 'cien' }, { num: 200, str: 'doscientos' }, { num: 300, str: 'trescientos' }, { num: 400, str: 'cuatrocientos' }, { num: 500, str: 'quinientos' }, { num: 600, str: 'seiscientos' }, { num: 700, str: 'setecientos' }, { num: 800, str: 'ochocientos' }, { num: 900, str: 'novecientos' }];
                separator = [' y ', 'to ', ' ', ' '];
                var_with = arrayNumber[1] === '00' ? '' : (arrayNumber[1] === '01' ? 'con ## centavo' : 'con ## centavos');
            }
            var lots = arrayCurrency.length;
            var str = '';
            for (var i = 0; i < lots; i++) {
                if (arrayCurrency[i].length === 3) {
                    var n1 = parseInt(arrayCurrency[i]);
                    var n2 = parseInt(arrayCurrency[i].substr(1, 2));
                    if (n1 > 99) {
                        n1 = n1 - parseInt(arrayCurrency[i].substr(1, 2));
                        str += $filter('filter')(numHund, { num: n1 }, true)[0].str;
                        str += (n1 === 100 && arrayCurrency[i].substr(1, 2) !== '00' ? separator[1] : separator[2]);

                        if (n2 > 0 && n2 < 10) {
                            str += ($filter('filter')(numDang, { num: n2 }, true)[0].str + separator[3]);
                        } else if (n2 > 9 && n2 < 20) {
                            str += ($filter('filter')(numTenth, { num: n2 }, true)[0].str + separator[3]);
                        } else if (n2 > 19) {
                            n2 = n2 - parseInt(arrayCurrency[i].substr(2, 1));
                            var n3 = parseInt(arrayCurrency[i].substr(2, 1));
                            var s = n3 === 0 ? 3 : 0;
                            str += ($filter('filter')(numTvew, { num: n2 }, true)[0].str + separator[s]);
                            str += ($filter('filter')(numDang, { num: n3 }, true)[0].str + separator[3]);
                        }
                    } else if (n1 > 9 && n2 < 20) {
                        str += ($filter('filter')(numTenth, { num: n2 }, true)[0].str + separator[3]);
                    } else if (n1 > 0 && n2 < 10) {
                        str += ($filter('filter')(numDang, { num: n1 }, true)[0].str + separator[3]);
                    } else if (n1 > 19) {
                        n1 = n1 - parseInt(arrayCurrency[i].substr(2, 1));
                        var n2 = parseInt(arrayCurrency[i].substr(2, 1));
                        var s = n2 === 0 ? 3 : 0;
                        str += ($filter('filter')(numTvew, { num: n1 }, true)[0].str + separator[s]);
                        str += ($filter('filter')(numDang, { num: n2 }, true)[0].str + separator[3]);
                    }
                    if (n1 > 0 || lots - i === 3) {
                        str += ($filter('filter')(numThos, { indx: (lots - i) }, true)[0].str + separator[3]);
                        str = str.replace('veinte y ', 'veinti');
                    }
                } else if (arrayCurrency[i].length === 2) {
                    var n2 = parseInt(arrayCurrency[i]);
                    if (n2 > 9 && n2 < 20) {
                        str += $filter('filter')(numTenth, { num: n2 }, true)[0].str + separator[3];
                    } else if (n2 > 19) {
                        n2 = n2 - parseInt(arrayCurrency[i].substr(1, 1));
                        var n3 = parseInt(arrayCurrency[i].substr(1, 1));
                        var s = n3 === 0 ? 3 : 0;
                        str += ($filter('filter')(numTvew, { num: n2 }, true)[0].str + separator[s]);
                        str += ($filter('filter')(numDang, { num: n3 }, true)[0].str + separator[3]);
                    }
                    str += ($filter('filter')(numThos, { indx: (lots - i) }, true)[0].str + separator[3]);
                    str = str.replace('veinte y ', 'veinti');
                } else {
                    var n3 = parseInt(arrayCurrency[i]);
                    str += ($filter('filter')(numDang, { num: n3 }, true)[0].str + separator[3]);
                    str += ($filter('filter')(numThos, { indx: (lots - i) }, true)[0].str + separator[3]);
                    str = str.replace('veinte y ', 'veinti');
                }
            }
            if (var_with !== '' && arrayNumber.length > 1) {
                var p1 = parseInt(arrayNumber[1]);
                var penny = '';
                if (p1 > 0 && p1 < 10) {
                    penny += $filter('filter')(numDang, { num: p1 }, true)[0].str;
                } else if (p1 > 9 && p1 < 20) {
                    penny += $filter('filter')(numTenth, { num: p1 }, true)[0].str;
                } else if (p1 > 19) {
                    p1 = p1 - parseInt(arrayNumber[1].substr(1, 1));
                    var p2 = parseInt(arrayNumber[1].substr(1, 1));
                    var s = p2 === 0 ? 3 : 0;
                    penny += ($filter('filter')(numTvew, { num: p1 }, true)[0].str + separator[s]);
                    penny += ($filter('filter')(numDang, { num: p2 }, true)[0].str + separator[3]);
                }
                penny = penny.replace('veinte y ', 'veinti');
                var_with = var_with.replace('##', penny);
            }
            var currency = localStorageService.get('Moneda').toUpperCase();
            str += (currency + ' ' + var_with);
            return str.replace(/\s+/g, ' ');
        }
        return service;
    }
})();
/* jshint ignore:end */
