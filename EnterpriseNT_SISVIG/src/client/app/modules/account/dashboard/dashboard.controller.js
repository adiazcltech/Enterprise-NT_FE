/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.dashboard")
    .controller("dashboardController", dashboardController);

  dashboardController.$inject = [
    "localStorageService",
    "configurationDS",
    "demographicDS",
    "$filter",
    "$rootScope",
    "$state",
    "logger",
    "common",
    "barcodeDS"
  ];

  function dashboardController(
    localStorageService,
    configurationDS,
    demographicDS,
    $filter,
    $rootScope,
    $state,
    logger,
    common,
    barcodeDS
  ) {
    var vm = this;
    vm.title = "Dashboard";
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    $rootScope.NamePage = 'Cargar ERR SISVIG';
    $rootScope.menu = true;
    vm.loadingdata = true;
    vm.loadTests = loadTests;
    vm.getConfiguration = getConfiguration;
    vm.getDemographicpatient = getDemographicpatient;
    vm.modalError = modalError;
    vm.systemcentral = systemcentral;
    vm.patientlist = patientlist;
    vm.readylist = readylist;
    vm.viewborgas = [];
    vm.viewlist = [];
    vm.save = save;
    vm.loadprint = loadprint;
    vm.listtest = [];
    vm.gologin = gologin;
    vm.readyborgas = readyborgas;
    vm.validated = validated;
    vm.validatedorder = validatedorder;
    vm.keyselectcode = keyselectcode;
    vm.detailconsult = detailconsult;
    vm.keyselectidenti = keyselectidenti;
    vm.datanull = $filter("translate")("1524");

    if (localStorageService.get("FormatoFecha") === null || localStorageService.get("FormatoFecha") === "") {
      vm.formatDate = "DD/MM/YYYY";
    } else {
      vm.formatDate = localStorageService.get("FormatoFecha").toUpperCase();
    }

    function loadprint(order, tests) {
      vm.loadingdata = true;
      if ($rootScope.serialprint === "") {
        logger.warning($filter("translate")("1521"));
        vm.loadingdata = false;
      } else {
        var samplesBarcode = [];
        for (var i = 0; i < tests.length; i++) {
          samplesBarcode.push(tests[i].sample.id);
        }
        vm.totalorder = 0;
        vm.porcent = 0;
        vm.printbarcode = {
          order: {},
          rangeType: 1,
          init: order,
          end: order,
          samples: samplesBarcode,
          printAddLabel: false,
          serial: $rootScope.serialprint,
          printingType: 2,
          test: [],
          demographics: [],
        };
        var auth = localStorageService.get(
          "Enterprise_NT.authorizationData"
        );
        return barcodeDS
          .getOrderHeaderBarcode(auth.authToken, vm.printbarcode)
          .then(
            function (data) {
              if (data.status === 200) {
                vm.listOrderHead = data.data;
                vm.ind = 1;
                vm.printbarcode.ordersprint = [{}];
                vm.progressPrint = false;
                vm.printbarcode.ordersprint[0] = vm.listOrderHead[0];
                var auth = localStorageService.get(
                  "Enterprise_NT.authorizationData"
                );
                return barcodeDS
                  .printOrderBodyBarcode(auth.authToken, vm.printbarcode)
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        vm.loadingdata = false;
                        vm.viewlist = [];
                        vm.viewborgas = [];
                        vm.code = "";
                        vm.identification = "";
                        angular.element("#code").select();
                        logger.success($filter("translate")("1528"));
                      }
                    },
                    function (error) {
                      vm.loading = false;
                      if (error.data.code === 2) {
                        vm.loadingdata = false;
                        vm.message = $filter("translate")("1074");
                      } else {
                        vm.loadingdata = false;
                        vm.modalError(error);
                        vm.message = $filter("translate")("1074");
                      }
                    }
                  );
              }
            },
            function (error) {
              vm.loadingdata = false;
              if (error.data !== undefined && error.data !== null) {
                logger.error($filter("translate")("0787"));
              } else {
                vm.PopupError = true;
                vm.Error = error;
              }
            }
          );

      }
    }

    function getDemographicpatient() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.listdemographic = [];
      return demographicDS.getDemographics(auth.authToken, "H").then(
        function (data) {
          if (data.status === 200) {
            vm.loadTests();
            var documentType = $filter('filter')(data.data, function (e) {
              return e.id === -10
            })
            if (documentType.length !== 0) {
              documentType[0].name = $filter("translate")('0233').toLowerCase();
              vm.listdemographic.push(documentType[0]);
            }

            var patientid = $filter('filter')(data.data, function (e) {
              return e.id === -100
            })[0]
            patientid.name = $filter("translate")('0117').toLowerCase();
            vm.listdemographic.push(patientid);


            var oneapellido = $filter('filter')(data.data, function (e) {
              return e.id === -101
            })[0]
            oneapellido.name = $filter("translate")('0234').toLowerCase();
            vm.listdemographic.push(oneapellido);


            var twoapellido = $filter('filter')(data.data, function (e) {
              return e.id === -102
            })[0]
            twoapellido.name = $filter("translate")('0235').toLowerCase();
            vm.listdemographic.push(twoapellido);

            var onename = $filter('filter')(data.data, function (e) {
              return e.id === -103
            })[0]
            onename.name = $filter("translate")('0236').toLowerCase();
            vm.listdemographic.push(onename);

            var twoname = $filter('filter')(data.data, function (e) {
              return e.id === -109
            })

            if (twoname.length !== 0) {
              twoname.name = $filter("translate")('0237').toLowerCase();
              vm.listdemographic.push(twoname[0]);
            }

            var sex = $filter('filter')(data.data, function (e) {
              return e.id === -104
            })[0]
            sex.name = $filter("translate")('0124').toLowerCase();
            vm.listdemographic.push(sex);

            var birthday = $filter('filter')(data.data, function (e) {
              return e.id === -105
            })[0]
            birthday.name = $filter("translate")('0120').toLowerCase();
            vm.listdemographic.push(birthday);

            /*     var age={
                  "user": {
                    "confidential": false,
                    "administrator": false,
                    "updateUserId": 0
                  },
                  "id": -110,
                  "name": $filter("translate")('0102').toLowerCase(),
                  "origin": "H",
                  "encoded": false,
                  "obligatory": 1,
                  "format": vm.formatDate,
                  "statistics": false,
                  "lastOrder": false,
                  "canCreateItemInOrder": false,
                  "modify": true,
                  "state": false,
                  "items": [],
                  "placeholder": vm.formatDate
                }
    
                vm.listdemographic.push(age); */

            var email = $filter('filter')(data.data, function (e) {
              return e.id === -106
            })[0]
            email.name = $filter("translate")('0135').toLowerCase();
            vm.listdemographic.push(email);
            var tel = {
              "user": {
                "confidential": false,
                "administrator": false,
                "updateUserId": 0
              },
              "id": -111,
              "name": $filter("translate")('0188').toLowerCase(),
              "origin": "H",
              "encoded": false,
              "obligatory": 0,
              "statistics": false,
              "lastOrder": false,
              "canCreateItemInOrder": false,
              "modify": true,
              "state": false,
              "items": []
            }
            vm.listdemographic.push(tel);
            var dirección = {
              "user": {
                "confidential": false,
                "administrator": false,
                "updateUserId": 0
              },
              "id": -112,
              "name": $filter("translate")('0187').toLowerCase(),
              "origin": "H",
              "encoded": false,
              "obligatory": 0,
              "statistics": false,
              "lastOrder": false,
              "canCreateItemInOrder": false,
              "modify": true,
              "state": false,
              "items": []
            }
            vm.listdemographic.push(dirección);

            data.data.forEach(function (value, key) {
              if (value.id > 0) {
                vm.listdemographic.push(value);
              }
            });
            //vm.listdemographic =data.data; 
            vm.loadingdata = false;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function keyselectcode($event) {
      if (vm.code !== '' && vm.code !== null && vm.code !== undefined) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
          vm.identification = '';
          vm.loadingdata = true;
          vm.viewborgas = [];
          vm.viewlist = [];
          angular.element("#code").select();
          var parameters = {
            urlhis: vm.dataconfigurl,
            consult: '/muestra/id/',
            identification: vm.code,
          };
          return demographicDS.getdatahis(parameters).then(
            function (data) {
              if (data.data.MENSAJE !== "Muestra no encontrada") {
                vm.borgaslist = data.data;
                vm.detailconsult();
              } else {
                vm.loadingdata = false;
                logger.success($filter("translate")("1529"));
              }
            },
            function (error) {
              vm.loadingdata = false;
              logger.success($filter("translate")("1523"));
            }
          );
        }
      }
    }

    function keyselectidenti($event) {
      if (vm.identification !== '' && vm.identification !== null && vm.identification !== undefined) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
          vm.code = '';
          vm.loadingdata = true;
          vm.viewborgas = [];
          vm.viewlist = [];
          var parameters = {
            urlhis: vm.dataconfigurl,
            consult: '/caso/id/',
            identification: vm.identification,
          };
          return demographicDS.getdatahis(parameters).then(
            function (data) {
              if (data.data.MENSAJE !== "Cedula no encontrada") {
                angular.element("#identification").select();
                vm.borgaslist = data.data;
                vm.detailconsult();
              } else {
                vm.loadingdata = false;
                logger.success($filter("translate")("1530"))
              }
            },
            function (error) {
              vm.loadingdata = false;
              logger.success($filter("translate")("1523"))
            }
          );
        }
      }
    }


    function detailconsult() {
      vm.viewborgas = [];
      vm.viewlist = [];
      vm.loadTests();
      var listdemographicencoded = $filter("filter")(
        vm.listdemographic,
        function (e) {
          return e.encoded === true;
        }
      );
      var demographicsystem = [];
      vm.validatedsytem = [];
      listdemographicencoded.forEach(function (value, key) {
        var filterborgas = $filter("filter")(
          vm.detaildemographic.patien,
          function (e) {
            return e.id === value.id && e.valuedefault === false;
          }
        );
        if (filterborgas.length !== 0) {
          if (vm.borgaslist.DETALLE[filterborgas[0].value] !== undefined) {
            var datademographisyste = {
              idDemographic: value.id,
              idItemDemographicHis: vm.borgaslist.DETALLE[filterborgas[0].value],
            };
            demographicsystem.push(datademographisyste);
            var validatedsytem = {
              id: value.id,
              name: filterborgas[0].name
            }
            vm.validatedsytem.push(validatedsytem);
          } else if (
            vm.borgaslist.DETALLE[filterborgas[0].value] === undefined &&
            value.obligatory !== 0
          ) {
            var datademographisyste = {
              idDemographic: value.id,
              idItemDemographicHis: vm.borgaslist.DETALLE[filterborgas[0].value],
            };
            demographicsystem.push(datademographisyste);
            var validatedsytem = {
              id: value.id,
              name: filterborgas[0].name
            }
            vm.validatedsytem.push(validatedsytem);
          }
        }
      });

      var data = {
        idSystem: 1,
        demographic: demographicsystem,
      };
      data.demographic = $filter("filter")(data.demographic, function (e) {
        return e.idDemographic !== -104;
      });

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS.integration(auth.authToken, data).then(
        function (data) {
          if (data.status === 200) {
            vm.centralhistory = data.data;
            vm.finalalidatedsytem = [];
            var alertsystem = [];
            vm.centralhistory.demographic.forEach(function (value, key) {
              if (value === null || value.idItemDemographicLis === undefined) {
                alertsystem.push(value);
                var add=$filter("filter")(vm.validatedsytem,
                  function (e) {
                    return e.id === value.idDemographic;
                  })[0]
                vm.finalalidatedsytem.push(add)
              }
            });
            if (vm.centralhistory.demographic.length !== 0) {
              if (alertsystem.length === 0) {
                vm.identificationlis = vm.centralhistory.demographic[0].idItemDemographicLis;
                vm.patiendborgas = vm.borgaslist.DETALLE.numero_identificacion;
                vm.datalis = [];
                return demographicDS
                  .patientIdlis(
                    auth.authToken,
                    vm.patiendborgas,
                    vm.identificationlis
                  )
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        if (data.data.sex.esCo === 'Femenino') {
                          data.data.sex = { "id": 2, "code": "2", "enUsa": "Female", "esCo": "Femenino" }
                        } else {
                          data.data.sex = { "id": 1, "code": "1", "enUsa": "Male", "esCo": "Masculino" }
                        }
                        vm.datalis = data.data;
                        vm.readylist();
                      } else {
                        //No se necontraron datos nt
                        vm.readyborgas();
                      }
                    },
                    function (error) {
                      vm.modalError(error);
                    }
                  );
              } else {
                vm.loadingdata = false;
                UIkit.modal('#testinvalid').show();
              }

            } else {
              var validatedsytem = {
                id: 1,
                name: "Tipo de identificación"
              }
              vm.finalalidatedsytem.push(validatedsytem)
              vm.loadingdata = false;
              UIkit.modal('#testinvalid').show();
            }
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );

    }

    function readyborgas() {
      vm.newpatient = {
        documentType: {
          id: 0
        },
        sex: {
          id: 0
        },
        demographics: [],
      };
      var demopatien = [];
      vm.listdemographic.forEach(function (value, key) {
        //lista borgas
        if (value.id !== -110) {
          configdemograhis = [];
          var configdemograhis = $filter("filter")(
            vm.detaildemographic.patien,
            function (e) {
              return e.id === value.id;
            }
          );
          if (configdemograhis.length !== 0) {
            if (configdemograhis[0].valuedefault) {
              if (value.encoded) {
                var name = $filter("filter")(value.items, function (e) {
                  return e.id === configdemograhis[0].value;
                });
                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: true,
                  idvalue: name[0].id,
                  valuename: name[0].name,
                };
                vm.viewborgas.push(borgast);
              } else {
                var name = configdemograhis[0].value;
                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: false,
                  valuename: name === "" || name === undefined ?
                    '' : name,
                };
                vm.viewborgas.push(borgast);
              }
            } else if (value.encoded) {
              if (vm.borgaslist.DETALLE[configdemograhis[0].value] === undefined) {
                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: true,
                  idvalue: 0,
                  valuename: '',
                  valuecode: ''
                };
                vm.viewborgas.push(borgast);
              } else {

                if (value.id === -104) {
                  if (vm.borgaslist.DETALLE[configdemograhis[0].value] === 'F') {
                    var sistemcentral = [{ "idDemographic": -104, "idItemDemographicHis": "F", "idItemDemographicLis": 2, "nameDemographic": "Femenino" }]
                  } else {
                    var sistemcentral = [{ "idDemographic": -104, "idItemDemographicHis": "M", "idItemDemographicLis": 1, "nameDemographic": "Masculino" }]
                  }
                } else {
                  var sistemcentral = $filter("filter")(
                    vm.centralhistory.demographic,
                    function (e) {
                      return e.idDemographic === value.id;
                    }
                  );
                }

                var name = $filter("filter")(value.items, function (e) {
                  return e.id === sistemcentral[0].idItemDemographicLis;
                });

                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: true,
                  idvalue: sistemcentral[0].idItemDemographicLis,
                  valuename: name[0].name,
                  valuecode: name[0].code,
                };
                vm.viewborgas.push(borgast);
              }
            } else {
              if (value.id === -105) {
                if (value.placeholder === undefined) {
                  value.placeholder = vm.formatDate;
                }
                var date = moment(
                  vm.borgaslist.DETALLE[configdemograhis[0].value]
                ).format(value.placeholder.toUpperCase());
                var borgast = {
                  id: -105,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: false,
                  valuename: date,
                };
                vm.viewborgas.push(borgast);

              } else if (value.format !== undefined && value.format !== "") {
                if (value.format === null) {
                  var name = vm.borgaslist.DETALLE[configdemograhis[0].value];
                  var borgast = {
                    id: value.id,
                    name: $filter("translate")(value.name).toUpperCase(),
                    encoded: false,
                    valuename: name === "" || name === undefined ?
                      '' : name,
                  };
                  vm.viewborgas.push(borgast);
                } else if (value.format.search("DATE") === -1) {
                  var name = vm.borgaslist.DETALLE[configdemograhis[0].value];
                  var borgast = {
                    id: value.id,
                    name: $filter("translate")(value.name).toUpperCase(),
                    encoded: false,
                    valuename: name === "" || name === undefined ?
                      '' : name,
                  };
                  vm.viewborgas.push(borgast);
                } else {
                  value.format = value.format.slice(5);
                  var name = vm.borgaslist.DETALLE[configdemograhis[0].value];
                  var borgast = {
                    id: value.id,
                    name: $filter("translate")(value.name).toUpperCase(),
                    encoded: false,
                    valuename: name === "" || name === undefined ?
                      '' : moment(name).format(value.format.toUpperCase()),
                  };
                  vm.viewborgas.push(borgast);
                }
              } else {
                var name = vm.borgaslist.DETALLE[configdemograhis[0].value];
                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: false,
                  valuename: name === "" || name === undefined ?
                    '' : name,
                };
                vm.viewborgas.push(borgast);
              }
            }
          }
          if (value.id === -10) {
            vm.newpatient.documentType = {
              id: vm.viewborgas[vm.viewborgas.length - 1].idvalue,
            };
          }
          if (value.id === -100) {
            vm.newpatient.patientId = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -101) {
            vm.newpatient.lastName = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -102) {
            vm.newpatient.surName = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -103) {
            vm.newpatient.name1 = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -109) {
            vm.newpatient.name2 = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -104) {
            vm.newpatient.sex = {
              id: vm.viewborgas[vm.viewborgas.length - 1].idvalue,
            };
          }
          if (value.id === -105) {
            vm.newpatient.birthday = moment(
              vm.viewborgas[vm.viewborgas.length - 1].valuename,
              vm.formatDate.toUpperCase()
            ).valueOf();
          }
          if (value.id === -106) {
            vm.newpatient.email =
              vm.viewborgas[vm.viewborgas.length - 1].valuename === null ||
                vm.viewborgas[vm.viewborgas.length - 1].valuename === "" ?
                "" :
                vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -111) {
            vm.newpatient.phone =
              vm.viewborgas[vm.viewborgas.length - 1].valuename === null ||
                vm.viewborgas[vm.viewborgas.length - 1].valuename === '' ?
                "" :
                vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -112) {
            vm.newpatient.address =
              vm.viewborgas[vm.viewborgas.length - 1].valuename === null ||
                vm.viewborgas[vm.viewborgas.length - 1].valuename === '' ?
                "" :
                vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id > 0) {
            if (value.encoded) {
              var adddemo = $filter("filter")(vm.viewborgas, function (e) {
                return e.id === value.id;
              });
              if (
                adddemo[0].idvalue !== undefined &&
                adddemo[0].idvalue !== null
              ) {
                var datapatient = {
                  idDemographic: value.id,
                  encoded: value.encoded,
                  notCodifiedValue: "",
                  codifiedId: adddemo[0].idvalue,
                };
                demopatien.push(datapatient);
              }
            } else {
              var adddemo = $filter("filter")(vm.viewborgas, function (e) {
                return e.id === value.id;
              });
              if (
                adddemo[0].valuename !== undefined &&
                adddemo[0].valuename !== null
              ) {
                var datapatient = {
                  idDemographic: value.id,
                  encoded: value.encoded,
                  notCodifiedValue: adddemo[0].valuename,
                  codifiedId: "",
                };
                demopatien.push(datapatient);
              }
            }
          }
        }
      });
      vm.loadingdata = false;
      vm.newpatient.demographics = demopatien;
    }

    function readylist() {
      vm.newpatient = {
        documentType: {
          id: 0
        },
        sex: {
          id: 0
        },
        demographics: [],
      };
      vm.viewborgas = [];
      var demopatien = [];
      var demopatienlis = [];
      vm.viewlist = [];
      vm.listdemographic.forEach(function (value, key) {
        //lista borgas
        if (value.id !== -110) {
          configdemograhis = [];
          var configdemograhis = $filter("filter")(
            vm.detaildemographic.patien,
            function (e) {
              return e.id === value.id;
            }
          );
          if (configdemograhis.length !== 0) {
            if (configdemograhis[0].valuedefault) {
              if (value.encoded) {
                var name = $filter("filter")(value.items, function (e) {
                  return e.id === configdemograhis[0].value;
                });
                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: true,
                  idvalue: name[0].id,
                  valuename: name[0].name,
                };
                vm.viewborgas.push(borgast);
              } else {
                var name = configdemograhis[0].value;
                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: false,
                  valuename: name === "" || name === undefined ?
                    '' : name,
                };
                vm.viewborgas.push(borgast);
              }
            } else if (value.encoded) {
              if (vm.borgaslist.DETALLE[configdemograhis[0].value] === undefined) {
                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: true,
                  idvalue: 0,
                  valuename: '',
                  valuecode: ''
                };
                vm.viewborgas.push(borgast);
              } else {

                if (value.id === -104) {
                  if (vm.borgaslist.DETALLE[configdemograhis[0].value] === 'F') {
                    var sistemcentral = [{ "idDemographic": -104, "idItemDemographicHis": "F", "idItemDemographicLis": 2, "nameDemographic": "Femenino" }]
                  } else {
                    var sistemcentral = [{ "idDemographic": -104, "idItemDemographicHis": "M", "idItemDemographicLis": 1, "nameDemographic": "Masculino" }]
                  }
                } else {
                  var sistemcentral = $filter("filter")(
                    vm.centralhistory.demographic,
                    function (e) {
                      return e.idDemographic === value.id;
                    }
                  );
                }

                var name = $filter("filter")(value.items, function (e) {
                  return e.id === sistemcentral[0].idItemDemographicLis;
                });

                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: true,
                  idvalue: sistemcentral[0].idItemDemographicLis,
                  valuename: name[0].name,
                  valuecode: name[0].code,
                };
                vm.viewborgas.push(borgast);
              }
            } else {
              if (value.id === -105) {
                if (value.placeholder === undefined) {
                  value.placeholder = vm.formatDate;
                }
                var date = moment(
                  vm.borgaslist.DETALLE[configdemograhis[0].value]
                ).format(value.placeholder.toUpperCase());
                var borgast = {
                  id: -105,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: false,
                  valuename: date,
                };
                vm.viewborgas.push(borgast);


              } else if (value.format !== undefined && value.format !== "") {
                if (value.format === null) {
                  var name = vm.borgaslist.DETALLE[configdemograhis[0].value];
                  var borgast = {
                    id: value.id,
                    name: $filter("translate")(value.name).toUpperCase(),
                    encoded: false,
                    valuename: name === "" || name === undefined ?
                      '' : name,
                  };
                  vm.viewborgas.push(borgast);
                } else if (value.format.search("DATE") === -1) {
                  var name = vm.borgaslist.DETALLE[configdemograhis[0].value];
                  var borgast = {
                    id: value.id,
                    name: $filter("translate")(value.name).toUpperCase(),
                    encoded: false,
                    valuename: name === "" || name === undefined ?
                      '' : name,
                  };
                  vm.viewborgas.push(borgast);
                } else {
                  value.format = value.format.slice(5);
                  var name = vm.borgaslist.DETALLE[configdemograhis[0].value];
                  var borgast = {
                    id: value.id,
                    name: $filter("translate")(value.name).toUpperCase(),
                    encoded: false,
                    valuename: name === "" || name === undefined ?
                      '' : moment(name).format(value.format.toUpperCase()),
                  };
                  vm.viewborgas.push(borgast);
                }
              } else {
                var name = vm.borgaslist.DETALLE[configdemograhis[0].value];
                var borgast = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: false,
                  valuename: name === "" || name === undefined ?
                    '' : name,
                };
                vm.viewborgas.push(borgast);
              }
            }
          }
          if (value.id === -10) {
            vm.newpatient.documentType = {
              id: vm.viewborgas[vm.viewborgas.length - 1].idvalue,
            };
          }
          if (value.id === -100) {
            vm.newpatient.patientId = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -101) {
            vm.newpatient.lastName = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -102) {
            vm.newpatient.surName = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -103) {
            vm.newpatient.name1 = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -109) {
            vm.newpatient.name2 = vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -104) {
            vm.newpatient.sex = {
              id: vm.viewborgas[vm.viewborgas.length - 1].idvalue,
            };
          }
          if (value.id === -105) {
            vm.newpatient.birthday = moment(
              vm.viewborgas[vm.viewborgas.length - 1].valuename,
              vm.formatDate.toUpperCase()
            ).valueOf();
          }
          if (value.id === -106) {
            vm.newpatient.email =
              vm.viewborgas[vm.viewborgas.length - 1].valuename === null ||
                vm.viewborgas[vm.viewborgas.length - 1].valuename === "" ?
                "" :
                vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -111) {
            vm.newpatient.phone =
              vm.viewborgas[vm.viewborgas.length - 1].valuename === null ||
                vm.viewborgas[vm.viewborgas.length - 1].valuename === '' ?
                "" :
                vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id === -112) {
            vm.newpatient.address =
              vm.viewborgas[vm.viewborgas.length - 1].valuename === null ||
                vm.viewborgas[vm.viewborgas.length - 1].valuename === '' ?
                "" :
                vm.viewborgas[vm.viewborgas.length - 1].valuename;
          }
          if (value.id > 0) {
            if (value.encoded) {
              var adddemo = $filter("filter")(vm.viewborgas, function (e) {
                return e.id === value.id;
              });
              if (
                adddemo[0].idvalue !== undefined &&
                adddemo[0].idvalue !== null
              ) {
                var datapatient = {
                  idDemographic: value.id,
                  encoded: value.encoded,
                  notCodifiedValue: "",
                  codifiedId: adddemo[0].idvalue,
                };
                demopatien.push(datapatient);
              }
            } else {
              var adddemo = $filter("filter")(vm.viewborgas, function (e) {
                return e.id === value.id;
              });
              if (
                adddemo[0].valuename !== undefined &&
                adddemo[0].valuename !== null
              ) {
                var datapatient = {
                  idDemographic: value.id,
                  encoded: value.encoded,
                  notCodifiedValue: adddemo[0].valuename,
                  codifiedId: "",
                };
                demopatien.push(datapatient);
              }
            }
          }
        }
        //lista de LIS
        if (vm.datalis.length !== 0) {
          if (value.id === -10) {
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: true,
              idvalue: vm.datalis.documentType.id,
              valuename: vm.datalis.documentType.name,
            };
            vm.viewlist.push(list);
          }
          if (value.id === -100) {
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: false,
              valuename: vm.datalis.patientId,
            };
            vm.viewlist.push(list);
          }
          if (value.id === -101) {
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: false,
              valuename: vm.datalis.lastName,
            };
            vm.viewlist.push(list);
          }
          if (value.id === -102) {
            var demo =
              vm.datalis.surName === "" ?
                '' :
                vm.datalis.surName;
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: false,
              valuename: demo,
            };
            vm.viewlist.push(list);
          }
          if (value.id === -103) {
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: false,
              valuename: vm.datalis.name1,
            };
            vm.viewlist.push(list);
          }
          if (value.id === -109) {
            var demo =
              vm.datalis.name2 === "" ? '' : vm.datalis.name2;
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: false,
              valuename: demo,
            };
            vm.viewlist.push(list);
          }
          if (value.id === -104) {
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: true,
              idvalue: vm.datalis.sex.id,
              valuename: $filter("translate")("0000") === "esCo" ?
                vm.datalis.sex.esCo : vm.datalis.sex.enUsa,
            };
            vm.viewlist.push(list);
          }
          if (value.id === -105) {
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: false,
              valuename: moment(vm.datalis.birthday).format(vm.formatDate),
            };
            vm.viewlist.push(list);
          }
          if (value.id === -110) {
            var list = {
              id: -110,
              name: $filter("translate")("0102").toUpperCase(),
              encoded: false,
              valuename: common.getAgeAsString(
                moment(vm.datalis.birthday).format(vm.formatDate),
                vm.formatDate
              ),
            };
            vm.viewlist.push(list);
          }
          if (value.id === -106) {
            var demo =
              vm.datalis.email === "" ? '' : vm.datalis.email;
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: false,
              valuename: demo,
            };
            vm.viewlist.push(list);
          }
          if (value.id === -111) {
            var demo =
              vm.datalis.phone === "" ? '' : vm.datalis.phone;
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: false,
              valuename: demo,
            };
            vm.viewlist.push(list);
          }
          if (value.id === -112) {
            var demo =
              vm.datalis.address === "" ?
                '' :
                vm.datalis.address;
            var list = {
              id: value.id,
              name: $filter("translate")(value.name).toUpperCase(),
              encoded: false,
              valuename: demo,
            };
            vm.viewlist.push(list);
          }
          if (value.id > 0) {
            if (vm.datalis.demographics.length !== 0) {
              var demoadd = $filter("filter")(vm.datalis.demographics, function (e) {
                return e.idDemographic === value.id;
              });
              if (value.encoded === true) {
                var name = $filter("filter")(value.items, function (e) {
                  return e.id === demoadd[0].codifiedId;
                })
                var list = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: value.encoded,
                  valuename: name.length === 0 ? '' : name[0].name,
                };
                vm.viewlist.push(list);
              } else {
                var list = {
                  id: value.id,
                  name: $filter("translate")(value.name).toUpperCase(),
                  encoded: value.encoded,
                  valuename: demoadd.length === 0 ? '' : demoadd[0].value,
                };
                vm.viewlist.push(list);
              }
            }
          }
        }
      });
      vm.newpatient.demographics = demopatien;
      vm.loadingdata = false;
    }

    function validated() {
      if (vm.datalis.length === 0) {
        var validate = $filter("filter")(vm.listdemographic, function (e) {
          return e.obligatory !== 0 && e.id > 0;
        });
        var viewcomparate = false;
        validate.forEach(function (value, key) {
          var comparate = $filter("filter")(
            vm.newpatient.demographics,
            function (e) {
              return e.idDemographic === value.id;
            }
          );
          if (comparate.length === 0) {
            viewcomparate = true;
          }
        });
        if (viewcomparate) {
          logger.success(
            $filter("translate")("1525")
          );
        } else {
          vm.validatedorder();
        }
      } else {
        vm.validatedorder();
      }
    }

    function validatedorder() {
      vm.loadingdata = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS.getDemographics(auth.authToken, "O").then(
        function (data) {
          if (data.status === 200) {
            vm.listdemografiporder = data.data;
            var listdemographicencoded = $filter("filter")(
              vm.listdemografiporder,
              function (e) {
                return e.encoded === true;
              }
            );
            var demographicsystem = [];
            vm.validatedsytem = [];
            listdemographicencoded.forEach(function (value, key) {
              var filterborgas = $filter("filter")(
                vm.detaildemographic.order,
                function (e) {
                  return e.id === value.id && e.valuedefault === false;
                }
              );
              if (filterborgas.length !== 0) {
                if (
                  vm.borgaslist.DETALLE[filterborgas[0].value] !== undefined
                ) {
                  var datademographisyste = {
                    idDemographic: value.id,
                    idItemDemographicHis: vm.borgaslist.DETALLE[filterborgas[0].value],
                  };
                  demographicsystem.push(datademographisyste);
                  var validatedsytem = {
                    id: value.id,
                    name: filterborgas[0].name
                  }
                  vm.validatedsytem.push(validatedsytem);
                } else if (
                  vm.borgaslist.DETALLE[filterborgas[0].value] === undefined &&
                  value.obligatory !== 0
                ) {
                  var datademographisyste = {
                    idDemographic: value.id,
                    idItemDemographicHis: vm.borgaslist.DETALLE[filterborgas[0].value],
                  };
                  demographicsystem.push(datademographisyste);
                  var validatedsytem = {
                    id: value.id,
                    name: filterborgas[0].name
                  }
                  vm.validatedsytem.push(validatedsytem);
                }
              }
            });
            var data = {
              idSystem: 1,
              demographic: demographicsystem,
            };
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );

            data.demographic = $filter("filter")(data.demographic, function (e) {
              return e.idDemographic !== -104;
            });

            return demographicDS.integration(auth.authToken, data).then(
              function (data) {
                if (data.status === 200) {
                  vm.centralorder = data.data;

                  vm.finalalidatedsytem = [];
                  var alertsystem = [];
                  vm.centralorder.demographic.forEach(function (value, key) {
                    if (value === null || value.idItemDemographicLis === undefined) {
                      alertsystem.push(value);
                      var add=$filter("filter")(vm.validatedsytem,
                        function (e) {
                          return e.id === value.idDemographic;
                        })[0]
                      vm.finalalidatedsytem.push(add)
                    }
                  });
                  if (alertsystem.length === 0) {
                    var typeorder = $filter("filter")(
                      vm.listdemografiporder,
                      function (e) {
                        return e.id === -4;
                      }
                    );
                    if (typeorder.length !== 0) {
                      if (vm.detaildemographic.order[0].valuedefault === true) {
                        vm.typeorde = $filter("filter")(
                          typeorder[0].items,
                          function (e) {
                            return (
                              e.id ===
                              parseInt(vm.detaildemographic.order[0].value)
                            );
                          }
                        )[0];
                      } else {
                        var iditem = $filter("filter")(
                          vm.centralorder.demographic,
                          function (e) {
                            return e.idDemographic === -4;
                          }
                        )[0].idItemDemographicLis;

                        vm.typeorde = $filter("filter")(
                          typeorder[0].items,
                          function (e) {
                            return e.id === iditem;
                          }
                        )[0];
                      }
                    } else {
                      vm.typeorde = {};
                    }
                    vm.demographicorder = [];
                    vm.listdemografiporder.forEach(function (value, key) {
                      if (value.id > 0) {
                        var configdemograhis = $filter("filter")(
                          vm.detaildemographic.order,
                          function (e) {
                            return e.id === value.id;
                          }
                        );
                        if (configdemograhis[0].valuedefault) {
                          if (value.encoded) {
                            var name = $filter("filter")(value.items, function (
                              e
                            ) {
                              return (
                                e.id === parseInt(configdemograhis[0].value)
                              );
                            });
                            if (name[0] !== undefined && name[0] !== "") {
                              var borgast = {
                                idDemographic: value.id,
                                encoded: value.encoded,
                                notCodifiedValue: "",
                                codifiedId: name[0].id,
                              };
                              vm.demographicorder.push(borgast);
                            }
                          } else {
                            if (
                              configdemograhis[0].value !== undefined &&
                              configdemograhis[0].value !== ""
                            ) {
                              var borgast = {
                                idDemographic: value.id,
                                encoded: value.encoded,
                                notCodifiedValue: configdemograhis[0].value,
                                codifiedId: "",
                              };
                              vm.demographicorder.push(borgast);
                            }
                          }
                        } else {
                          if (value.encoded) {
                            var sistemcentral = $filter("filter")(
                              vm.centralorder.demographic,
                              function (e) {
                                return e.idDemographic === value.id;
                              }
                            );
                            if (
                              sistemcentral[0] !== undefined &&
                              sistemcentral[0] !== ""
                            ) {
                              var borgast = {
                                idDemographic: value.id,
                                encoded: value.encoded,
                                notCodifiedValue: "",
                                codifiedId: sistemcentral[0].idItemDemographicLis,
                              };
                              vm.demographicorder.push(borgast);
                            }
                          } else if (value.format !== undefined && value.format !== "") {
                            if (value.format === null) {
                              var borgast = {
                                idDemographic: value.id,
                                encoded: value.encoded,
                                notCodifiedValue: vm.borgaslist.DETALLE[configdemograhis[0].value],
                                codifiedId: "",
                              };
                              vm.demographicorder.push(borgast);
                            } else if (value.format.search("DATE") === -1) {
                              if (
                                vm.borgaslist.DETALLE[
                                configdemograhis[0].value
                                ] !== undefined &&
                                vm.borgaslist.DETALLE[
                                configdemograhis[0].value
                                ] !== ""
                              ) {
                                var borgast = {
                                  idDemographic: value.id,
                                  encoded: value.encoded,
                                  notCodifiedValue: vm.borgaslist.DETALLE[
                                    configdemograhis[0].value
                                  ],
                                  codifiedId: "",
                                };
                                vm.demographicorder.push(borgast);
                              }
                            } else {
                              value.format = value.format.slice(5);
                              var name =
                                vm.borgaslist.DETALLE[
                                configdemograhis[0].value
                                ];
                              if (
                                vm.borgaslist.DETALLE[
                                configdemograhis[0].value
                                ] !== undefined &&
                                vm.borgaslist.DETALLE[
                                configdemograhis[0].value
                                ] !== ""
                              ) {
                                {
                                  var borgast = {
                                    idDemographic: value.id,
                                    encoded: value.encoded,
                                    notCodifiedValue: name === "" || name === undefined ?
                                      "" : moment(name).format(
                                        value.format.toUpperCase()
                                      ),
                                    codifiedId: "",
                                  };
                                  vm.demographicorder.push(borgast);
                                }
                              }
                            }
                          } else {
                            var name =
                              vm.borgaslist.DETALLE[configdemograhis[0].value];
                            if (name === "" && name === undefined) {
                              var borgast = {
                                idDemographic: value.id,
                                encoded: value.encoded,
                                notCodifiedValue: name === "" || name === undefined ? "" : name,
                                codifiedId: "",
                              };
                              vm.demographicorder.push(borgast);
                            }
                          }
                        }
                      }
                    });
                    vm.save();
                  } else {
                    vm.loadingdata = false;
                    UIkit.modal('#testinvalid').show();
                  }
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function save() {

      if (vm.typeorde === undefined) {
        logger.error($filter("translate")("1526"));
        vm.loadingdata = false;
      } else {
        var validate = $filter("filter")(vm.listdemografiporder, function (e) {
          return e.obligatory !== 0 && e.id > 0;
        });
        var viewcomparate = false;
        validate.forEach(function (value, key) {
          var comparate = $filter("filter")(vm.demographicorder, function (e) {
            return e.idDemographic === value.id;
          });
          if (comparate.length === 0) {
            viewcomparate = true;
          }
        });

        if (viewcomparate) {
          logger.error($filter("translate")("1527"));
          vm.loadingdata = false;
        } else {
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          var test = $filter("filter")(vm.listtest, function (e) {
            return e.select === true;
          });

          vm.test = test;
          var order = {
            createdDateShort: Number(moment().format("YYYYMMDD")),
            orderNumber: null,
            date: "",
            type: vm.typeorde,
            branch: {
              id: auth.branch,
            },
            demographics: vm.demographicorder,
            listDiagnostic: [],
            patient: vm.datalis.length === 0 ? vm.newpatient : vm.datalis,
            tests: test,
            deleteTests: [],
          };
          demographicDS.insertOrder(auth.authToken, order).then(
            function (data) {
              if (data.status === 200) {
                if (vm.printbarcode === true) {
                  // vm.loadprint(data.data.orderNumber, data.data.tests);
                  vm.loadprint(data.data, vm.test);
                } else {
                  vm.loadingdata = false;
                  vm.viewlist = [];
                  vm.viewborgas = [];
                  vm.code = "";
                  vm.identification = "";
                  angular.element("#code").select();
                  logger.success($filter("translate")("1528"));
                }
              }
            },
            function (error) {
              vm.modalError(error);
            }
          );
        }
      }
    }

    function gologin(id) {
      if (id === 1) {
        $state.go("config");
      } else {
        $state.go("login");
      }

    }

    function getConfiguration() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS.getConfiguration(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            var config = $filter("filter")(data.data, function (e) {
              if (e.key === "UrlCargaOrdenesERR") {
                vm.dataconfigurl = e.value;
              }
              if (e.key === "DemograficosCargaOrdenesERR") {
                if (e.value === "") {
                  var auth = localStorageService.get("Enterprise_NT.authorizationData");
                  vm.viewadministrator = auth.administrator;
                  UIkit.modal("#errordata", {
                    bgclose: false
                  }).show();
                } else {
                  vm.detaildemographic = JSON.parse(e.value);
                }
              }
              return e.key === "UrlCargaOrdenesERR";
            });
            vm.getDemographicpatient();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function systemcentral(idDemographic, idItemDemographicHis) {
      var data = {
        idSystem: 1,
        demographic: [{
          idDemographic: idDemographic,
          idItemDemographicHis: idItemDemographicHis,
        }],
      };

      data = $filter("filter")(data.demographic, function (e) {
        return e.idDemographic !== -104;
      });

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS.integration(auth.authToken, data).then(
        function (data) {
          if (data.status === 200) {
            return data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function patientlist(patientId, documentType) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS
        .patientIdlis(auth.authToken, patientId, documentType)
        .then(
          function (data) {
            if (data.status === 200) {
              return data;
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }

    function loadTests() {
      vm.listtest = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS.getTestToOrderEntry(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.listtest = data.data;
            vm.listtestview = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    function init() {
      vm.getConfiguration();
      angular.element("#code").select();
    }

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
/* jshint ignore:end */
