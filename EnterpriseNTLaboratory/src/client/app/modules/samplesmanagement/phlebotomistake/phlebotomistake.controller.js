(function () {
  "use strict";

  angular
    .module("app.phlebotomistake")
    .controller("phlebotomistakeController", phlebotomistakeController);

  phlebotomistakeController.$inject = [
    "$state",
    "localStorageService",
    "moment",
    "$rootScope",
    "$interval",
    "phlebotomistakeDS",
    "userDS",
    "sampletrackingsDS",
    "$filter"
  ];

  /* @ngInject */
  function phlebotomistakeController(
    $state,
    localStorageService,
    moment,
    $rootScope,
    $interval,
    phlebotomistakeDS,
    userDS,
    sampletrackingsDS,
    $filter
  ) {
    var vm = this;
    vm.title = "Login";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0165");
    $rootScope.pageview = 3;
    vm.auth = localStorageService.get("Enterprise_NT.authorizationData");
    $rootScope.helpReference = "01. LaboratoryOrders/phlebotomistake.htm";
    vm.formatoFecha = localStorageService.get("FormatoFecha");
    vm.date = moment().format(vm.formatoFecha);
    vm.getSampleOrder=getSampleOrder;
    vm.init = init;
    vm.getUser=getUser;
    vm.changuetake = changuetake;
    vm.iniciarContador = iniciarContador;
    vm.iniciarContadorTake = iniciarContadorTake;
    vm.validatedUser = validatedUser;
    vm.keyselectpatientid = keyselectpatientid;
    vm.Validatedbutton=Validatedbutton;
    vm.initContador = initContador;
    vm.pausarContador = pausarContador;
    vm.viewdetailorder = viewdetailorder;
    vm.formatoTiempo = formatoTiempo;
    vm.formatoTiempoTake = formatoTiempoTake;
    vm.isAuthenticate = isAuthenticate;
    vm.changuetakeupdate=changuetakeupdate; 
    vm.loading=true;
    
    $(".clock").FlipClock({
      clockFace: "TwentyFourHourClock",
    });

    //Metodo que inicializa la pagina
    function init() {      
      vm.getUser();
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.points = { id: -1 };
      vm.samplingpoints = [];
      return phlebotomistakeDS.getcubicledisponible(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            data.data.forEach(function (cubicle) {
              cubicle.namecubicle =
                cubicle.name +
                " - " +
                cubicle.nameDesignatedPerson +
                " ( " +
                cubicle.numberOfAssignedPeople +
                " ) ";
            });
            vm.samplingpoints = data.data;
            if (vm.samplingpoints.length === 0) {
              vm.loading=false;
              logger.info(
                $filter("translate")("3699")
              );
            } else {
              vm.samplingpoints = _.orderBy(
                vm.samplingpoints,
                ["numberOfAssignedPeople", "name"],
                ["asc", "desc"]
              );
              var selectActive = _.filter(vm.samplingpoints, function (o) {
                return (
                  localStorageService.get("Enterprise_NT.authorizationData")
                    .id === o.designatedPerson
                );
              });
              if (selectActive.length !== 0) {
                vm.points = { id: selectActive[0].id };
                var auth = localStorageService.get(
                  "Enterprise_NT.authorizationData"
                );
                vm.work = [];
                return phlebotomistakeDS
                  .getcubicledisponibleid(auth.authToken, selectActive[0].id)
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        vm.loading=false;
                        data.data = _.orderBy(
                          data.data,
                          ["dateEntryOrder"],
                          ["asc"]
                        );
                        data.data.forEach(function (value) {
                          value.patientname =
                            value.name1 +
                            " " +
                            value.name2 +
                            " " +
                            value.lastName +
                            " " +
                            value.surName;
                          value.state =
                            value.dateInitTake === undefined ? 1 : 2;
                          if (value.state === 1) {
                            var dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('YYYY-MM-DD HH:mm:ss');
                            var fecha1 = moment(
                              dateEntryOrder,
                              'YYYY-MM-DD HH:mm:ss'
                            );
                            var dateday = moment().format('YYYY-MM-DD HH:mm:ss');
                            var fecha2 = moment(dateday, 'YYYY-MM-DD HH:mm:ss');
  
                            var duracion = moment.duration(fecha2.diff(fecha1));
                            // Extraer horas, minutos y segundos
                            var horas = Math.floor(duracion.asHours());
                            var minutos = duracion.minutes();
                            var segundos = duracion.seconds();
  
                            value.dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('DD/MM/YYYY HH:mm:ss');
                            if (segundos === 0) {
                              value.contadores = {
                                horas: 0,
                                minutos: 0,
                                segundos: 0,
                                intervalo: null,
                              };
                            } else {
                              value.contadores = {
                                horas: horas,
                                minutos: minutos,
                                segundos: segundos,
                                intervalo: null,
                              };
                            }
                            value.contadorestake = {
                              horas: 0,
                              minutos: 0,
                              segundos: 0,
                              intervalo: null,
                            }
                          } else {
                            var dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('YYYY-MM-DD HH:mm:ss');
                            var fecha1 = moment(
                              dateEntryOrder,
                              'YYYY-MM-DD HH:mm:ss'
                            );
                            var dateday = moment().format('YYYY-MM-DD HH:mm:ss');
                            var fecha2 = moment(dateday, 'YYYY-MM-DD HH:mm:ss');
  
                            var duracion = moment.duration(fecha2.diff(fecha1));
                            // Extraer horas, minutos y segundos
                            var horas = Math.floor(duracion.asHours());
                            var minutos = duracion.minutes();
                            var segundos = duracion.seconds();
  
                            value.dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('DD/MM/YYYY HH:mm:ss');
                            if (segundos === 0) {
                              value.contadores = {
                                horas: 0,
                                minutos: 0,
                                segundos: 0,
                                intervalo: null,
                              };
                            } else {
                              value.contadores = {
                                horas: horas,
                                minutos: minutos,
                                segundos: segundos,
                                intervalo: null,
                              };
                            }
                            value.contadorestake = {
                              horas: 0,
                              minutos: 0,
                              segundos: 0,
                              intervalo: null,
                            }
                            var dateInitTake = moment(
                              value.dateInitTake
                            ).format('YYYY-MM-DD HH:mm:ss');
                            var fecha1 = moment(
                              dateInitTake,
                              'YYYY-MM-DD HH:mm:ss'
                            );

                            var dateday = moment().format('YYYY-MM-DD HH:mm:ss');
                            var fecha2 = moment(dateday, 'YYYY-MM-DD HH:mm:ss');
  
                            var duracion = moment.duration(fecha2.diff(fecha1));
                            // Extraer horas, minutos y segundos
                            var horas = Math.floor(duracion.asHours());
                            var minutos = duracion.minutes();
                            var segundos = duracion.seconds();
  
                            value.dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('DD/MM/YYYY HH:mm:ss');
                            if (segundos === 0) {
                              value.contadorestake = {
                                horas: 0,
                                minutos: 0,
                                segundos: 0,
                                intervalo: null,
                              };
                            } else {
                              value.contadorestake = {
                                horas: horas,
                                minutos: minutos,
                                segundos: segundos,
                                intervalo: null,
                              };
                            }
                          }                        
                        });
                        vm.work = data.data;
                        vm.work.forEach(function (value) {
                          if (value.state === 1) {
                            vm.iniciarContador(value); 
                          }else{
                            vm.iniciarContador(value); 
                            vm.iniciarContadorTake(value)
                          }                                                   
                        });
                        vm.loading=false;
                      } else {
                        vm.loading=false;
                        logger.success(
                          $filter("translate")("3700")
                        );
                      }
                    },
                    function (error) {
                      vm.loading=false;
                      vm.modalError(error);
                    }
                  );
              } else {
                vm.loading=false;
              }
            }
          } else {
            vm.loading=false;
            logger.info(
              $filter("translate")("3699")
            );
          }
        },
        function (error) {
          vm.modalError(error);
          vm.loading=false;
        }
      );
    }   
    //Metodo para consultar los usuarios del laboratorio
    function getUser() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return userDS.getUserssimple(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
             vm.ListUser = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    } 
    //Metodo para validar cuando cambie el select del punto de preparacion de la toma de la muestra  
    function changuetake() {
      vm.loading=true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.work = [];
      return phlebotomistakeDS
        .getcubicledisponibleid(auth.authToken, vm.points.id)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.loading = false;
              data.data = _.orderBy(
                data.data,
                ["dateEntryOrder"],
                ["asc"]
              );
              data.data.forEach(function (value) {
                value.patientname =
                  value.name1 +
                  " " +
                  value.name2 +
                  " " +
                  value.lastName +
                  " " +
                  value.surName;
                value.state =
                  value.dateInitTake === undefined ? 1 : 2;
                if (value.state === 1) {
                  var dateEntryOrder = moment(
                    value.dateEntryOrder
                  ).format('YYYY-MM-DD HH:mm:ss');
                  var fecha1 = moment(
                    dateEntryOrder,
                    'YYYY-MM-DD HH:mm:ss'
                  );
                  var dateday = moment().format('YYYY-MM-DD HH:mm:ss');
                  var fecha2 = moment(dateday, 'YYYY-MM-DD HH:mm:ss');

                  var duracion = moment.duration(fecha2.diff(fecha1));
                  // Extraer horas, minutos y segundos
                  var horas = Math.floor(duracion.asHours());
                  var minutos = duracion.minutes();
                  var segundos = duracion.seconds();

                  value.dateEntryOrder = moment(
                    value.dateEntryOrder
                  ).format('DD/MM/YYYY HH:mm:ss');
                  if (segundos === 0) {
                    value.contadores = {
                      horas: 0,
                      minutos: 0,
                      segundos: 0,
                      intervalo: null,
                    };
                  } else {
                    value.contadores = {
                      horas: horas,
                      minutos: minutos,
                      segundos: segundos,
                      intervalo: null,
                    };
                  }
                  value.contadorestake = {
                    horas: 0,
                    minutos: 0,
                    segundos: 0,
                    intervalo: null,
                  }
                } else {
                  var dateEntryOrder = moment(
                    value.dateEntryOrder
                  ).format('YYYY-MM-DD HH:mm:ss');
                  var fecha1 = moment(
                    dateEntryOrder,
                    'YYYY-MM-DD HH:mm:ss'
                  );
                  var dateday = moment().format('YYYY-MM-DD HH:mm:ss');
                  var fecha2 = moment(dateday, 'YYYY-MM-DD HH:mm:ss');

                  var duracion = moment.duration(fecha2.diff(fecha1));
                  // Extraer horas, minutos y segundos
                  var horas = Math.floor(duracion.asHours());
                  var minutos = duracion.minutes();
                  var segundos = duracion.seconds();

                  value.dateEntryOrder = moment(
                    value.dateEntryOrder
                  ).format('DD/MM/YYYY HH:mm:ss');
                  if (segundos === 0) {
                    value.contadores = {
                      horas: 0,
                      minutos: 0,
                      segundos: 0,
                      intervalo: null,
                    };
                  } else {
                    value.contadores = {
                      horas: horas,
                      minutos: minutos,
                      segundos: segundos,
                      intervalo: null,
                    };
                  }
                  value.contadorestake = {
                    horas: 0,
                    minutos: 0,
                    segundos: 0,
                    intervalo: null,
                  }
                  var dateInitTake = moment(
                    value.dateInitTake
                  ).format('YYYY-MM-DD HH:mm:ss');
                  var fecha1 = moment(
                    dateInitTake,
                    'YYYY-MM-DD HH:mm:ss'
                  );

                  var dateday = moment().format('YYYY-MM-DD HH:mm:ss');
                  var fecha2 = moment(dateday, 'YYYY-MM-DD HH:mm:ss');

                  var duracion = moment.duration(fecha2.diff(fecha1));
                  // Extraer horas, minutos y segundos
                  var horas = Math.floor(duracion.asHours());
                  var minutos = duracion.minutes();
                  var segundos = duracion.seconds();

                  value.dateEntryOrder = moment(
                    value.dateEntryOrder
                  ).format('DD/MM/YYYY HH:mm:ss');
                  if (segundos === 0) {
                    value.contadorestake = {
                      horas: 0,
                      minutos: 0,
                      segundos: 0,
                      intervalo: null,
                    };
                  } else {
                    value.contadorestake = {
                      horas: horas,
                      minutos: minutos,
                      segundos: segundos,
                      intervalo: null,
                    };
                  }
                }                        
              });
              vm.work = data.data;
              vm.work.forEach(function (value) {
                if (value.state === 1) {
                  vm.iniciarContador(value); 
                }else{
                  vm.iniciarContador(value); 
                  vm.iniciarContadorTake(value)
                }                                                   
              });
              vm.loading=false;
            } else {
              vm.loading = false;
              logger.success(
                $filter("translate")("3700")
              );
            }
          },
          function (error) {
            vm.loading = false;
            vm.modalError(error);
          }
        );
    } 
    //Metodo para validar cuando se cierra la toma
    function changuetakeupdate() {     
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.samplingpoints = [];
      return phlebotomistakeDS.getcubicledisponible(auth.authToken).then(
        function (data) {
          if (data.status === 200) {          
            data.data.forEach(function (cubicle) {
              cubicle.namecubicle =
                cubicle.name +
                " - " +
                cubicle.nameDesignatedPerson +
                " ( " +
                cubicle.numberOfAssignedPeople +
                " ) ";
            });
            vm.samplingpoints = data.data;
            if (vm.samplingpoints.length === 0) {
              vm.loading=false;
              logger.info(
                $filter("translate")("3699")
              );
            } else {
                vm.points = { id: vm.selectpoint};
                var auth = localStorageService.get(
                  "Enterprise_NT.authorizationData"
                );
                vm.work = [];
                return phlebotomistakeDS
                  .getcubicledisponibleid(auth.authToken, vm.selectpoint)
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        vm.loading=false;
                        data.data = _.orderBy(
                          data.data,
                          ["dateEntryOrder"],
                          ["asc"]
                        );
                        data.data.forEach(function (value) {
                          value.patientname =
                            value.name1 +
                            " " +
                            value.name2 +
                            " " +
                            value.lastName +
                            " " +
                            value.surName;
                          value.state =
                            value.dateInitTake === undefined ? 1 : 2;
                          if (value.state === 1) {
                            var dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('YYYY-MM-DD HH:mm:ss');
                            var fecha1 = moment(
                              dateEntryOrder,
                              'YYYY-MM-DD HH:mm:ss'
                            );
                            var dateday = moment().format('YYYY-MM-DD HH:mm:ss');
                            var fecha2 = moment(dateday, 'YYYY-MM-DD HH:mm:ss');
  
                            var duracion = moment.duration(fecha2.diff(fecha1));
                            // Extraer horas, minutos y segundos
                            var horas = Math.floor(duracion.asHours());
                            var minutos = duracion.minutes();
                            var segundos = duracion.seconds();
  
                            value.dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('DD/MM/YYYY HH:mm:ss');
                            if (segundos === 0) {
                              value.contadores = {
                                horas: 0,
                                minutos: 0,
                                segundos: 0,
                                intervalo: null,
                              };
                            } else {
                              value.contadores = {
                                horas: horas,
                                minutos: minutos,
                                segundos: segundos,
                                intervalo: null,
                              };
                            }
                            value.contadorestake = {
                              horas: 0,
                              minutos: 0,
                              segundos: 0,
                              intervalo: null,
                            }
                          } else {
                            var dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('YYYY-MM-DD HH:mm:ss');
                            var fecha1 = moment(
                              dateEntryOrder,
                              'YYYY-MM-DD HH:mm:ss'
                            );
                            var dateday = moment().format('YYYY-MM-DD HH:mm:ss');
                            var fecha2 = moment(dateday, 'YYYY-MM-DD HH:mm:ss');
  
                            var duracion = moment.duration(fecha2.diff(fecha1));
                            // Extraer horas, minutos y segundos
                            var horas = Math.floor(duracion.asHours());
                            var minutos = duracion.minutes();
                            var segundos = duracion.seconds();
  
                            value.dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('DD/MM/YYYY HH:mm:ss');
                            if (segundos === 0) {
                              value.contadores = {
                                horas: 0,
                                minutos: 0,
                                segundos: 0,
                                intervalo: null,
                              };
                            } else {
                              value.contadores = {
                                horas: horas,
                                minutos: minutos,
                                segundos: segundos,
                                intervalo: null,
                              };
                            }
                            value.contadorestake = {
                              horas: 0,
                              minutos: 0,
                              segundos: 0,
                              intervalo: null,
                            }
                            var dateInitTake = moment(
                              value.dateInitTake
                            ).format('YYYY-MM-DD HH:mm:ss');
                            var fecha1 = moment(
                              dateInitTake,
                              'YYYY-MM-DD HH:mm:ss'
                            );
  
                            var dateday = moment().format('YYYY-MM-DD HH:mm:ss');
                            var fecha2 = moment(dateday, 'YYYY-MM-DD HH:mm:ss');
  
                            var duracion = moment.duration(fecha2.diff(fecha1));
                            // Extraer horas, minutos y segundos
                            var horas = Math.floor(duracion.asHours());
                            var minutos = duracion.minutes();
                            var segundos = duracion.seconds();
  
                            value.dateEntryOrder = moment(
                              value.dateEntryOrder
                            ).format('DD/MM/YYYY HH:mm:ss');
                            if (segundos === 0) {
                              value.contadorestake = {
                                horas: 0,
                                minutos: 0,
                                segundos: 0,
                                intervalo: null,
                              };
                            } else {
                              value.contadorestake = {
                                horas: horas,
                                minutos: minutos,
                                segundos: segundos,
                                intervalo: null,
                              };
                            }
                          }                        
                        });
                        vm.work = data.data;
                        vm.work.forEach(function (value) {
                          if (value.state === 1) {
                            vm.iniciarContador(value); 
                          }else{
                            vm.iniciarContador(value); 
                            vm.iniciarContadorTake(value)
                          }                                                   
                        });
                        vm.loading=false;
                      } else {
                        vm.loading=false;
                        logger.success(
                          $filter("translate")("3700")
                        );
                      }
                    },
                    function (error) {
                      vm.loading=false;
                      vm.modalError(error);
                    }
                  );              
            }
          } else {
            vm.loading=false;
            logger.info(
              $filter("translate")("3699")
            );
          }
        },
        function (error) {
          vm.modalError(error);
          vm.loading=false;
        }
      );
    }  
    //metodo inicia el contador de la fecha de ingreso
    function iniciarContador(order) {
      if (!order.contadores.intervalo) {
        order.contadores.intervalo = $interval(function () {
          var contador = order.contadores;
          contador.segundos++;

          if (contador.segundos >= 60) {
            contador.segundos = 0;
            contador.minutos++;
          }

          if (contador.minutos >= 60) {
            contador.minutos = 0;
            contador.horas++;
          }
        }, 1000); // 1 segundo
      }
    } 
    //metodo inicia el contador de la fecha de toma
    function iniciarContadorTake(order) {
      if (!order.contadorestake.intervalo) {
        order.contadorestake.intervalo = $interval(function () {
          var contador = order.contadorestake;
          contador.segundos++;

          if (contador.segundos >= 60) {
            contador.segundos = 0;
            contador.minutos++;
          }

          if (contador.minutos >= 60) {
            contador.minutos = 0;
            contador.horas++;
          }

        }, 1000); // 1 segundo
      }
    }    
    //Metodo que valida cuando de le da enter al boton si el id del usuario existe
    function validatedUser(order) {    
      vm.userValidated=1; 
      vm.datavalidateduser=order;
      vm.name='';
      UIkit.modal('#modalvalidteduser', { bgclose: false, escclose: false, modal: false }).show();
    }  
    //Metodo que valida cuando se da enter al ingresar el flebotomista
    function keyselectpatientid($event) {      
        var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
        if (keyCode === 13) {
          var nameUser = _.toUpper(_.replace(vm.name, /\s+/g, ""));
          vm.usuarioenter= _.filter(
            vm.ListUser,
            function (o) {
              return (
                _.toUpper(_.replace(o.userName, /\s+/g, "")) ==
                nameUser
              );
            }
          );          
          if(vm.usuarioenter.length!==0){
            UIkit.modal('#modalvalidteduser').hide();
            vm.userValidated=2;
            vm.pausarContador(vm.datavalidateduser);
            vm.datavalidateduser={};
          }else{
            vm.userValidated=3;
          }        
        }
    } 
    //Metodo que valida cuando de le da click al boton si el id del usuario existe
    function Validatedbutton() {
      var nameUser = _.toUpper(_.replace(vm.name, /\s+/g, ""));
      vm.usuarioenter= _.filter(
        vm.ListUser,
        function (o) {
          return (
            _.toUpper(_.replace(o.userName, /\s+/g, "")) ==
            nameUser
          );
        }
      );          
      if(vm.usuarioenter.length!==0){
        UIkit.modal('#modalvalidteduser').hide();
        vm.userValidated=2;
        vm.pausarContador(vm.datavalidateduser);
        vm.datavalidateduser={};
      }else{
        vm.userValidated=3;
      }
    }   
    //metodo que inicia la toma de la muestra 
    function initContador(order) {
      vm.loading=true;
      order.state=2;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var datainit = {
        datechange: 1, //1 fecha inicio, 2 fecha fin
        orderNumber: order.orderNumber,
        idPoint: vm.points.id,
        userInitTake: auth.authToken.id
      };    
      return phlebotomistakeDS
        .updatephlebotomistake(auth.authToken, datainit)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.loading=false;
             vm.iniciarContadorTake(order)
            }
          },
          function (error) {
            vm.loading=false;
            vm.modalError(error);
          }
        );
    }    
    //metodo para cerrar la toma de la muestra
    function pausarContador(order) {
      vm.loading=true;
      var datainit = {
        datechange: 2, //1 fecha inicio, 2 fecha fin
        orderNumber: order.orderNumber,
        idPoint: vm.points.id,
        userEndTake: vm.usuarioenter[0].id
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return phlebotomistakeDS
        .updatephlebotomistake(auth.authToken, datainit)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.selectpoint = vm.points.id;
              vm.changuetakeupdate();         
            }else{
              vm.loading=false;
            }
          },
          function (error) {
            vm.loading=false;
            vm.modalError(error);
          }
        );   
    }
    //Metodo para abrir la modal del detalle de la orden   
    function viewdetailorder(order) {
      vm.loading=true;
      vm.orderdetail=order.orderNumber;     
      vm.getSampleOrder(); 
    }   
    //Metodo que consulta las muestras de la orden seleccionada
    function getSampleOrder() {
      vm.listSample = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampletrackingsDS.sampleorder(auth.authToken, vm.orderdetail).then(
        function (data) {
          if (data.status === 200) {
            if (data.data.length > 0) {
              data.data.forEach(function (value, key) {
                var sampleverific = $filter("filter")(value.sampleTrackings, {
                  state: 4,
                });
                value.tests = $filter("filter")(value.tests, function (e) {
                  return e.testType === 0;
                });
                if (value.qualityFlag === 3 && sampleverific.length > 0) {
                  var minutes = moment().diff(sampleverific[0].date, "seconds");
                  var timeline = moment().subtract(
                    minutes - value.qualityTime * 59,
                    "seconds"
                  );
                  value.time = parseInt(moment(timeline).format("x"));
                } else if (value.qualityFlag === 2 && sampleverific.length > 0) {
                  var minutes = moment().diff(sampleverific[0].date, "seconds");
                  var timeline = moment().add(
                    value.qualityTime * 59 - minutes,
                    "seconds"
                  );
                  value.time = parseInt(moment(timeline).format("x"));
                }
              });
    
              vm.listSample = _.orderBy(data.data, ["codesample"], ["asc"]);
              vm.routeSample = [];
              vm.Butoninterview = true;
              vm.Butonbarcode = true;
              vm.Butondemographics = true;
              vm.showsample = true;
              vm.showdestination = false;
              UIkit.modal("#modaldetailorder").show();
              vm.loading = false;
            }else{
              vm.loading = false;
            }
          }           
        },
        function (error) {
          vm.modalError(error);
          vm.loading = false;
        }
      );
    }    
    // Metodo para formatear la hora mes dia en el contador de la fecha de ingreso
    function formatoTiempo(contador) {
      return (
        agregarCero(contador.horas) +
        ":" +
        agregarCero(contador.minutos) +
        ":" +
        agregarCero(contador.segundos)
      );
    }    
    // Metodo para formatear la hora mes dia en el contador de la toma de muestra
    function formatoTiempoTake(contador) {     
      return (
        agregarCero(contador.horas) +
        ":" +
        agregarCero(contador.minutos) +
        ":" +
        agregarCero(contador.segundos)
      );
    }
    // Metodo para agregar cero a la izquierda del número si es menor a 10
    function agregarCero(num) {
      return num < 10 ? "0" + num : num;
    }    
    //Método para evaluar la autenticación
    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }
    vm.isAuthenticate();
  }
})();
