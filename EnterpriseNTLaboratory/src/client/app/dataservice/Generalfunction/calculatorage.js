/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('calculatorage', calculatorage);

    calculatorage.$inject = ['$http', '$q', 'exception', 'logger', 'settings', 'moment'];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function calculatorage($http, $q, exception, logger, settings, moment) {
        var service = {
            getAge: getAge,
            getDOB: getDOB,
        };

        return service;

        //** Método que calcula la edad de un paciente*/
        function getAge(date, format) {
            if (!moment(date, format, true).isValid()) {
                return "";
            }
            var birthday = moment(date, format).toDate();
            var current = new Date();
            var diaActual = current.getDate();
            var mesActual = current.getMonth() + 1;
            var anioActual = current.getFullYear();
            var diaInicio = birthday.getDate();
            var mesInicio = birthday.getMonth() + 1;
            var anioInicio = birthday.getFullYear();
            var b = 0;
            var mes = mesInicio;
            if (mes === 2) {
                if ((anioActual % 4 === 0 && anioActual % 100 !== 0) || anioActual % 400 === 0) {
                    b = 29;
                } else {
                    b = 28;
                }
            } else if (mes <= 7) {
                if (mes === 0) {
                    b = 31;
                } else if (mes % 2 === 0) {
                    b = 30;
                } else {
                    b = 31;
                }
            } else if (mes > 7) {
                if (mes % 2 === 0) {
                    b = 31;
                } else {
                    b = 30;
                }
            }

            var anios = -1;
            var meses = -1;
            var dies = -1;
            if ((anioInicio > anioActual) || (anioInicio === anioActual && mesInicio > mesActual) ||
                (anioInicio === anioActual && mesInicio === mesActual && diaInicio > diaActual)) {
                return "";
            } else if (mesInicio <= mesActual) {
                anios = anioActual - anioInicio;
                if (diaInicio <= diaActual) {
                    meses = mesActual - mesInicio;
                    dies = diaActual - diaInicio;
                } else {
                    if (mesActual === mesInicio) {
                        anios = anios - 1;
                    }
                    meses = (mesActual - mesInicio - 1 + 12) % 12;
                    dies = b - (diaInicio - diaActual);
                }
            } else {
                anios = anioActual - anioInicio - 1;
                if (diaInicio > diaActual) {
                    meses = mesActual - mesInicio - 1 + 12;
                    dies = b - (diaInicio - diaActual);
                } else {
                    meses = mesActual - mesInicio + 12;
                    dies = diaActual - diaInicio;
                }
            }
            return (anios < 10 ? "0" + anios : anios) + "." + (meses < 10 ? "0" + meses : meses) + "." + (dies < 10 ? "0" + dies : dies);
        }

        //** Método que calcula fecha de nacimiento paciente*/
        function getDOB(age, format) {
            var fields = age.split(".");
            var years = fields[0];
            var months = fields[1];
            var days = fields[2];
            return moment().subtract(years, 'years').subtract(months, 'months').subtract(days, 'days').format(format);
        }
    }
})();
/* jshint ignore:end */
