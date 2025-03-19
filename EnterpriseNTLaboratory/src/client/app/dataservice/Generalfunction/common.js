/* jshint ignore:start */
(function () {
  'use strict';
 
  angular
    .module('app.core')
    .factory('common', common);
 
  common.$inject = ['$http', 'exception', 'moment', '$filter', 'localStorageService'];
  /* @ngInject */
 
  //** Método que define los metodos a usar*/
  function common($http, exception, moment, $filter, localStorageService) {
    var service = {
      getAgeDatePrint: getAgeDatePrint,
      getOrderComplete: getOrderComplete,
      getAge: getAge,
      getDOB: getDOB,
      getAgeAsString: getAgeAsString,
      getAgeTime: getAgeTime,
      getDataJson: getDataJson,
      getCaseComplete: getCaseComplete,
      getAgeByOrderDate: getAgeByOrderDate,
      getAgeByOrderDateAsString: getAgeByOrderDateAsString,
      getListYear: getListYear
    };
 
    /**
 * Calcula la edad del paciente
 * @param {*} date Fecha en string
 * @param {*} format Formato en que viene la fecha
 */
    function getAgeDatePrint(date, format, dateOrder) {
      if (!moment(date, format, true).isValid()) {
        return "";
      }
      var birthday = moment(date, format).toDate();
      var current = moment(dateOrder, format).toDate();
      // var current = new Date();
      var diaActual = current.getDate();
      var mesActual = current.getMonth() + 1;
      var anioActual = current.getFullYear();
      var diaInicio = birthday.getDate();
      var mesInicio = birthday.getMonth() + 1;
      var anioInicio = birthday.getFullYear();
 
      var b = 0;
      var mes = mesInicio;
      if (mes === 2) {
        if (((anioActual % 4 === 0 && anioActual % 100 !== 0) || anioActual % 400 === 0) || ((anioInicio % 4 === 0 && anioInicio % 100 !== 0) || anioInicio % 400 === 0)) {
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
 
      if ((anioInicio > anioActual) || (anioInicio === anioActual && mesInicio > mesActual) || (anioInicio === anioActual && mesInicio === mesActual && diaInicio > diaActual)) {
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
          dies = b + diaActual - diaInicio;
        }
      } else {
        anios = anioActual - anioInicio - 1;
        if (diaInicio > diaActual) {
          meses = mesActual - mesInicio - 1 + 12;
          dies = b + diaActual - diaInicio;
        } else {
          meses = mesActual - mesInicio + 12;
          dies = diaActual - diaInicio;
        }
      }
      var age = (anios < 10 ? "0" + anios : anios) + "." + (meses < 10 ? "0" + meses : meses) + "." + (dies < 10 ? "0" + dies : dies);
 
      if (age !== '') {
        var ageFields = age.split(".");
        if (Number(ageFields[0]) !== 0) {
          if (Number(ageFields[0]) === 1) {
            //Año
            return ageFields[0] + " " + $filter('translate')('0428');
          } else {
            //Años
            return ageFields[0] + " " + $filter('translate')('0103');
          }
        } else if (Number(ageFields[1]) !== 0) {
          if (Number(ageFields[1]) === 1) {
            //Mes
            return ageFields[1] + " " + $filter('translate')('0567');
          } else {
            //Meses
            return ageFields[1] + " " + $filter('translate')('0569');
          }
        } else {
          if (Number(ageFields[2]) === 1) {
            //Dia
            return ageFields[2] + " " + $filter('translate')('0568');
          } else {
            //Dias
            return ageFields[2] + " " + $filter('translate')('0476');
          }
        }
      } else {
        return $filter('translate')('0570');
      }
    }
 
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
    function getAge(date, format, datecreationorder, formatutc) {
      if (!moment(date, format, true).isValid()) {
        return "";
      }
 
      var birthday = moment(moment(date, format).toDate());
      var current = moment();
      if (datecreationorder != undefined) {
 
        if(formatutc)
        {
          var fecha = moment(datecreationorder, format).toDate();
          // Formatear la fecha en el formato deseado
          current = moment(fecha);
        }
        else {
          var fecha = moment(datecreationorder);
          current = fecha.format(format);
          current = moment(moment(current, format).toDate());
        }        
      }
      
 
      var anios = current.diff(birthday, 'years');
      birthday.add(anios, 'years');
 
      var meses = current.diff(birthday, 'months');
      birthday.add(meses, 'months');
 
      var dies = current.diff(birthday, 'days');
 
      //return { años, meses, días };
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
    function getAgeAsString(date, format, datecreateorder, formatutc) {
 
      var age = getAge(date, format, datecreateorder, formatutc);
 
      if (age !== '') {
        var ageFields = age.split(".");
        if (Number(ageFields[0]) !== 0) {
          if (Number(ageFields[0]) === 1) {
            //Año
            return ageFields[0] + " " + $filter('translate')('0428');
          } else {
            //Años
            return ageFields[0] + " " + $filter('translate')('0103');
          }
        } else if (Number(ageFields[1]) !== 0) {
          if (Number(ageFields[1]) === 1) {
            //Mes
            return ageFields[1] + " " + $filter('translate')('0567');
          } else {
            //Meses
            return ageFields[1] + " " + $filter('translate')('0569');
          }
        } else {
          if (Number(ageFields[2]) === 1) {
            //Dia
            return ageFields[2] + " " + $filter('translate')('0568');
          } else {
            //Dias
            return ageFields[2] + " " + $filter('translate')('0476');
          }
        }
      } else {
        return $filter('translate')('0570');
      }
    }
 
    /**
     * Función que calcula la edad en días, meses o años y trae la opción de mostrar la temporalidad (Días, meses, años, auto)
     * @param {*} birthday: Date Fecha de nacimiento.
     * @param {*} format Formato en que viene la fecha de nacimiento
    */
    function getAgeTime(birthday, format, datecreationorder) {
      var birthdate = moment(birthday, format);
 
      var today = moment();
      if (datecreationorder != undefined) {
        today = moment(datecreationorder);
      }
 
      if (today.diff(birthdate, 'years') > 0) {
        var traduction = today.diff(birthdate, 'years') === 1 ? '0428' : '0103';
        return today.diff(birthdate, 'years').toString() + ' ' + $filter('translate')(traduction);
      } else if (today.diff(birthdate, 'months') > 0) {
        var traduction = today.diff(birthdate, 'months') === 1 ? '0567' : '0569';
        return today.diff(birthdate, 'months').toString() + ' ' + $filter('translate')(traduction);
      } else {
        var traduction = today.diff(birthdate, 'days') === 1 ? '0568' : '0476';
        return today.diff(birthdate, 'days').toString() + ' ' + $filter('translate')(traduction);
      }
    }
 
 
    function getDataJson(json) {
      return $http.get(json).then(success).catch(fail);
      function success(response) {
        return response;
      }
 
      function fail(e) {
        return exception.catcher('XHR Failed')(e);
      }
    }
 
    /**
     * Formatea el numero del caso
     * @param {*} numberCase Numero de Caso
     * @param {*} caseDigits Digitos del caso
    */
    function getCaseComplete(numberCase, caseDigits) {
      numberCase = "" + numberCase;
      var typeCaseNumber = localStorageService.get('TipoNumeroCaso');
      if (typeCaseNumber === 'Diario') {
        if (numberCase.length > (caseDigits + 8)) {
          //El caso no es valido
          return null;
        } else if (numberCase.length <= caseDigits) {
          //Solo envia el numero del caso
          numberCase = "0".repeat(caseDigits - numberCase.length) + numberCase;
          numberCase = "" + moment().format("YYYYMMDD") + numberCase;
          return numberCase;
        } else if (numberCase.length <= (caseDigits + 2)) {
          //Llega el caso solo con dia
          if (numberCase.length === ((caseDigits + 1))) {
            //dia con un digito
            numberCase = "" + moment().format("YYYYMM") + "0" + numberCase;
          } else {
            //dia con dos digitos
            numberCase = "" + moment().format("YYYYMM") + numberCase;
          }
          return numberCase;
        } else if (numberCase.length <= (caseDigits + 4)) {
          //Llega la orden con mes y dia
          if (numberCase.length === ((caseDigits + 3))) {
            //mes con un digito
            numberCase = "" + moment().format("YYYY") + "0" + numberCase;
          } else {
            //mes con dos digitos
            numberCase = "" + moment().format("YYYY") + numberCase;
          }
          return numberCase;
        } else {
          //Llega la orden con mes y dia
          var year = "" + new Date().getFullYear();
          if (numberCase.length === ((caseDigits + 5))) {
            //año con un digito
            numberCase = year.substring(0, 3) + numberCase;
          } else if (numberCase.length === ((caseDigits + 6))) {
            //año con dos digitos
            numberCase = year.substring(0, 2) + numberCase;
          } else if (numberCase.length === ((caseDigits + 7))) {
            //año con tres digitos
            numberCase = year.substring(0, 1) + numberCase;
          }
          return numberCase;
        }
      } else if (typeCaseNumber === 'Mensual') {
        if (numberCase.length > (caseDigits + 6)) {
          //El caso no es valido
          return null;
        } else if (numberCase.length <= caseDigits) {
          //Solo envia el numero del caso
          numberCase = "0".repeat(caseDigits - numberCase.length) + numberCase;
          numberCase = "" + moment().format("YYYYMM") + numberCase;
          return numberCase;
        } else if (numberCase.length <= (caseDigits + 2)) {
          //Llega la orden con mes
          if (numberCase.length === ((caseDigits + 1))) {
            //mes con un digito
            numberCase = "" + moment().format("YYYY") + "0" + numberCase;
          } else {
            //mes con dos digitos
            numberCase = "" + moment().format("YYYY") + numberCase;
          }
          return numberCase;
        } else {
          //Llega la orden con mes
          var year = "" + new Date().getFullYear();
          if (numberCase.length === ((caseDigits + 3))) {
            //año con un digito
            numberCase = year.substring(0, 3) + numberCase;
          } else if (numberCase.length === ((caseDigits + 4))) {
            //año con dos digitos
            numberCase = year.substring(0, 2) + numberCase;
          } else if (numberCase.length === ((caseDigits + 5))) {
            //año con tres digitos
            numberCase = year.substring(0, 1) + numberCase;
          }
          return numberCase;
        }
      } else if (typeCaseNumber === 'Anual') {
        if (numberCase.length > (caseDigits + 4)) {
          //El caso no es valido
          return null;
        } else if (numberCase.length <= caseDigits) {
          //Solo envia el numero del caso
          numberCase = "0".repeat(caseDigits - numberCase.length) + numberCase;
          numberCase = "" + moment().format("YYYY") + numberCase;
          return numberCase;
        } else {
          //Llega la orden con año
          var year = "" + new Date().getFullYear();
          if (numberCase.length === ((caseDigits + 1))) {
            //año con un digito
            numberCase = year.substring(0, 3) + numberCase;
          } else if (numberCase.length === ((caseDigits + 2))) {
            //año con dos digitos
            numberCase = year.substring(0, 2) + numberCase;
          } else if (numberCase.length === ((caseDigits + 3))) {
            //año con tres digitos
            numberCase = year.substring(0, 1) + numberCase;
          }
          return numberCase;
        }
      }
    }
 
 
    /**
    * Calcula la edad del paciente
    * @param {*} date Fecha en string
    * @param {*} format Formato en que viene la fecha
    */
    function getAgeByOrderDate(date, format, orderDate) {
      if (!moment(date, format, true).isValid()) {
        return "";
      }
      var birthday = moment(date, format).toDate();
      var current = moment(orderDate, format).toDate();
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
 
    /**
     * Obtiene la edad a partir de una fecha pero en el formato (84 Años o tambien 1 Mes)
     * @param {*} date Fecha de nacimiento
     * @param {*} format Formato en que viene la fecha de nacimiento
    */
    function getAgeByOrderDateAsString(date, format, orderDate) {
      var age = getAgeByOrderDate(date, format, orderDate);
      if (age !== '') {
        var ageFields = age.split(".");
        if (Number(ageFields[0]) !== 0) {
          if (Number(ageFields[0]) === 1) {
            //Año
            return ageFields[0] + " " + $filter('translate')('0428');
          } else {
            //Años
            return ageFields[0] + " " + $filter('translate')('0103');
          }
        } else if (Number(ageFields[1]) !== 0) {
          if (Number(ageFields[1]) === 1) {
            //Mes
            return ageFields[1] + " " + $filter('translate')('0567');
          } else {
            //Meses
            return ageFields[1] + " " + $filter('translate')('0569');
          }
        } else {
          if (Number(ageFields[2]) === 1) {
            //Dia
            return ageFields[2] + " " + $filter('translate')('0568');
          } else {
            //Dias
            return ageFields[2] + " " + $filter('translate')('0476');
          }
        }
      } else {
        return $filter('translate')('0570');
      }
    }
 
    function getListYear() {
      var yearquery = localStorageService.get('AniosConsultas');
      var dateMin = moment().year() - yearquery;
      var dateMax = moment().year();
      var listYear = [];
      for (var i = dateMax; i >= dateMin; i--) {
        listYear.push({ 'id': i, 'name': i });
      }
      return listYear;
    }
 
    return service;
  }
})();
/* jshint ignore:end */
