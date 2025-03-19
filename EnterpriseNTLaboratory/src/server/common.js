var moment = require('moment');

module.exports = function() {
  var service = {
    getAgeAsString: getAgeAsString,
    getAge: getAge,
    getAgeByOrderDate: getAgeByOrderDate,
    getAgeByOrderDateAsString: getAgeByOrderDateAsString
  };
  return service;

  function getAgeAsString(date, format) {
    var age = getAge(date, format);
    if (age !== '') {
      var ageFields = age.split(".");
      if (Number(ageFields[0]) !== 0) {
        if (Number(ageFields[0]) === 1) {
          //Año
          return ageFields[0] + " " + "Año";
        } else {
          //Años
          return ageFields[0] + " " + "Años";
        }
      } else if (Number(ageFields[1]) !== 0) {
        if (Number(ageFields[1]) === 1) {
          //Mes
          return ageFields[1] + " " + "Mes";
        } else {
          //Meses
          return ageFields[1] + " " + "Meses";
        }
      } else {
        if (Number(ageFields[2]) === 1) {
          //Dia
          return ageFields[2] + " " + "Día";
        } else {
          //Dias
          return ageFields[2] + " " + "Dias";
        }
      }
    } else {
      return "Edad no valida";
    }
  }

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
      if ( ((anioActual % 4 === 0 && anioActual % 100 !== 0) || anioActual % 400 === 0) || ((anioInicio % 4 === 0 && anioInicio % 100 !== 0) || anioInicio % 400 === 0)) {
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
    return (anios < 10 ? "0" + anios : anios) + "." + (meses < 10 ? "0" + meses : meses) + "." + (dies < 10 ? "0" + dies : dies);
  }

  function getAgeByOrderDateAsString(date, format, orderDate) {
    var age = getAgeByOrderDate(date, format, orderDate);
    if (age !== '') {
      var ageFields = age.split(".");
      if (Number(ageFields[0]) !== 0) {
        if (Number(ageFields[0]) === 1) {
          //Año
          return ageFields[0] + " " + "Año";
        } else {
          //Años
          return ageFields[0] + " " + "Años";
        }
      } else if (Number(ageFields[1]) !== 0) {
        if (Number(ageFields[1]) === 1) {
          //Mes
          return ageFields[1] + " " + "Mes";
        } else {
          //Meses
          return ageFields[1] + " " + "Meses";
        }
      } else {
        if (Number(ageFields[2]) === 1) {
          //Dia
          return ageFields[2] + " " + "Día";
        } else {
          //Dias
          return ageFields[2] + " " + "Dias";
        }
      }
    } else {
      return "Edad no valida";
    }
  }

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

};
