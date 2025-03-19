/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.auditorder")
    .controller("auditorderController", auditorderController);

  auditorderController.$inject = [
    "common",
    "LZString",
    "$translate",
    "localStorageService",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "auditsorderDS",
    "orderDS",
    "paymenttypesDS",
  ];

  function auditorderController(
    common,
    LZString,
    $translate,
    localStorageService,
    $filter,
    $state,
    moment,
    $rootScope,
    auditsorderDS,
    orderDS,
    paymenttypesDS
  ) {
    var vm = this;
    vm.title = "auditorder";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0963");
    $rootScope.helpReference = "07.Audit/auditorder.htm";
    vm.manageRate =
      localStorageService.get("ManejoTarifa") === "True" ||
      localStorageService.get("ManejoTarifa") === true;
    vm.managePhysician =
      localStorageService.get("ManejoMedico") === "True" ||
      localStorageService.get("ManejoMedico") === true;
    vm.managedocumenttype =
      localStorageService.get("ManejoTipoDocumento") === "True" ||
      localStorageService.get("ManejoTipoDocumento") === true;
    vm.takesample =
      localStorageService.get("TomaMuestra") === "True" ||
      localStorageService.get("TomaMuestra") === true;
    vm.manageweight =
      localStorageService.get("ManejoPeso") === "True" ||
      localStorageService.get("ManejoPeso") === true;
    vm.managesize =
      localStorageService.get("ManejoTalla") === "True" ||
      localStorageService.get("ManejoTalla") === true;
    vm.managerace =
      localStorageService.get("ManejoRaza") === "True" ||
      localStorageService.get("ManejoRaza") === true;
    vm.traceability =
      localStorageService.get("Trazabilidad") === "True" ||
      localStorageService.get("Trazabilidad") === true;
    vm.report = false;
    vm.orderdigit = localStorageService.get("DigitosOrden");
    vm.cantdigit = parseInt(vm.orderdigit) + 4;
    vm.formatDateAge = localStorageService.get("FormatoFecha").toUpperCase();
    vm.formatDateHours =
      localStorageService.get("FormatoFecha").toUpperCase() + ", HH:mm:ss";
    vm.typefilter = "2";
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.modalError = modalError;
    vm.search = search;
    vm.ListOrder = [];
    vm.searchOrderComplete = searchOrderComplete;
    vm.windowOpenReport = windowOpenReport;
    vm.generateFileorder = generateFileorder;
    vm.dataorder = dataorder;
    vm.datachangeaudit = datachangeaudit;
    vm.typeaudit = "0";
    vm.auditByOrder = auditByOrder;
    vm.auditGeneral = auditGeneral;
    vm.auditConsolidated = auditConsolidated;
    vm.generateAuditReport = generateAuditReport;
    vm.sortData = sortData;
    vm.changetypeaudit = changetypeaudit;
    vm.sortOrder = sortOrder;
    vm.sortAudit = sortAudit;
    vm.generateConsolidatedFile = generateConsolidatedFile;
    vm.sortAuditorder = sortAuditorder;
    vm.sortAuditGeneral = sortAuditGeneral;
    vm.auditByCashOrder = auditByCashOrder;
    vm.paymenttypes = paymenttypes;
    $rootScope.pageview = 3;

    vm.paymenttypes();

    function sortAuditGeneral(data) {
      data.forEach(function (value) {
        value.patient =
          value.surName +
          " " +
          value.lastName +
          " " +
          value.name1 +
          " " +
          value.name2;
        value.dateOrder = moment(value.dateOrder).format(vm.formatDateHours);
        value.date = moment(value.date).format(vm.formatDateHours);
        if (value.fieldType === "P" || value.filedType === "O") {
          if (
            value.information &&
            Array.isArray(JSON.parse(value.information))
          ) {
            value.information = JSON.parse(value.information);
          } else {
            value.information = [
              {
                idDemographic: null,
              },
            ];
          }
        } else {
          value.information = [
            {
              idDemographic: null,
            },
          ];
        }
      });
      return data;
    }

    function sortAudit() {
      var listinformationtest = [];
      var listinformationsample = [];
      var listinformationorder = [];
      var listinformationpacient = [];
      if (vm.datachange.length !== 0) {
        vm.datachange = $filter("orderBy")(vm.datachange, "date");
        vm.datachange.forEach(function (value, key) {
          //trazabilidad de la prueba
          if (
            (value.fieldType === "T" && value.testType === 0) ||
            (value.fieldType === "BK" && value.testType === 0) ||
            (value.fieldType === "DO" && value.testType === 0) ||
            (value.fieldType === "RT" && value.testType === 0) ||
            (value.fieldType === "MD" && value.testType === 0) ||
            (value.fieldType === "RC" && value.testType === 0)
          ) {
            if (value.information === "0") {
              var test = {
                id: value.id,
                abbreviation: "",
                name: value.fieldDescription,
                action: [
                  {
                    name: $filter("translate")("1014"),
                    result: "",
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  },
                ],
              };
              listinformationtest.push(test);
            } else {
              var test = $filter("filter")(listinformationtest, function (e) {
                return e.id === value.id;
              });
              if (value.fieldType === "RC") {
                var statetest = {
                  name: "Comentario del resultado",
                  resultemplate: value.information,
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                test[0].action.push(statetest);
              } else if (value.fieldType === "DO" && value.action === "I") {
                var statetest = {
                  name: $filter("translate")("3659"),
                  result: value.fieldDescription + "-" + value.information,
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                test[0].action.push(statetest);
              } else if (value.fieldType === "DO" && value.action === "D") {
                var statetest = {
                  name: $filter("translate")("3660"),
                  result: value.fieldDescription + "-" + value.information,
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                test[0].action.push(statetest);
              } else if (value.fieldType === "RT") {
                var statetest = {
                  name: "Ingreso platilla de resultados",
                  resultemplate: JSON.parse(value.information),
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                test[0].action.push(statetest);
              } else if (value.fieldType === "MD") {
                var MD = JSON.parse(value.information);
                if (MD[0].id === undefined) {
                  var statetest = {
                    name: "Antibiograma-ingreso microorganismo",
                    sensitive: MD,
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  test[0].action.push(statetest);
                } else {
                  var statetest = {
                    name: "Antibiograma-Ingreso antibiótico",
                    sensitive: MD,
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  test[0].action.push(statetest);
                }
              } else if (value.fieldType === "MDC") {
                var statetest = {
                  name: "Comentario del antibigrama",
                  sensitive: value.information,
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                test[0].action.push(statetest);
              } else if (value.action === "D") {
                var statetest = {
                  name: $filter("translate")("0954"),
                  result: "",
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                test[0].action.push(statetest);
              } else if (value.fieldType === "BK") {
                var statetest = {
                  name: $filter("translate")("1541"),
                  result: "",
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                test[0].action.push(statetest);
              } else {
                switch (value.information) {
                  case "1":
                    var name = $filter("translate")("0355");
                    break;
                  case "2":
                    var name = $filter("translate")("0019");
                    break;
                  case "3":
                    var name = $filter("translate")("0055");
                    break;
                  case "4":
                    var name = $filter("translate")("0751");
                    break;
                  case "5":
                    var name = $filter("translate")("0752");
                    break;
                  case "6":
                    var name = "Entrega final";
                    break;
                  default:
                    var name = "";
                    break;
                }
                var delivery =
                  $filter("translate")("0000") === "enUsa"
                    ? value.deliveryEnUSA
                    : value.deliveryEsCo;
                var statetest = {
                  name: name,
                  result: value.result,
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                  deliveryType: delivery,
                  sendingType:
                    value.delivery === 60
                      ? value.comment === "0"
                        ? $filter("translate")("1890")
                        : $filter("translate")("1891")
                      : null,
                  receivesPerson:
                    delivery !== "Pdf" ? value.receivesPerson : "",
                };
                test[0].action.push(statetest);
              }
            }
          }
          //trazabilidad de la muestra
          if (value.fieldType === "S" || value.fieldType === "SS") {
            if (value.information === "3" || value.information === "2") {
              var sample = {
                id: value.id,
                abbreviation: "",
                name: value.fieldDescription,
                action: [
                  {
                    name: $filter("translate")("1014"),
                    result: "",
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  },
                ],
              };
              listinformationsample.push(sample);
            } else {
              var sample = $filter("filter")(
                listinformationsample,
                function (e) {
                  return e.id === value.id;
                }
              );
              if (value.action === "D") {
                var statesample = {
                  name: $filter("translate")("0954"),
                  result: "",
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                sample[0].action.push(statesample);
              } else if (value.fieldType === "SS") {
                var posicion = JSON.parse(value.information);
                var statesample = {
                  name: $filter("translate")("0801"),
                  result: "",
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment:
                    "Gradilla: " +
                    posicion.rack.name +
                    "Posicion: " +
                    posicion.position,
                };
                sample[0].action.push(statesample);
              } else {
                switch (value.information) {
                  case "-1":
                    var name = $filter("translate")("0413");
                    break;
                  case "0":
                    var name = $filter("translate")("0128");
                    break;
                  case "1":
                    var name = $filter("translate")("3126");
                    break;
                  case "3":
                    var name = $filter("translate")("1540");
                    break;
                  case "4":
                    var name =
                      value.destination === null
                        ? $filter("translate")("0572")
                        : value.destination;
                    break;
                  default:
                    var name = "";
                    break;
                }
                var statesample = {
                  name: name,
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                sample[0].action.push(statesample);
              }
            }
          }
          //trazabilidad de la orden
          if (value.fieldType === "O" || value.fieldType === "OC") {
            if (value.fieldType === "OC") {
            } else {
              if (value.action === "D") {
                var auditorder = {
                  before: "ACTIVA",
                  after: "INACTIVA",
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                vm.auditorderactive.push(auditorder);
              } else if (value.action === "I") {
                var datademo = JSON.parse(value.information);
                datademo.forEach(function (demo) {
                  var order = {
                    id: demo.idDemographic,
                    name: demo.demographic,
                    action: [
                      {
                        name: $filter("translate")("1014"),
                        field: demo.value,
                        date: moment(value.date).format(vm.formatDateHours),
                        user: value.username,
                        comment: value.comment,
                      },
                    ],
                  };
                  listinformationorder.push(order);
                });
              } else {
                var datademo = JSON.parse(value.information);
                if (datademo.orderNumber !== undefined) {
                  var auditorder = {
                    before: "Inactiva",
                    after: "Activa",
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  vm.auditorderactive.push(auditorder);
                } else {
                  if (typeof datademo === "number") {
                    var auditorder = {
                      before: "Sin turno",
                      after: "Turno " + datademo,
                      date: moment(value.date).format(vm.formatDateHours),
                      user: value.username,
                      comment: value.comment,
                    };
                    vm.auditorderactive.push(auditorder);
                  } else {
                    datademo.forEach(function (demo) {
                      var order = $filter("filter")(
                        listinformationorder,
                        function (e) {
                          return e.id === demo.idDemographic;
                        }
                      );
                      var statesample = {
                        name: "modificado",
                        field: demo.value,
                        date: moment(value.date).format(vm.formatDateHours),
                        user: value.username,
                        comment: value.comment,
                      };
                      order[0].action.push(statesample);
                    });
                  }
                }
              }
            }
          }
          // trazabilidad del paciente
          if (value.fieldType === "P") {
            if (value.action === "I") {
              var datademo = JSON.parse(value.information);
              datademo.forEach(function (demo) {
                var order = {
                  id: demo.idDemographic,
                  name: demo.demographic,
                  action: [
                    {
                      name: $filter("translate")("1014"),
                      field: demo.value,
                      date: moment(value.date).format(vm.formatDateHours),
                      user: value.username,
                      comment: value.comment,
                    },
                  ],
                };
                listinformationpacient.push(order);
              });
            } else {
              if (listinformationpacient.length === 0) {
                var datademo = JSON.parse(value.information);
                datademo.forEach(function (demo) {
                  var order = {
                    id: demo.idDemographic,
                    name: demo.demographic,
                    action: [
                      {
                        name: $filter("translate")("1014"),
                        field: demo.value,
                        date: moment(value.date).format(vm.formatDateHours),
                        user: value.username,
                        comment: value.comment,
                      },
                    ],
                  };
                  listinformationpacient.push(order);
                });
              } else {
                var datademo = JSON.parse(value.information);
                datademo.forEach(function (demo) {
                  var order = $filter("filter")(
                    listinformationpacient,
                    function (e) {
                      return e.id === demo.idDemographic;
                    }
                  );
                  if (order.length === 0) {
                    var order = {
                      id: demo.idDemographic,
                      name: demo.demographic,
                      action: [
                        {
                          name: $filter("translate")("1014"),
                          field: demo.value,
                          date: moment(value.date).format(vm.formatDateHours),
                          user: value.username,
                          comment: value.comment,
                        },
                      ],
                    };
                    listinformationpacient.push(order);
                  } else {
                    var statesample = {
                      name: "modificado",
                      field: demo.value,
                      date: moment(value.date).format(vm.formatDateHours),
                      user: value.username,
                      comment: value.comment,
                    };
                    order[0].action.push(statesample);
                  }
                });
              }
            }
          }
        });
        vm.auditsample = listinformationsample;
        vm.audittest = listinformationtest;
        vm.auditdemographicorder = listinformationorder;
        vm.auditdemographicpacient = listinformationpacient;
      }
    }

    function sortAuditorder() {
      var listinformationtest = [];
      var listinformationsample = [];
      var listinformationorder = [];
      var listinformationpacient = [];
      if (vm.datachange.length !== 0) {
        vm.datachange = $filter("orderBy")(vm.datachange, "date");
        vm.datachange.forEach(function (value, key) {
          //trazabilidad de la prueba
          if (
            (value.fieldType === "T" && value.testType === 0) ||
            (value.fieldType === "BK" && value.testType === 0) ||
            (value.fieldType === "DO" && value.testType === 0) ||
            (value.fieldType === "RT" && value.testType === 0) ||
            (value.fieldType === "MD" && value.testType === 0) ||
            (value.fieldType === "RC" && value.testType === 0)
          ) {
            if (value.information === "0") {
              var test = {
                id: value.id,
                abbreviation: "",
                name: value.fieldDescription,
                action: [
                  {
                    name: $filter("translate")("1014"),
                    result: "",
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  },
                ],
              };
              listinformationtest.push(test);
            } else {
              var test = $filter("filter")(listinformationtest, function (e) {
                return e.id === value.id;
              });
              if (test.length > 0) {
                if (value.fieldType === "RC") {
                  var statetest = {
                    name: "Comentario del resultado",
                    resultemplate: value.information,
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  test[0].action.push(statetest);
                } else if (value.fieldType === "DO" && value.action === "I") {
                  var statetest = {
                    name: $filter("translate")("3659"),
                    result: value.information,
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  test[0].action.push(statetest);
                } else if (value.fieldType === "DO" && value.action === "D") {
                  var statetest = {
                    name: $filter("translate")("3660"),
                    result: value.information,
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment:'Motivo: '+ value.comment,
                  };
                  test[0].action.push(statetest);
                } else if (value.fieldType === "RT") {
                  var statetest = {
                    name: "Ingreso platilla de resultados",
                    resultemplate: JSON.parse(value.information),
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  test[0].action.push(statetest);
                } else if (value.fieldType === "MD") {
                  var MD = JSON.parse(value.information);
                  if (MD[0].id === undefined) {
                    var statetest = {
                      name: "Antibiograma-ingreso microorganismo",
                      sensitive: MD,
                      date: moment(value.date).format(vm.formatDateHours),
                      user: value.username,
                      comment: value.comment,
                    };
                    test[0].action.push(statetest);
                  } else {
                    var statetest = {
                      name: "Antibiograma-Ingreso antibiótico",
                      sensitive: MD,
                      date: moment(value.date).format(vm.formatDateHours),
                      user: value.username,
                      comment: value.comment,
                    };
                    test[0].action.push(statetest);
                  }
                } else if (value.fieldType === "MDC") {
                  var statetest = {
                    name: "Comentario del antibigrama",
                    sensitive: value.information,
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  test[0].action.push(statetest);
                } else if (value.action === "D") {
                  var statetest = {
                    name: $filter("translate")("0954"),
                    result: "",
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  test[0].action.push(statetest);
                } else if (value.fieldType === "BK") {
                  var statetest = {
                    name: $filter("translate")("1541"),
                    result: "",
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  test[0].action.push(statetest);
                } else {
                  switch (value.information) {
                    case "1":
                      var name = $filter("translate")("0355");
                      break;
                    case "2":
                      var name = $filter("translate")("0019");
                      break;
                    case "3":
                      var name = $filter("translate")("0055");
                      break;
                    case "4":
                      var name = $filter("translate")("0751");
                      break;
                    case "5":
                      var name = $filter("translate")("0752");
                      break;
                    case "6":
                      var name = "Entrega final";
                      break;
                    default:
                      var name = "";
                      break;
                  }
                  var delivery =
                    $filter("translate")("0000") === "enUsa"
                      ? value.deliveryEnUSA
                      : value.deliveryEsCo;
                  var statetest = {
                    name: name,
                    result: value.result,
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                    deliveryType: delivery,
                    sendingType:
                      value.delivery === 60
                        ? value.comment === "0"
                          ? $filter("translate")("1890")
                          : $filter("translate")("1891")
                        : null,
                    receivesPerson:
                      delivery !== "Pdf" ? value.receivesPerson : "",
                  };
                  test[0].action.push(statetest);
                }
              }
            }
          }
          //trazabilidad de la muestra
          if (value.fieldType === "S" || value.fieldType === "SS") {
            
            if (value.information === "3" || value.information === "2") {
              
              var sample = {
                id: value.id,
                abbreviation: "",
                name: value.fieldDescription,
                action: [
                  {
                    name: $filter("translate")("1014"),
                    result: "",
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  },
                ],
                
              };
              
              listinformationsample.push(sample);
            } else {
              var sample = $filter("filter")(
                listinformationsample,
                function (e) {
                  return e.id === value.id;
                }
              );
              console.log("if3")
              if (value.action === "D") {
                var statesample = {
                  name: $filter("translate")("0954"),
                  result: "",
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                if (sample.length > 0) {
                  sample[0].action.push(statesample);
                }
              } else if (value.fieldType === "SS") {
                var posicion = JSON.parse(value.information);
                var statesample = {
                  name: $filter("translate")("0801"),
                  result: "",
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment:
                    "Gradilla: " +
                    posicion.rack.name +
                    "Posicion: " +
                    posicion.position,
                };
                if (sample.length > 0) {
                  sample[0].action.push(statesample);
                }
                
              } else {
                switch (value.information) {
                  case "-1":
                    var name = $filter("translate")("0413");
                    break;
                  case "0":
                    var name = $filter("translate")("0128");
                    break;
                  case "1":
                    var name = $filter("translate")("3126");
                    break;
                  case "3":
                    var name = $filter("translate")("1540");
                    break;
                  case "4":
                    var name =
                      value.destination === null
                        ? $filter("translate")("0572")
                        : value.destination;
                    break;
                  default:
                    var name = "";
                    break;
                }
                var statesample = {
                  name: name,
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                
                if (sample.length > 0) {
                  sample[0].action.push(statesample);
                }

                
              }
            }
          }
          //trazabilidad de la orden
          if (value.fieldType === "O" || value.fieldType === "OC") {
            if (value.fieldType === "OC") {
            } else {
              if (value.action === "D") {
                var auditorder = {
                  before: "ACTIVA",
                  after: "INACTIVA",
                  date: moment(value.date).format(vm.formatDateHours),
                  user: value.username,
                  comment: value.comment,
                };
                vm.auditorderactive.push(auditorder);
              } else if (value.action === "I") {
                var datademo = JSON.parse(value.information);
                datademo.forEach(function (demo) {
                  var order = {
                    id: demo.idDemographic,
                    name: demo.demographic,
                    action: [
                      {
                        name: $filter("translate")("1014"),
                        field: demo.value,
                        date: moment(value.date).format(vm.formatDateHours),
                        user: value.username,
                        comment: value.comment,
                      },
                    ],
                  };
                  listinformationorder.push(order);
                });
              } else {
                var datademo = JSON.parse(value.information);
                if (datademo.orderNumber !== undefined) {
                  var auditorder = {
                    before: "Inactiva",
                    after: "Activa",
                    date: moment(value.date).format(vm.formatDateHours),
                    user: value.username,
                    comment: value.comment,
                  };
                  vm.auditorderactive.push(auditorder);
                } else {
                  if (typeof datademo === "number") {
                    var auditorder = {
                      before: "Sin turno",
                      after: "Turno " + datademo,
                      date: moment(value.date).format(vm.formatDateHours),
                      user: value.username,
                      comment: value.comment,
                    };
                    vm.auditorderactive.push(auditorder);
                  } else {
                    datademo.forEach(function (demo) {
                      var order = $filter("filter")(
                        listinformationorder,
                        function (e) {
                          return e.id === demo.idDemographic;
                        }
                      );
                      if (order.length !== 0) {
                        var statesample = {
                          name: "modificado",
                          field: demo.value,
                          date: moment(value.date).format(vm.formatDateHours),
                          user: value.username,
                          comment: value.comment,
                        };
                        order[0].action.push(statesample);
                      }
                    });
                  }
                }
              }
            }
          }
          // trazabilidad del paciente
          if (value.fieldType === "P") {
            if (value.action === "I") {
              var datademo = JSON.parse(value.information);
              datademo.forEach(function (demo) {
                var order = {
                  id: demo.idDemographic,
                  name: demo.demographic,
                  action: [
                    {
                      name: $filter("translate")("1014"),
                      field: demo.value,
                      date: moment(value.date).format(vm.formatDateHours),
                      user: value.username,
                      comment: value.comment,
                    },
                  ],
                };
                listinformationpacient.push(order);
              });
            } else {
              if (listinformationpacient.length === 0) {
                var datademo = JSON.parse(value.information);
                datademo.forEach(function (demo) {
                  var order = {
                    id: demo.idDemographic,
                    name: demo.demographic,
                    action: [
                      {
                        name: $filter("translate")("1014"),
                        field: demo.value,
                        date: moment(value.date).format(vm.formatDateHours),
                        user: value.username,
                        comment: value.comment,
                      },
                    ],
                  };
                  listinformationpacient.push(order);
                });
              } else {
                var datademo = JSON.parse(value.information);
                datademo.forEach(function (demo) {
                  var order = $filter("filter")(
                    listinformationpacient,
                    function (e) {
                      return e.id === demo.idDemographic;
                    }
                  );
                  if (order.length === 0) {
                    var order = {
                      id: demo.idDemographic,
                      name: demo.demographic,
                      action: [
                        {
                          name: $filter("translate")("1014"),
                          field: demo.value,
                          date: moment(value.date).format(vm.formatDateHours),
                          user: value.username,
                          comment: value.comment,
                        },
                      ],
                    };
                    listinformationpacient.push(order);
                  } else {
                    var statesample = {
                      name: "modificado",
                      field: demo.value,
                      date: moment(value.date).format(vm.formatDateHours),
                      user: value.username,
                      comment: value.comment,
                    };
                    order[0].action.push(statesample);
                  }
                });
              }
            }
          }
        });
        vm.auditsample = listinformationsample;
        vm.audittest = listinformationtest;
        vm.auditdemographicorder = listinformationorder;
        vm.auditdemographicpacient = listinformationpacient;
      }
      vm.searchOrderComplete();
    }

    function sortOrder() {
      vm.order = [
        {
          name: $filter("translate")("0088").toUpperCase(),
          title:
            vm.data.type.id === undefined
              ? ""
              : vm.data.type.code + "." + vm.data.type.name,
        },
        {
          name: $filter("translate")("0003").toUpperCase(),
          title:
            vm.data.branch.id === undefined
              ? ""
              : vm.data.branch.code + "." + vm.data.branch.name,
        },
        {
          name: $filter("translate")("0090").toUpperCase(),
          title:
            vm.data.service.id === undefined
              ? ""
              : vm.data.service.code + "." + vm.data.service.name,
        },
        {
          name: $filter("translate")("0085").toUpperCase(),
          title:
            vm.data.account.id === undefined
              ? ""
              : vm.data.account.nit + "." + vm.data.account.name,
        },
        {
          name: $filter("translate")("0886").toUpperCase(),
          title: vm.data.turn,
        },
      ];

      if (vm.manageRate) {
        var object = {
          name: $filter("translate")("0087").toUpperCase(),
          title:
            vm.data.rate.id === undefined
              ? ""
              : vm.data.rate.code + "." + vm.data.rate.name,
        };
        vm.order.push(object);
      }

      if (vm.managePhysician) {
        var object = {
          name: $filter("translate")("0086").toUpperCase(),
          title:
            vm.data.physician.id === undefined
              ? ""
              : vm.data.physician.code +
                "." +
                vm.data.physician.name +
                " " +
                vm.data.physician.lastName,
        };
        vm.order.push(object);
      }

      vm.data.demographics.forEach(function (demographic, index) {
        var object = {
          name:
            demographic.demographic !== undefined
              ? demographic.demographic.toUpperCase()
              : "",
          title: demographic.value !== undefined ? demographic.value : "",
        };
        vm.order.push(object);
      });

      if (vm.managedocumenttype) {
        var object = {
          name: $filter("translate")("0833").toUpperCase(),
          title:
            vm.data.patient.documentType.id === undefined
              ? ""
              : (
                  vm.data.patient.documentType.abbr +
                  "." +
                  vm.data.patient.documentType.name
                ).toUpperCase(),
        };
        vm.history.push(object);
      }

      vm.history.push(
        {
          name: $filter("translate")("0135").toUpperCase(),
          title: vm.data.patient.email,
        },
        {
          name: $filter("translate")("0188").toUpperCase(),
          title: vm.data.patient.phone,
        },
        {
          name: $filter("translate")("0187").toUpperCase(),
          title: vm.data.patient.address,
        }
      );

      if (vm.manageweight) {
        var object = {
          name: $filter("translate")("0238").toUpperCase(),
          title: vm.data.patient.weight,
        };
        vm.history.push(object);
      }

      if (vm.managesize) {
        var object = {
          name: $filter("translate")("0239").toUpperCase(),
          title: vm.data.patient.size,
        };
        vm.history.push(object);
      }

      if (vm.managerace) {
        var object = {
          name: $filter("translate")("0091").toUpperCase(),
          title:
            vm.data.patient.race.id === undefined
              ? ""
              : (
                  vm.data.patient.race.code +
                  "." +
                  vm.data.patient.race.name
                ).toUpperCase(),
        };
        vm.history.push(object);
      }

      vm.data.patient.demographics.forEach(function (demographic, index) {
        var object = {
          name:
            demographic.demographic !== undefined
              ? demographic.demographic.toUpperCase()
              : "",
          title: demographic.value !== undefined ? demographic.value : "",
        };
        vm.history.push(object);
      });

      if (vm.data.comments.length === 0) {
        vm.comment = [
          {
            comment: "-- " + $filter("translate")("0392") + "-- ",
            user: {
              userName: "",
            },
          },
        ];
      } else {
        vm.data.comments.forEach(function (data, index) {
          if (data.comment.search("content") === -1) {
            var object = {
              comment: data.comment,
              user: {
                userName:
                  $filter("translate")("0001") + " : " + data.user.userName,
              },
            };
            vm.comment.push(object);
          } else {
            var comment = JSON.parse(data.comment).content;
            var object = {
              comment: comment.slice(1, comment.length - 1),
              user: {
                userName:
                  $filter("translate")("0001") + " : " + data.user.userName,
              },
            };
          }
          vm.comment.push(object);
        });
      }
    }

    function changetypeaudit() {
      vm.datareport = "";
      vm.ListOrder = [];
    }

    function dataorder(order) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.loadingdata = true;
      vm.history = [];
      vm.order = [];
      vm.comment = [];
      vm.numberorder = order;
      return orderDS.getOrder(auth.authToken, vm.numberorder).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.data = data.data;
            vm.sortOrder();
            vm.datachangeaudit();
          }
        },
        function (error) {
          vm.modalError(error);
          vm.loadingdata = false;
        }
      );
    }

    function datachangeaudit() {
      vm.auditdemographic = [];
      vm.auditorderactive = [];
      vm.auditdemographicorder = [];
      vm.auditdemographicpacient = [];
      vm.audittest = [];
      vm.auditsample = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.loadingdata = true;
      return auditsorderDS.getorder(auth.authToken, vm.numberorder).then(
        function (data) {
          if (data.status === 200) {
            vm.datachange = data.data;
            vm.sortAuditorder();
          } else {
            UIkit.modal("#nofoundfilter").show();
            vm.loading = false;
            vm.loadingdata = false;
          }
        },
        function (error) {
          vm.loading = false;
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }

    function searchOrderComplete() {
      vm.datareport = [
        {
          demographicheadorder: vm.order,
          demographicheadhistory: vm.history,
          comentorder: vm.comment,
          auditorder: vm.auditorderactive,
          auditdemographicorder: vm.auditdemographicorder,
          auditdemographicpacient: vm.auditdemographicpacient,
          audittest: vm.audittest,
          auditsample: vm.auditsample,
        },
      ];
      vm.loadingdata = false;
      vm.generateFileorder();
    }

    function generateFileorder() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.variables = {
        abbreviation: "CLT",
        date: moment().format("DD/MM/YYYY, HH:mm:ss"),
        Order: vm.data.orderNumber,
        patient:
          vm.data.patient.name1 +
          " " +
          vm.data.patient.name2 +
          " " +
          vm.data.patient.lastName +
          " " +
          vm.data.patient.surName,
        patientId: vm.data.patient.patientId,
        sex:
          $filter("translate")("0000") === "esCo"
            ? vm.data.patient.sex.esCo
            : vm.data.patient.sex.enUas,
        birthday: common.getAgeAsString(
          moment(vm.data.patient.birthday).format(vm.formatDateAge),
          vm.formatDateAge
        ),
        dateentry: moment(vm.data.createdDate).format("DD/MM/YYYY"),
        username: auth.userName,
        Estado: "Activo",
        datedeleted: "",
        deleted: "",
      };
      vm.pathreport = "/Report/audit/auditorder/auditorder.mrt";
      vm.openreport = false;
      vm.report = false;
      vm.windowOpenReport();
    }
    function windowOpenReport(type) {
      if (vm.datareport.length > 0 || type) {
        var parameterReport = {};
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = JSON.stringify(
          $translate.getTranslationTable()
        );
        var datareport = LZString.compressToUTF16(
          JSON.stringify(vm.datareport)
        );
        localStorageService.set("parameterReport", parameterReport);
        localStorageService.set("dataReport", datareport);
        window.open("/viewreport/viewreport.html");
      } else {
        UIkit.modal("#modalReportError").show();
      }
    }

    function auditByOrder() {
      var consult = {
        rangeType: 1,
        init: vm.rangeInit,
        end: vm.rangeEnd,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.loadingdata = true;
      return auditsorderDS.rangeorder(auth.authToken, consult).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.ListOrder =
              data.data.length === 0 ? data.data : removeData(data);
          } else {
            UIkit.modal("#nofoundfilter").show();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function paymenttypes() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.loadingdata = true;
      return paymenttypesDS.get(auth.authToken).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.listpaymenttypes = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function auditByCashOrder() {
      var order = vm.listYear.id + vm.codeordernumberorden; //202204260024;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.loadingdata = true;
      return auditsorderDS.getTraceabilityCashOrder(auth.authToken, order).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            var datahead = [];
            var datapayments = [];
            for (var i = 0; i < data.data.length; i++) {
              var dataconvert = JSON.parse(data.data[i].information);

              var data1 = {
                accion: data.data[i].action,
                usuario: data.data[i].username,
                campo: $filter("translate")("0443"),
                valor: dataconvert.header.subTotal,
                fecha: moment(data.data[i].updateDate).format(
                  vm.formatDateHours
                ),
              };
              datahead.push(data1);

              var data2 = {
                accion: data.data[i].action,
                usuario: data.data[i].username,
                campo: $filter("translate")("1548"),
                valor: dataconvert.header.copay,
                fecha: moment(data.data[i].updateDate).format(
                  vm.formatDateHours
                ),
              };

              datahead.push(data2);

              var data3 = {
                accion: data.data[i].action,
                usuario: data.data[i].username,
                campo: $filter("translate")("0931"),
                valor: dataconvert.header.discountValue,
                fecha: moment(data.data[i].updateDate).format(
                  vm.formatDateHours
                ),
              };

              datahead.push(data3);

              var data4 = {
                accion: data.data[i].action,
                usuario: data.data[i].username,
                campo: $filter("translate")("0471"),
                valor: dataconvert.header.totalPaid,
                fecha: moment(data.data[i].updateDate).format(
                  vm.formatDateHours
                ),
              };

              datahead.push(data4);

              for (var j = 0; j < dataconvert.payments.length; j++) {
                var dataj = {
                  accion: data.data[i].action,
                  usuario: data.data[i].username,
                  campo: _.filter(vm.listpaymenttypes, function (o) {
                    return o.id === dataconvert.payments[j].paymentType.id;
                  })[0].name,
                  valor: dataconvert.payments[j].payment,
                  fecha: moment(dataconvert.payments[j].entryDate).format(
                    vm.formatDateHours
                  ),
                };

                datapayments.push(dataj);
              }
            }
            var datafinal = {
              head: datahead,
              payments: datapayments,
            };
            vm.datareport = datafinal;
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            vm.variables = {
              abbreviation: "CLT",
              date: moment().format("DD/MM/YYYY, HH:mm:ss"),
              username: auth.userName,
              order: order,
            };
            vm.pathreport = "/Report/audit/auditcash/auditcash.mrt";
            vm.openreport = false;
            vm.report = false;
            vm.windowOpenReport(true);
          } else {
            UIkit.modal("#nofoundfilter").show();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function generateAuditReport() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.variables = {
        abbreviation: "CLT",
        date: moment().format("DD/MM/YYYY, HH:mm:ss"),
        username: auth.userName,
      };
      vm.pathreport = "/Report/audit/auditgeneral/auditgeneral.mrt";
      vm.openreport = false;
      vm.report = false;
      vm.windowOpenReport(true);
    }

    function sortData(data) {
      var orders = [];
      var patients = [];
      data.forEach(function (value) {
        value.patient =
          value.surName +
          " " +
          value.lastName +
          " " +
          value.name1 +
          " " +
          value.name2;
        value.date = moment(value.date).format(vm.formatDateHours);
        if (value.order === 0) {
          if (
            value.information &&
            Array.isArray(JSON.parse(value.information))
          ) {
            value.information = JSON.parse(value.information);
          } else {
            value.information = [
              {
                idDemographic: null,
              },
            ];
          }
          patients.push(value);
        } else {
          value.dateOrder = moment(value.dateOrder).format(vm.formatDateHours);
          if (value.fieldType === "O") {
            if (
              value.information &&
              Array.isArray(JSON.parse(value.information))
            ) {
              value.information = JSON.parse(value.information);
            } else {
              value.information = [
                {
                  idDemographic: null,
                },
              ];
            }
          } else {
            value.information = [
              {
                idDemographic: null,
              },
            ];
          }
          orders.push(value);
        }
      });
      return { orders: orders, patients: patients };
    }

    function auditGeneral() {
      vm.loadingdata = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return auditsorderDS
        .getgeneral(auth.authToken, vm.rangeInit, vm.rangeEnd)
        .then(
          function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              vm.datareport =
                data.data.length > 0 ? vm.sortAuditGeneral(data.data) : "";
              vm.generateAuditReport();
            } else {
              UIkit.modal("#nofoundfilter").show();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }

    function auditConsolidated() {
      vm.loadingdata = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var consult = {
        rangeType: 1,
        init: vm.rangeInit,
        end: vm.rangeEnd,
      };
      return auditsorderDS.getconsolidated(auth.authToken, consult).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.consolidated = [];
            data.data.forEach(function (value) {
              vm.order = [];
              vm.history = [];
              vm.comment = [];
              vm.auditdemographic = [];
              vm.auditorderactive = [];
              vm.auditdemographicorder = [];
              vm.auditdemographicpacient = [];
              vm.audittest = [];
              vm.auditsample = [];
              vm.data = value.order;
              vm.datachange = value.audits;
              vm.sortOrder();
              vm.sortAudit();
              vm.generalData = {
                Order: vm.data.orderNumber,
                patient:
                  vm.data.patient.surName +
                  " " +
                  vm.data.patient.lastName +
                  " " +
                  vm.data.patient.name1 +
                  " " +
                  vm.data.patient.name2,
                patientId: vm.data.patient.patientId,
                sex:
                  $filter("translate")("0000") === "esCo"
                    ? vm.data.patient.sex.esCo
                    : vm.data.patient.sex.enUas,
                birthday: common.getAgeAsString(
                  moment(vm.data.patient.birthday).format(vm.formatDateAge),
                  vm.formatDateAge
                ),
                dateentry: moment(vm.data.createdDate).format("DD/MM/YYYY"),
              };
              vm.consolidated.push({
                demographicheadorder: vm.order,
                demographicheadhistory: vm.history,
                comentorder: vm.comment,
                auditorder: vm.auditorderactive,
                auditdemographicorder: vm.auditdemographicorder,
                auditdemographicpacient: vm.auditdemographicpacient,
                audittest: vm.audittest,
                auditsample: vm.auditsample,
                general: vm.generalData,
              });
            });
            vm.generateConsolidatedFile();
          } else {
            UIkit.modal("#nofoundfilter").show();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function generateConsolidatedFile() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.variables = {
        abbreviation: "CLT",
        date: moment().format("DD/MM/YYYY, HH:mm:ss"),
        username: auth.userName,
        Estado: "Activo",
        datedeleted: "",
        deleted: "",
      };
      vm.pathreport = "/Report/audit/auditconsolidated/auditconsolidated.mrt";
      vm.openreport = false;
      vm.report = false;
      vm.datareport = vm.consolidated;
      vm.windowOpenReport();
    }

    function search() {
      if (vm.typeaudit === "0") {
        vm.auditByOrder();
      } else if (vm.typeaudit === "1") {
        vm.auditGeneral();
      } else {
        vm.auditConsolidated();
      }
    }

    function removeData(data) {
      data.data.forEach(function (value, key) {
        data.data[key].patient.gendertraduc =
          $filter("translate")("0000") === "esCo"
            ? data.data[key].patient.sex.esCo
            : data.data[key].patient.sex.enUas;
        data.data[key].patient.age = common.getAgeAsString(
          moment(data.data[key].patient.birthday).format(vm.formatDateAge),
          vm.formatDateAge
        );
      });
      return data.data;
    }
    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }
    vm.keyselect = keyselect;
    function keyselect($event) {
      var keyCode =
        $event !== undefined ? $event.which || $event.keyCode : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        if (vm.codeordernumberorden.length < vm.cantdigit) {
          vm.codeordernumberorden =
            vm.codeordernumberorden === "" ? 0 : vm.codeordernumberorden;
          if (vm.codeordernumberorden.length === parseInt(vm.orderdigit) + 1) {
            vm.numberordensearch =
              vm.listYear.id +
              moment().format("MM") +
              "0" +
              vm.codeordernumberorden;
          } else if (
            vm.codeordernumberorden.length ===
            parseInt(vm.orderdigit) + 2
          ) {
            vm.numberordensearch =
              vm.listYear.id + moment().format("MM") + vm.codeordernumberorden;
          } else if (
            vm.codeordernumberorden.length ===
            parseInt(vm.orderdigit) + 3
          ) {
            vm.numberordensearch =
              vm.listYear.id + "0" + vm.codeordernumberorden;
          } else {
            vm.numberordensearch =
              vm.listYear.id +
              common
                .getOrderComplete(vm.codeordernumberorden, vm.orderdigit)
                .substring(4);
          }
          vm.codeordernumberorden = vm.numberordensearch.substring(4);
          vm.auditByCashOrder();
        } else if (vm.codeordernumberorden.length === vm.cantdigit) {
          vm.numberordensearch = vm.listYear.id + vm.numberorden;
          vm.auditByCashOrder();
        }
      } else {
        if (!(keyCode >= 48 && keyCode <= 57)) {
          $event.preventDefault();
        }
      }
    }
    vm.getListYear = getListYear;
    function getListYear() {
      vm.loading = false;
      vm.listYear = common.getListYear();
      vm.listYear.id = moment().year();
    }

    function init() {
      vm.getListYear();
    }

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
      vm.loadingdata = false;
    }

    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
