/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal @descripción
                listener  @descripción
                order     @descripción
                date      @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/


(function () {
  "use strict";
  angular
    .module("app.widgets")
    .directive("orderinconsistenspacient", orderinconsistenspacient);
  orderinconsistenspacient.$inject = [
    "TribunalDS",
    "localStorageService",
    "$filter",
    "logger",
    "reportadicional"
  ];
  /* @ngInject */
  function orderinconsistenspacient(TribunalDS, localStorageService, $filter, logger, reportadicional) {
    var directive = {
      templateUrl:
        "app/widgets/userControl/orderinconsistenspacient.directive.html",
      restrict: "EA",
      scope: {
        openmodal: "=?openmodal",
      },
      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.init = init;
          vm.datehoytoday = moment().format("YYYYMMDD");
          vm.rangeInit = vm.datehoytoday;
          vm.rangeEnd = vm.datehoytoday;
          vm.searchpatient = searchpatient;
          vm.formatDateBirthday = localStorageService.get("FormatoFecha");
          vm.nofound = ($filter('translate')('0681')).toUpperCase();
          vm.getDetail = getDetail;
          vm.patient = [];
          vm.save = save;
          vm.selectOrder = selectOrder;
          vm.importexel = importexel;
          vm.loadData = loadData;
          vm.printexcel = printexcel;


          $scope.$watch("openmodal", function () {
            if ($scope.openmodal) {
              vm.loading = true;
              vm.tribunal = [];
              searchByDate(function () {
                UIkit.modal("#orderinconsistenspacient").show();
                vm.loading = false;
              });
            }
            $scope.openmodal = false;
          });

          vm.count = 0;
          function loadData() {

            if (vm.count < vm.patient.length) {
              vm.importexel(vm.patient[vm.count]);
            }
            else {
              vm.printexcel();
              vm.count = 0;
            }

          }

          function importexel(value) {
            vm.loading = true;
            value.birthday = moment(value.birthday).format('DD/MM/YYYY');
            var parameters = {
              token: localStorageService.get("Tokentribunal"),
              url: localStorageService.get("urlTribunalElectoral") === "" ? "https://qa.innovacion.gob.pa:44302" : localStorageService.get("urlTribunalElectoral"),
              personalId: value.patientId,
              fullNameApproximation: ""
            }
            return TribunalDS.getdatatribunal(parameters).then(
              function (data) {
                if (data.status === 200) {
                  value.dataTribunal = data.data.result;
                  vm.count = vm.count + 1;
                  vm.loadData();
                }
              },
              function (error) {
                vm.loading = false;
              }
            );
          }


          function printexcel() {
            var datareport = {};
            datareport.datareport = vm.patient;
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            datareport.variables = {
              "entity": "CLTECH",
              "abbreviation": "CLT",
              'username': auth.userName,
              'date': moment().format('DD/MM/YYYY')
            }
            datareport.pathreport = '/Report/reportsandconsultations/inconsistenciestribunal/inconsistenciestribunal.mrt';
            vm.loading = false;
            reportadicional.exportReportExcel(datareport, 'Areas.xls');
          }

          function searchpatient() {
            if (
              vm.rangeInit !== undefined &&
              vm.rangeInit !== "" &&
              vm.rangeInit !== null &&
              vm.rangeEnd !== undefined &&
              vm.rangeEnd !== "" &&
              vm.rangeEnd !== null
            ) {
              vm.patient = [];
              var inicial = moment(vm.rangeInit).format("YYYYMMDD");
              var final = moment(vm.rangeEnd).format("YYYYMMDD");
              var auth = localStorageService.get(
                "Enterprise_NT.authorizationData"
              );
              vm.tribunal = [];
              vm.lis = [];
              vm.selected = -1;
              vm.patient = [];
              //Invoca el metodo del servicio
              TribunalDS.getListpacient(auth.authToken, inicial, final).then(
                function (data) {
                  if (data.status === 200) {
                    if (data.data.length !== 0) {
                      vm.patient = _.orderBy(data.data, "patientId", "asc");
                      vm.loading = false;
                    } else {
                      vm.patient = [];
                      vm.loading = false;
                    }
                  } else {
                    vm.patient = [];
                    vm.loading = false;
                  }
                },
                function (error) {
                  vm.Error = error;
                  vm.ShowPopupError = true;
                  vm.loading = false;
                }
              );
            } else {
              vm.patient = [];
              vm.loading = false;
            }
          }

          function getDetail(Patient) {
            vm.loading = true;
            vm.selected = Patient.patientId;
            vm.orderNumber = Patient.orderNumber;

            vm.selectlis = {
              "documentType": false,
              "patientId": false,
              "name1": false,
              "name2": false,
              "lastName": false,
              "surName": false,
              "birthday": false,
              "sex": false
            }

            vm.selecttri = {
              "documentType": false,
              "patientId": false,
              "name1": false,
              "name2": false,
              "lastName": false,
              "surName": false,
              "birthday": false,
              "sex": false
            }

            vm.lis = {
              "id": Patient.id,
              "documentType": Patient.documentType,
              "patientId": Patient.patientId,
              "name1": Patient.name1,
              "name2": Patient.name2,
              "lastName": Patient.lastName,
              "surName": Patient.surName,
              "sex": Patient.sex,
              "birthday": Patient.birthday === undefined ? '' : Patient.birthday,
              "status": 1
            }
            var parameters = {
              token: localStorageService.get("Tokentribunal"),
              url: localStorageService.get("urlTribunalElectoral") === "" ? "https://qa.innovacion.gob.pa:44302" : localStorageService.get("urlTribunalElectoral"),
              personalId: Patient.patientId,
              fullNameApproximation: ""
            }
            return TribunalDS.getdatatribunal(parameters).then(
              function (data) {
                if (data.status === 200) {
                  if (data.data === '') {
                    var datatribunal = JSON.parse(Patient.dataTribunal);
                    if (datatribunal.gender === 'F') {
                      var sex = { id: 8, code: "2", name: "Femenino", showValue: "2. FEMENINO", }
                    }
                    if (datatribunal.gender === 'M') {
                      var sex = { id: 7, code: "1", name: "Masculino", showValue: "1. MASCULINO", }
                    }
                    if (datatribunal.personalIdTypeName !== '' && datatribunal.personalIdTypeName !== null) {
                      if ((datatribunal.personalIdTypeName).toUpperCase() === 'CÉDULA') {
                        var documentType = {
                          id: 2,
                          abbr: "CC",
                          name: "CEDULA"
                        }
                      }
                      if ((datatribunal.personalIdTypeName).toUpperCase() === 'PASAPORTE') {
                        var documentType = {
                          id: 8,
                          abbr: "PA",
                          name: "PASAPORTE"
                        }
                      }
                    } else {
                      var documentType = {
                        id: 0,
                        abbr: "",
                        name: ""
                      }

                    }

                    vm.tribunal = {
                      "id": vm.lis.id,
                      "documentType": documentType,
                      "patientId": datatribunal.personalId,
                      "name1": datatribunal.firstName === null || datatribunal.firstName === '' ? '' : (datatribunal.firstName).toUpperCase(),
                      "name2": datatribunal.middleName === null || datatribunal.middleName === '' ? '' : (datatribunal.middleName).toUpperCase(),
                      "lastName": datatribunal.lastName === null || datatribunal.lastName === '' ? '' : (datatribunal.lastName).toUpperCase(),
                      "surName": datatribunal.mothersMaidenName === null || datatribunal.mothersMaidenName === '' ? '' : (datatribunal.mothersMaidenName).toUpperCase(),
                      "sex": sex,
                      "birthday": datatribunal.birthDate === null || datatribunal.birthDate === '' ? '' : moment(datatribunal.birthDate, 'YYYY-MM-DD').valueOf(),
                      "status": 1
                    }

                    vm.loading = false;
                  } else {
                    if (data.data.result.found) {
                      if (data.data.result.gender === 'F') {
                        var sex = { id: 8, code: "2", name: "Femenino", showValue: "2. FEMENINO", }
                      }
                      if (data.data.result.gender === 'M') {
                        var sex = { id: 7, code: "1", name: "Masculino", showValue: "1. MASCULINO", }
                      }
                      if (data.data.result.gender === '') {
                        var sex = { id: 0, code: "0", name: "", showValue: "", }
                      }
                      if (data.data.result.personalIdTypeName !== '' && data.data.result.personalIdTypeName !== null) {
                        if ((data.data.result.personalIdTypeName).toUpperCase() === 'CÉDULA') {
                          var documentType = {
                            id: 2,
                            abbr: "CC",
                            name: "CEDULA"
                          }
                        }
                        if ((data.data.result.personalIdTypeName).toUpperCase() === 'PASAPORTE') {
                          var documentType = {
                            id: 8,
                            abbr: "PA",
                            name: "PASAPORTE"
                          }
                        }
                      } else {
                        var documentType = {
                          id: 0,
                          abbr: "",
                          name: ""
                        }
                      }

                      vm.tribunal = {
                        "id": vm.lis.id,
                        "documentType": documentType,
                        "patientId": data.data.result.personalId,
                        "name1": data.data.result.firstName === null || data.data.result.firstName === '' ? '' : (data.data.result.firstName).toUpperCase(),
                        "name2": data.data.result.middleName === null || data.data.result.middleName === '' ? '' : (data.data.result.middleName).toUpperCase(),
                        "lastName": data.data.result.lastName === null || data.data.result.lastName === '' ? '' : (data.data.result.lastName).toUpperCase(),
                        "surName": data.data.result.mothersMaidenName === null || data.data.result.mothersMaidenName === '' ? '' : (data.data.result.mothersMaidenName).toUpperCase(),
                        "sex": sex,
                        "birthday": data.data.result.birthDate === null || data.data.result.birthDate === '' ? '' : moment(data.data.result.birthDate, 'YYYY-MM-DD').valueOf(),
                        "status": 1
                      }
                      vm.loading = false;
                    } else {
                      if (Patient.dataTribunal === '') {
                        vm.tribunal = vm.lis;
                        vm.loading = false;
                      } else {
                        var datatribunal = JSON.parse(Patient.dataTribunal);
                        if (datatribunal.gender === 'F') {
                          var sex = { id: 8, code: "2", name: "Femenino", showValue: "2. FEMENINO", }
                        }
                        if (datatribunal.gender === 'M') {
                          var sex = { id: 7, code: "1", name: "Masculino", showValue: "1. MASCULINO", }
                        }
                        if (datatribunal.personalIdTypeName !== '' && datatribunal.personalIdTypeName !== null) {
                          if ((datatribunal.personalIdTypeName).toUpperCase() === 'CÉDULA') {
                            var documentType = {
                              id: 2,
                              abbr: "CC",
                              name: "CEDULA"
                            }
                          }
                          if ((datatribunal.personalIdTypeName).toUpperCase() === 'PASAPORTE') {
                            var documentType = {
                              id: 8,
                              abbr: "PA",
                              name: "PASAPORTE"
                            }
                          }
                        } else {
                          var documentType = {
                            id: 0,
                            abbr: "",
                            name: ""
                          }

                        }

                        vm.tribunal = {
                          "id": vm.lis.id,
                          "documentType": documentType,
                          "patientId": datatribunal.personalId,
                          "name1": datatribunal.firstName === null || datatribunal.firstName === '' ? '' : (datatribunal.firstName).toUpperCase(),
                          "name2": datatribunal.middleName === null || datatribunal.middleName === '' ? '' : (datatribunal.middleName).toUpperCase(),
                          "lastName": datatribunal.lastName === null || datatribunal.lastName === '' ? '' : (datatribunal.lastName).toUpperCase(),
                          "surName": datatribunal.mothersMaidenName === null || datatribunal.mothersMaidenName === '' ? '' : (datatribunal.mothersMaidenName).toUpperCase(),
                          "sex": sex,
                          "birthday": datatribunal.birthDate === null || datatribunal.birthDate === '' ? '' : moment(datatribunal.birthDate, 'YYYY-MM-DD').valueOf(),
                          "status": 1
                        }

                        vm.loading = false;
                      }
                    }
                  }
                }
              },
              function (error) {
                vm.loading = false;
              }
            );
          }

          function searchByDate(callback) {
            var date = moment().format("YYYYMMDD");
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            //Invoca el metodo del servicio
            TribunalDS.getListpacient(auth.authToken, date, date).then(
              function (data) {
                if (data.status === 200) {
                  if (data.data.length === 0) {
                    vm.patient = [];
                  } else {
                    vm.patient = _.orderBy(data.data, "patientId", "asc");
                  }
                } else {
                  vm.patient = [];
                }
                if (callback !== undefined) {
                  callback();
                }
              },
              function (error) {
                if (error.data === null) {
                  vm.Error = error;
                  vm.ShowPopupError = true;
                }
                if (callback !== undefined) {
                  callback();
                }
              }
            );
          }


          function selectOrder(orderS) {
            $scope.order = orderS;
            setTimeout(function () {
              $scope.listener(orderS);
              UIkit.modal("#orderinconsistenspacient").hide();
            }, 100);
          }


          function save(id) {
            vm.loading = true;
            var error = false;
            var data = {
              "id": vm.lis.id,
              "documentType": '',
              "patientId": '',
              "name1": '',
              "name2": '',
              "lastName": '',
              "surName": '',
              "sex": '',
              "birthday": '',
              "status": 1
            }

            if (vm.selectlis.documentType === false && vm.selecttri.documentType === false) {
              error = true;
              logger.warning($filter('translate')('2056'));
            } else if (vm.selectlis.documentType === true) {
              data.documentType = vm.lis.documentType;
            } else if (vm.selecttri.documentType === true) {
              if (vm.selecttri.documentType.id === 0) {
                error = true;
                logger.warning($filter('translate')('2057'));
              } else {
                data.documentType = vm.tribunal.documentType;
              }

            }

            if (vm.selectlis.patientId === false && vm.selecttri.patientId === false) {
              error = true;
              logger.warning($filter('translate')('2058'));
            } else if (vm.selectlis.patientId === true) {
              data.patientId = vm.lis.patientId;
            } else if (vm.selecttri.patientId === true) {
              data.patientId = vm.tribunal.patientId;
            }

            if (vm.selectlis.name1 === false && vm.selecttri.name1 === false) {
              error = true;
              logger.warning($filter('translate')('2059'));
            } else if (vm.selectlis.name1 === true) {
              if (vm.lis.name1 === '') {
                error = true;
                logger.warning($filter('translate')('2060'));
              } else {
                data.name1 = vm.lis.name1;
              }
            } else if (vm.selecttri.name1 === true) {
              if (vm.tribunal.name1 === '') {
                error = true;
                logger.warning($filter('translate')('2060'));
              } else {
                data.name1 = vm.tribunal.name1;
              }
            }

            if (vm.selectlis.name2 === false && vm.selecttri.name2 === false) {
              error = true;
              logger.warning($filter('translate')('2061'));
            } else if (vm.selectlis.name2 === true) {
              data.name2 = vm.lis.name2;
            } else if (vm.selecttri.name2 === true) {
              data.name2 = vm.tribunal.name2;
            }

            if (vm.selectlis.lastName === false && vm.selecttri.lastName === false) {
              error = true;
              logger.warning($filter('translate')('2062'));
            } else if (vm.selectlis.lastName === true) {
              if (vm.lis.lastName === '') {
                error = true;
                logger.warning($filter('translate')('2063'));
              } else {
                data.lastName = vm.lis.lastName;
              }
            } else if (vm.selecttri.lastName === true) {
              if (vm.tribunal.lastName === '') {
                error = true;
                logger.warning($filter('translate')('2063'));
              } else {
                data.lastName = vm.tribunal.lastName;
              }
            }

            if (vm.selectlis.surName === false && vm.selecttri.surName === false) {
              error = true;
              logger.warning($filter('translate')('2064'));
            } else if (vm.selectlis.surName === true) {
              data.surName = vm.lis.surName;
            } else if (vm.selecttri.surName === true) {
              data.surName = vm.tribunal.surName;
            }

            if (vm.selectlis.birthday === false && vm.selecttri.birthday === false) {
              error = true;
              logger.warning($filter('translate')('2065'));
            } else if (vm.selectlis.birthday === true) {
              if (vm.lis.birthday === '') {
                error = true;
                logger.warning($filter('translate')('2066'));
              } else {
                data.birthday = vm.lis.birthday;
              }
            } else if (vm.selecttri.birthday === true) {
              if (vm.tribunal.birthday === '') {
                error = true;
                logger.warning($filter('translate')('2066'));
              } else {
                data.birthday = vm.tribunal.birthday;
              }
            }

            if (vm.selectlis.sex === false && vm.selecttri.sex === false) {
              error = true;
              logger.warning($filter('translate')('2067'));
              vm.loading = false;
            } else if (vm.selectlis.sex === true) {
              if (vm.lis.sex === undefined) {
                error = true;
                logger.warning($filter('translate')('2068'));
              } else {
                data.sex = vm.lis.sex;
              }
            } else if (vm.selecttri.sex === true) {
              if (vm.tribunal.sex === undefined) {
                error = true;
                logger.warning($filter('translate')('2068'));
              } else {
                data.sex = vm.tribunal.sex;
              }
            }
            if (error === false) {
              var auth = localStorageService.get("Enterprise_NT.authorizationData");
              //Invoca el metodo del servicio
              TribunalDS.updateinconsistence(auth.authToken, data).then(
                function (data) {
                  if (data.status === 200) {
                    vm.searchpatient();
                  }
                },
                function (error) {
                  vm.Error = error;
                  vm.ShowPopupError = true;
                  vm.loading = false;
                }
              );
            } else {
              vm.loading = false;
            }
          }
          function init() { }
          vm.init();
        },
      ],
      controllerAs: "orderinconsistenspacient",
    };
    return directive;
  }
})();
