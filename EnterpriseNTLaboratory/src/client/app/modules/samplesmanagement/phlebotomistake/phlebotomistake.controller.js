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
    "$scope",
    "phlebotomistakeDS",
    "userDS"
  ];

  /* @ngInject */
  function phlebotomistakeController(
    $state,
    localStorageService,
    moment,
    $rootScope,
    $interval,
    $scope,
    phlebotomistakeDS,
    userDS
  ) {
    var vm = this;
    vm.title = "Login";
    $rootScope.menu = true;
    $rootScope.NamePage = "Toma de muestra";
    $rootScope.pageview = 3;
    vm.auth = localStorageService.get("Enterprise_NT.authorizationData");
    $rootScope.helpReference = "04.dashboard/phlebotomistake.htm";
    vm.formatoFecha = localStorageService.get("FormatoFecha");
    vm.date = moment().format(vm.formatoFecha);
    // vm.dashboardDelay = 15 * 100000;

    // Instantiate a coutdown FlipClock
    $(".clock").FlipClock({
      clockFace: "TwentyFourHourClock",
    });

    vm.intervaldashboard = $interval(function () {
      //vm.getrouterstimer();
    }, vm.dashboardDelay);

    vm.slickConfig = {
      enabled: true,
      autoplay: true,
      draggable: false,
      autoplaySpeed: 3000,
      variableWidth: true,
      slidesToShow: 5,
      centerMode: false,
    };

    vm.contendlistroute = 5;
    vm.init = init;
    function init() {
      vm.getUser();
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
              logger.info(
                "No se encontraron usuarios activos consulte con el administrador"
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
                        vm.loadinappoinment = false;
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
                        vm.loadingdata = false;
                      } else {
                        logger.success(
                          "No hay datos relacionados a ese usuario"
                        );
                      }
                    },
                    function (error) {
                      vm.loadingdata = false;
                      vm.modalError(error);
                    }
                  );
              } else {
                vm.loadinappoinment = false;
              }
            }
          } else {
            logger.info(
              "No se encontraron usuarios disponibles consulte con el administrador"
            );
          }
        },
        function (error) {
          vm.modalError(error);
          vm.loadinappoinment = false;
        }
      );
    }
    vm.getUser=getUser;
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
    vm.changuetake = changuetake;
    function changuetake() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.work = [];
      return phlebotomistakeDS
        .getcubicledisponibleid(auth.authToken, vm.points.id)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.loadinappoinment = false;
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
              vm.loadingdata = false;
            } else {
              logger.success(
                "No hay datos relacionados a ese usuario"
              );
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.modalError(error);
          }
        );
    }

    vm.iniciarContador = iniciarContador;
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
    vm.iniciarContadorTake = iniciarContadorTake;
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

    vm.validatedUser = validatedUser;
    function validatedUser(order) {    
      vm.userValidated=1; 
      vm.datavalidateduser=order;
      vm.name='';
      UIkit.modal('#modalvalidteduser', { bgclose: false, escclose: false, modal: false }).show();
    }

    vm.keyselectpatientid = keyselectpatientid;
    function keyselectpatientid($event) {
        var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
        if (keyCode === 13) {
          var nameUser = _.toUpper(_.replace(vm.name, /\s+/g, ""));
          var usuarioenter= _.filter(
            vm.ListUser,
            function (o) {
              return (
                _.toUpper(_.replace(o.userName, /\s+/g, "")) ==
                nameUser
              );
            }
          );          
          if(usuarioenter.length!==0){
            UIkit.modal('#modalvalidteduser').hide();
            vm.userValidated=2;
            vm.pausarContador(vm.datavalidateduser);
            vm.datavalidateduser={};
          }else{
            vm.userValidated=3;
          }
        
        }
    } 

    vm.initContador = initContador;
    function initContador(order) {
      order.state=2;
      var datainit = {
        datechange: 1, //1 fecha inicio, 2 fecha fin
        orderNumber: order.orderNumber,
        idPoint: vm.points.id,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return phlebotomistakeDS
        .updatephlebotomistake(auth.authToken, datainit)
        .then(
          function (data) {
            if (data.status === 200) {
             vm.iniciarContadorTake(order)
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.modalError(error);
          }
        );
    }

    vm.pausarContador = pausarContador;
    function pausarContador(order) {
      var datainit = {
        datechange: 2, //1 fecha inicio, 2 fecha fin
        orderNumber: order.orderNumber,
        idPoint: vm.points.id,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return phlebotomistakeDS
        .updatephlebotomistake(auth.authToken, datainit)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.selectpoint = vm.points.id;
              var auth = localStorageService.get(
                "Enterprise_NT.authorizationData"
              );
              vm.samplingpoints = [];
              return phlebotomistakeDS
                .getcubicledisponible(auth.authToken)
                .then(
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
                        logger.info(
                          "No se encontraron usuarios activos consulte con el administrador"
                        );
                      } else {
                        vm.samplingpoints = _.orderBy(
                          vm.samplingpoints,
                          ["numberOfAssignedPeople", "name"],
                          ["asc", "desc"]
                        );

                        vm.points = { id: vm.selectpoint };
                        var auth = localStorageService.get(
                          "Enterprise_NT.authorizationData"
                        );
                        vm.work = [];
                        return phlebotomistakeDS
                          .getcubicledisponibleid(
                            auth.authToken,
                            vm.selectpoint
                          )
                          .then(
                            function (data) {
                              if (data.status === 200) {
                                vm.loadinappoinment = false;
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
                                      "YYYY-MM-DD HH:mm:ss"
                                    );
                                  } else {
                                    var dateInitTake = moment(
                                      value.dateInitTake
                                    ).format("YYYY-MM-DD HH:mm:ss");
                                    var fecha1 = moment(
                                      dateInitTake,
                                      "YYYY-MM-DD HH:mm:ss"
                                    );
                                  }

                                  var dateday = moment().format(
                                    "YYYY-MM-DD HH:mm:ss"
                                  );
                                  var fecha2 = moment(
                                    dateday,
                                    "YYYY-MM-DD HH:mm:ss"
                                  );

                                  var duracion = moment.duration(
                                    fecha2.diff(fecha1)
                                  );
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
                                });
                                vm.work = data.data;
                                vm.work.forEach(function (value) {
                                  vm.iniciarContador(value);
                                });
                                vm.loadingdata = false;
                              } else {
                                logger.success(
                                  "No hay datos relacionados a ese usuario"
                                );
                              }
                            },
                            function (error) {
                              vm.loadingdata = false;
                              vm.modalError(error);
                            }
                          );
                      }
                    } else {
                      logger.info(
                        "No se encontraron usuarios disponibles consulte con el administrador"
                      );
                    }
                  },
                  function (error) {
                    vm.modalError(error);
                    vm.loadinappoinment = false;
                  }
                );
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.modalError(error);
          }
        );

      /* if (order.contadores.intervalo) {
        $interval.cancel(order.contadores.intervalo);
        order.contadores.intervalo = null;
      } */
    }

    vm.viewdetailorder = viewdetailorder;
    function viewdetailorder(order) {}

    vm.formatoTiempo = formatoTiempo;
    function formatoTiempo(contador) {
      return (
        agregarCero(contador.horas) +
        ":" +
        agregarCero(contador.minutos) +
        ":" +
        agregarCero(contador.segundos)
      );
    }

    vm.formatoTiempoTake = formatoTiempoTake;
    function formatoTiempoTake(contador) {
     //vm.wiewoneminut=contador.
      return (
        agregarCero(contador.horas) +
        ":" +
        agregarCero(contador.minutos) +
        ":" +
        agregarCero(contador.segundos)
      );
    }

    function agregarCero(num) {
      return num < 10 ? "0" + num : num;
    }

    vm.isAuthenticate = isAuthenticate;
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
