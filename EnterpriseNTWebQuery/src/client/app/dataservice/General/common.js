(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('common', common);

    common.$inject = ['$http', '$q', 'exception', 'logger', 'settings', 'moment', '$filter'];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function common($http, $q, exception, logger, settings, moment, $filter) {
        var service = {
            getOrderComplete: getOrderComplete,
            getAge: getAge,
            getDOB: getDOB,
            getAgeAsString: getAgeAsString
        };

        /**
         * Formatea el numero de la orden 
         * @param {*} order Numero de Orden
         * @param {*} orderDigits Digitos de la orden
         */
        function getOrderComplete(order, orderDigits) {
            order = "" + order;
            if (order.length > (orderDigits + 8)) {
                //La orden no es valida
                return null;
            } else if (order.length <= orderDigits) {
                //Solo envia el numero de la orden
                order = "0".repeat(orderDigits - order.length) + order;
                order = "" + moment().format("YYYYMMDD") + order;
                return order;
            } else if (order.length <= (orderDigits + 2)) {
                //Llega la orden solo con dia
                if (order.length === ((orderDigits + 1))) {
                    //dia con un digito
                    order = "" + moment().format("YYYYMM") + "0" + order;
                } else {
                    //dia con dos digitos
                    order = "" + moment().format("YYYYMM") + order;
                }
                return order;
            } else if (order.length <= (orderDigits + 4)) {
                //Llega la orden con mes y dia
                if (order.length === ((orderDigits + 3))) {
                    //mes con un digito
                    order = "" + moment().format("YYYY") + "0" + order;
                } else {
                    //mes con dos digitos
                    order = "" + moment().format("YYYY") + order;
                }
                return order;
            } else {
                //Llega la orden con mes y dia
                var year = "" + new Date().getFullYear();
                if (order.length === ((orderDigits + 5))) {
                    //año con un digito
                    order = year.substring(0, 3) + order;
                } else if (order.length === ((orderDigits + 6))) {
                    //año con dos digitos
                    order = year.substring(0, 2) + order;
                } else if (order.length === ((orderDigits + 7))) {
                    //año con tres digitos
                    order = year.substring(0, 1) + order;
                }
                return order;
            }
        }

        /**
         * Calcula la edad del paciente
         * @param {*} date Fecha en string
         * @param {*} format Formato en que viene la fecha
         */
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
            if ((anioInicio > anioActual) || (anioInicio === anioActual && mesInicio > mesActual)
                || (anioInicio === anioActual && mesInicio === mesActual && diaInicio > diaActual)) {
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

        /**
         * Calcula la fecha de nacimiento como string de acuerdo a la edad 
         * @param {*} age Edad en formato YY.MM.DD
         * @param {*} format Formato en que se retornara la fecha
         */
        function getDOB(age, format) {
            var fields = age.split(".");
            var years = fields[0];
            var months = fields[1];
            var days = fields[2];
            return moment().subtract(years, 'years').subtract(months, 'months').subtract(days, 'days').format(format);
        }

        /**
         * Obtiene la edad a partir de una fecha pero en el formato (84 Años o tambien 1 Mes)
         * @param {*} date Fecha de nacimiento
         * @param {*} format Formato en que viene la fecha de nacimiento
         */
        function getAgeAsString(date, format) {
            var age = getAge(date, format);
            if (age !== '') {
                var ageFields = age.split(".");
                if (Number(ageFields[0]) !== 0) {
                    if (Number(ageFields[0]) === 1) {
                        //Año
                        return ageFields[0] + " " + $filter('translate')('0181');
                    } else {
                        //Años
                        return ageFields[0] + " " + $filter('translate')('0182');
                    }
                } else if (Number(ageFields[1]) !== 0) {
                    if (Number(ageFields[1]) === 1) {
                        //Mes 
                        return ageFields[1] + " " + $filter('translate')('0183');
                    } else {
                        //Meses
                        return ageFields[1] + " " + $filter('translate')('0184');
                    }
                } else {
                    if (Number(ageFields[2]) === 1) {
                        //Dia
                        return ageFields[2] + " " + $filter('translate')('0185');
                    } else {
                        //Dias
                        return ageFields[2] + " " + $filter('translate')('0186');
                    }
                }
            } else {
                return $filter('translate')('0187');
            }
        }

        return service;
    }
})();
