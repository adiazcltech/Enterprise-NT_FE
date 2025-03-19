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
    .filter("startFrom", function () {
      return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
      };
    })
    .directive("eventloadexcel", eventloadexcel);
  eventloadexcel.$inject = [
    "localStorageService",
    "logger",
    "moment",
    "patientDS",
    "orderDS",
    "LZString",
    "$filter",
    "resultsentryDS",
    "$translate",
  ];
  /* @ngInject */
  function eventloadexcel(
    localStorageService,
    logger,
    moment,
    patientDS,
    orderDS,
    LZString,
    $filter,
    resultsentryDS,
    $translate
  ) {
    var directive = {
      templateUrl: "app/widgets/userControl/eventloadexcel.html",
      restrict: "EA",
      scope: {
        openmodal: "=?openmodal",
        order: "=?order",
        demopatien: "=?demopatien",
        testlist: "=?testlist",
      },
      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.ProcessExcel = ProcessExcel;
          vm.loadexcel = loadexcel;
          vm.afterLoad = afterLoad;
          vm.demo = [];
          vm.formatDateBirthday = 'D/MM/YY';
          vm.format = localStorageService.get("FormatoFecha");
          vm.showDocumentType =
            localStorageService.get("ManejoTipoDocumento") === "True"
              ? true
              : false;
          $scope.IsVisible = false;
          vm.saveexcel = saveexcel;
          vm.count = 0;
          vm.porcent = 0;
          vm.listpatient = listpatient;
          vm.nofound = ($filter('translate')('2041')).toUpperCase();
          vm.prepotition =
            $filter("translate")("0000") === "esCo" ? "de" : "of";
          vm.viewreport = viewreport;
          vm.showModalloadexce = false;
          $scope.$watch("file", function () {
            $scope.upload($scope.file);
          });
          vm.currentPage = 0;
          vm.pageSize = 10;
          vm.numberOfPages = numberOfPages;


          function numberOfPages() {
            if (vm.demo !== undefined) {
              return Math.ceil(vm.demo.length / vm.pageSize);
            }
          }

          $scope.upload = function (file) {
            // vm.loading = true;
            vm.currentPage = 0;
            $scope.SelectedFile = file;
            var regex = /^.*\.(xls|xlsx)$/;
            if (regex.test($scope.SelectedFile.name.toLowerCase())) {
              if (typeof FileReader != "undefined") {
                var reader = new FileReader();
                //For Browsers other than IE.
                if (reader.readAsBinaryString) {
                  reader.onload = function (e) {
                    vm.ProcessExcel(e.target.result);
                  };
                  reader.readAsBinaryString($scope.SelectedFile);
                } else {
                  //For IE Browser.
                  reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                      data += String.fromCharCode(bytes[i]);
                    }
                    vm.ProcessExcel(data);
                  };
                  reader.readAsArrayBuffer($scope.SelectedFile);
                }
              } else {
                logger.success("This browser does not support HTML5.");
              }
            } else {
              logger.success("Please upload a valid Excel file.");
            }
          };

          $scope.$watch("openmodal", function () {
            if ($scope.openmodal) {
              vm.demo = [];
              vm.Testlist = $scope.testlist;
              vm.inconsistencias = [];
              vm.Insertadas = [];
              vm.duplicados = [];
              $scope.IsVisible = false;
              vm.patientDemos = $scope.demopatien;
              vm.orderDemos = $scope.order;
              vm.count = 0;
              vm.porcent = 0;
              UIkit.modal("#eventloadexcel").show();
            }
            $scope.openmodal = false;
          });

          function ProcessExcel(data) {
            vm.loading = true;
            //Read the Excel File data.
            var workbook = XLSX.read(data, {
              type: "binary",
            });

            //Fetch the name of First Sheet.
            var firstSheet = workbook.SheetNames[0];

            //Read all rows from First Sheet into an JSON array.
            var excelRows = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[firstSheet]
            );

            //Display the data from Excel file in Table.
            $scope.$apply(function () {
              vm.loading = true;
              vm.listdatapatient = [];
              vm.countDataPatient = 0;
              if (excelRows.length === 0) {
                vm.demo = excelRows;
              }
              else {
                excelRows = _.map(excelRows, function (e, i) {
                  e.validbirthday = moment(e.fechadenacimiento, vm.formatDateBirthday.toUpperCase(), true).isValid();
                  return _.extend(e, { idx: i + 1 });
                });
                vm.validData = [];
                vm.validData = _.filter(excelRows, function (p) {
                  return (
                    p.validbirthday === false || p.cedula === undefined || p.tipodedocumento === undefined || p.fechadenacimiento === undefined || p.genero === undefined || p.primernombre === undefined || p.primerapellido === undefined || p.cedula === "" || p.tipodedocumento === "" || p.fechadenacimiento === "" || p.genero === "" || p.primernombre === "" || p.primerapellido === ""
                  );
                });
                if (vm.validData.length === 0) {
                  vm.size = excelRows.length;
                  vm.excelRowsData = excelRows;
                  vm.listpatient(excelRows[vm.countDataPatient]);
                  vm.demo = vm.listdatapatient;
                }
                else {
                  UIkit.modal("#reviewdata").show();
                }
              }
              //vm.loading = false;
              $scope.IsVisible = true;
            });
          }


          function listpatient(value) {
            try {
              if (vm.countDataPatient < vm.excelRowsData.length) {
                value.validbirthday = moment(value.fechadenacimiento, vm.formatDateBirthday.toUpperCase(), true).isValid();
                value.validsintomas = moment(value.fechadesintomas, vm.formatDateBirthday.toUpperCase(), true).isValid();
                value.validfechadetoma = moment(value.fechadetoma, vm.formatDateBirthday.toUpperCase(), true).isValid();
                value.validfefechaderesultado = moment(value.fechaderesultado, vm.formatDateBirthday.toUpperCase(), true).isValid();

                value.numerointerno =
                  value.numerointerno === undefined
                    ? ""
                    : value.numerointerno.trim() === ""
                      ? ""
                      : value.numerointerno.trim();
                if (value.tipodedocumento !== undefined) {
                  if (value.tipodedocumento.trim() !== "") {
                    var documentType = _.filter(vm.patientDemos, function (o) {
                      o.demo = _.filter(o.items, function (p) {
                        return (
                          p.code.toUpperCase() ===
                          value.tipodedocumento.toUpperCase().trim()
                        );
                      });
                      return o.demo.length > 0 && o.id === -10;
                    });
                  } else {
                    var documentType = [];
                  }
                } else {
                  var documentType = [];
                  value.patient = [];
                  value.select = true;
                  if (vm.size - 1 === value.__rowNum__) {
                    vm.loading = false;
                  }
                }
                vm.documentType = documentType.length === 0 ? "" : documentType[0].demo[0].id;
                vm.patientId =
                  value.cedula === undefined
                    ? ""
                    : value.cedula.trim() === ""
                      ? ""
                      : value.cedula;
                if (documentType.length === 0 || vm.patientId !== "") {
                  value.cedula = value.cedula.replace(/ /g, "");
                  value.cedula = value.cedula.replace(
                    /[`~!@#$%^&*()_|+\=?;:'"´,.<>\{\}\[\]\\\/]/gi,
                    ""
                  );
                  if (vm.documentType === 2 || vm.documentType === 6 || vm.documentType === 9) {
                    var expreg = new RegExp(
                      /^(PE|E|N|[23456789](?:AV|PI)?|1[0123]?(?:AV|PI)?)-(\d{1,4})-(\d{1,6})$/i
                    );
                    if (expreg.test(value.cedula)) {
                      value.RegExp = false;
                    } else {
                      value.RegExp = true;
                    }
                  } else {
                    value.RegExp = false;
                  }
                  vm.patientId = value.cedula;
                }
                if (documentType.length === 0 || vm.patientId === "") {
                } else {
                  var auth = localStorageService.get(
                    "Enterprise_NT.authorizationData"
                  );
                  patientDS
                    .getPatientbyIddocument(
                      auth.authToken,
                      vm.patientId,
                      vm.documentType
                    )
                    .then(
                      function (response) {
                        if (response.data.length > 0) {
                          vm.demoH = [];
                          response.data.forEach(function (demographic, index) {
                            if (demographic.idDemographic === -99) {
                              vm.idsearch = parseInt(demographic.value);
                            }
                            if (demographic.idDemographic === -10) {
                              vm.documentType = demographic.codifiedId;
                            }
                            if (demographic.idDemographic === -100) {
                              vm.patientId = demographic.notCodifiedValue;
                            }
                            if (demographic.idDemographic === -101) {
                              vm.lastName = demographic.notCodifiedValue;
                            }
                            if (demographic.idDemographic === -102) {
                              vm.surName = demographic.notCodifiedValue;
                            }
                            if (demographic.idDemographic === -103) {
                              vm.name1 = demographic.notCodifiedValue;
                            }
                            if (demographic.idDemographic === -109) {
                              vm.name2 = demographic.notCodifiedValue;
                            }
                            if (demographic.idDemographic === -104) {
                              vm.sex = demographic;
                            }
                            if (demographic.idDemographic === -105) {
                              vm.birthday = moment(demographic.notCodifiedValue, 'DD/MM/YYYY').valueOf();
                            }
                            if (demographic.idDemographic === -106) {
                              vm.Email = demographic.notCodifiedValue;
                            }
                            if (demographic.idDemographic === -111) {
                              vm.Phone = demographic.notCodifiedValue;
                            }
                            if (demographic.idDemographic === -112) {
                              vm.Address = demographic.notCodifiedValue;
                            }
                            if (demographic.idDemographic > 0) {
                              vm.demoH.push(demographic);
                            }
                          });
                          vm.patient = {
                            idsearch: vm.idsearch,
                            documentType: {
                              id: vm.documentType,
                            },
                            patientId: vm.patientId,
                            lastName: vm.lastName,
                            surName: vm.surName,
                            name1: vm.name1,
                            name2: vm.name2,
                            sex: vm.sex,
                            birthday: vm.birthday,
                            email: vm.Email,
                            phone: vm.Phone,
                            address: vm.Address,
                            demographics: vm.demoH,
                            exist: true
                          };
                          value.patient = vm.patient;
                          value.select = true;

                        } else {
                          value.patient = [];
                          value.select = true;
                        }

                        vm.demo.push(value);
                        vm.countDataPatient = vm.countDataPatient + 1;
                        vm.listpatient(vm.excelRowsData[vm.countDataPatient]);
                      },
                      function (error) { }
                    );
                }
                //});
              }
              else if (vm.countDataPatient === vm.excelRowsData.length) {
                vm.loading = false;
              }
            } catch (error) {
              console.error(error);
              // expected output: ReferenceError: nonExistentFunction is not defined
              // Note - error messages will vary depending on browser
            }
          }

          function afterLoad() {
            UIkit.modal("#modalprogressprintexport", {
              bgclose: false,
              escclose: false,
              modal: false,
            }).show();
          }

          function saveexcel() {
            vm.demo = $filter("filter")(vm.demo, function (e) {
              return e.select === true;
            });
            vm.loadexcel();
          }

          function loadexcel() {
            vm.loading = true;
            vm.dataadd = JSON.parse(JSON.stringify(vm.demo));
            vm.dataadd[vm.count].numerointerno =
              vm.dataadd[vm.count].numerointerno === undefined
                ? ""
                : vm.dataadd[vm.count].numerointerno.trim() === ""
                  ? ""
                  : vm.dataadd[vm.count].numerointerno.trim();
            if (vm.dataadd[vm.count].tipodedocumento !== undefined) {
              if (vm.dataadd[vm.count].tipodedocumento.trim() !== "") {
                var documentType = _.filter(vm.patientDemos, function (o) {
                  o.demo = _.filter(o.items, function (p) {
                    return (
                      p.code.toUpperCase() ===
                      vm.dataadd[vm.count].tipodedocumento.toUpperCase().trim()
                    );
                  });
                  return o.demo.length > 0 && o.id === -10;
                });
              } else {
                var documentType = [];
              }
            } else {
              var documentType = [];
            }
            vm.documentType =
              documentType.length === 0 ? "" : documentType[0].demo[0].id;
            vm.patientId =
              vm.dataadd[vm.count].cedula === undefined
                ? ""
                : vm.dataadd[vm.count].cedula.trim() === ""
                  ? ""
                  : vm.dataadd[vm.count].cedula;
            if (documentType.length === 0 || vm.patientId === "") {
              var patient = {
                documentType: {
                  id: "",
                },
                patientId:
                  vm.dataadd[vm.count].cedula === undefined
                    ? ""
                    : vm.dataadd[vm.count].cedula.trim() === ""
                      ? ""
                      : vm.dataadd[vm.count].cedula,
                lastName:
                  vm.dataadd[vm.count].primerapellido === undefined
                    ? ""
                    : vm.dataadd[vm.count].primerapellido.trim() === ""
                      ? ""
                      : vm.dataadd[vm.count].primerapellido,
                surName:
                  vm.dataadd[vm.count].segundoapellido === undefined
                    ? ""
                    : vm.dataadd[vm.count].segundoapellido.trim() === ""
                      ? ""
                      : vm.dataadd[vm.count].segundoapellido,
                name1:
                  vm.dataadd[vm.count].primernombre === undefined
                    ? ""
                    : vm.dataadd[vm.count].primernombre.trim() === ""
                      ? ""
                      : vm.dataadd[vm.count].primernombre,
                name2:
                  vm.dataadd[vm.count].segundonombre === undefined
                    ? ""
                    : vm.dataadd[vm.count].segundonombre.trim() === ""
                      ? ""
                      : vm.dataadd[vm.count].segundonombre,
                sex: {
                  id: "",
                },
                birthday: "",
                email: "",
                phone: "",
                demographics: [],
              };
              vm.order = {
                error: $filter('translate')('2042'),
                index: vm.count + 1,
                createdDateShort: Number(moment().format("YYYYMMDD")),
                orderNumber: null,
                date: "",
                type: {
                  id: 1,
                  code: "R",
                },
                demographics: [],
                externalId:
                  vm.dataadd[vm.count].numerointerno === undefined
                    ? ""
                    : vm.dataadd[vm.count].numerointerno.trim() === ""
                      ? ""
                      : vm.dataadd[vm.count].numerointerno,
                listDiagnostic: [],
                patient: patient,
                tests: [],
                deleteTests: [],
                turn: "",
              };
              vm.duplicados.push(vm.order);
              vm.porcent = Math.round((vm.count * 100) / vm.dataadd.length);
              if (vm.dataadd.length === 1) {
                UIkit.modal("#eventloadexcel", {
                  bgclose: false,
                  keyboard: false,
                }).hide();
                UIkit.modal("#modalprogressprintexport", {
                  bgclose: false,
                  keyboard: false,
                }).hide();
                vm.loading = false;
                vm.viewreport();
              } else if (vm.count === 0) {
                vm.count = vm.count + 1;
                UIkit.modal("#modalprogressprintexport", {
                  bgclose: false,
                  keyboard: false,
                }).show();
                vm.loadexcel();
              } else if (vm.count === vm.dataadd.length - 1) {
                UIkit.modal("#eventloadexcel", {
                  bgclose: false,
                  keyboard: false,
                }).hide();
                UIkit.modal("#modalprogressprintexport", {
                  bgclose: false,
                  keyboard: false,
                }).hide();
                vm.loading = false;
                vm.viewreport();
              } else {
                vm.count = vm.count + 1;
                vm.loadexcel();
              }
            } else {
              if (vm.dataadd[vm.count].patient.patientId !== undefined) {
                if (vm.dataadd[vm.count].region !== undefined) {
                  var data = JSON.parse(JSON.stringify(vm.patientDemos));
                  var regionexcel = _.filter(data, function (o) {
                    o.demo = _.filter(o.items, function (p) {
                      return (
                        p.name.toUpperCase() ===
                        vm.dataadd[vm.count].region.toUpperCase().trim()
                      );
                    });
                    return o.demo.length > 0 && o.id === 1;
                  });
                } else {
                  var regionexcel = [];
                }
                var data = JSON.parse(
                  JSON.stringify(vm.dataadd[vm.count].patient.demographics)
                );
                var regionlist = $filter("filter")(data, function (e) {
                  return e.idDemographic === 1;
                })[0].codifiedId;

                var region = "";
                if (regionexcel.length === 0) {
                  region = regionlist;
                } else if (regionlist !== regionexcel[0].demo[0].id) {
                  region = regionexcel[0].demo[0].id;
                } else {
                  region = regionlist;
                }

                if (vm.dataadd[vm.count].distrito !== undefined) {
                  var data = JSON.parse(JSON.stringify(vm.patientDemos));
                  var distritoexcel = _.filter(data, function (o) {
                    o.demo = _.filter(o.items, function (p) {
                      return (
                        p.name.toUpperCase() ===
                        vm.dataadd[vm.count].distrito.toUpperCase().trim()
                      );
                    });
                    return o.demo.length > 0 && o.id === 2;
                  });
                } else {
                  var distritoexcel = [];
                }

                var data = JSON.parse(
                  JSON.stringify(vm.dataadd[vm.count].patient.demographics)
                );
                var distritolist = $filter("filter")(data, function (e) {
                  return e.idDemographic === 2;
                })[0].codifiedId;

                var distrito = "";
                if (distritoexcel.length === 0) {
                  distrito = distritolist;
                } else if (distritolist !== distritoexcel[0].demo[0].id) {
                  distrito = distritoexcel[0].demo[0].id;
                } else {
                  distrito = distritolist;
                }

                if (vm.dataadd[vm.count].corregimiento !== undefined) {
                  var data = JSON.parse(JSON.stringify(vm.patientDemos));
                  var corregimientoexcel = _.filter(data, function (o) {
                    o.demo = _.filter(o.items, function (p) {
                      return (
                        p.name.toUpperCase() ===
                        vm.dataadd[vm.count].corregimiento.toUpperCase().trim()
                      );
                    });
                    return o.demo.length > 0 && o.id === 3;
                  });
                } else {
                  var corregimientoexcel = [];
                }

                var data = JSON.parse(
                  JSON.stringify(vm.dataadd[vm.count].patient.demographics)
                );
                var corregimientolist = $filter("filter")(data, function (e) {
                  return e.idDemographic === 3;
                })[0].codifiedId;

                var corregimiento = "";
                if (corregimientoexcel.length === 0) {
                  corregimiento = corregimientolist;
                } else if (
                  corregimientolist !== corregimientoexcel[0].demo[0].id
                ) {
                  corregimiento = corregimientoexcel[0].demo[0].id;
                } else {
                  corregimiento = corregimientolist;
                }

                var lisphonecontact = $filter("filter")(
                  vm.dataadd[vm.count].patient.demographics,
                  function (e) {
                    return e.idDemographic === 5;
                  }
                )[0].notCodifiedValue;

                var phonecontact = "";
                if (vm.dataadd[vm.count].personacontacto === undefined) {
                  phonecontact = lisphonecontact;
                } else if (vm.dataadd[vm.count].personacontacto.trim() === "") {
                  phonecontact = lisphonecontact;
                } else if (
                  lisphonecontact !==
                  vm.dataadd[vm.count].personacontacto.trim()
                ) {
                  phonecontact = vm.dataadd[vm.count].personacontacto.trim();
                } else {
                  phonecontact = lisphonecontact;
                }

                var lisphone = $filter("filter")(
                  vm.dataadd[vm.count].patient.demographics,
                  function (e) {
                    return e.idDemographic === 6;
                  }
                )[0].notCodifiedValue;
                var phonecontacts = "";

                if (vm.dataadd[vm.count].telefonocontacto === undefined) {
                  phonecontacts = lisphone;
                } else if (
                  vm.dataadd[vm.count].telefonocontacto.trim() === ""
                ) {
                  phonecontacts = lisphone;
                } else if (
                  lisphone !== vm.dataadd[vm.count].telefonocontacto.trim()
                ) {
                  phonecontacts = vm.dataadd[vm.count].telefonocontacto.trim();
                } else {
                  phonecontacts = lisphone;
                }

                vm.demoH = [
                  {
                    idDemographic: 1,
                    encoded: true,
                    notCodifiedValue: "",
                    codifiedId: region,
                  },
                  {
                    idDemographic: 2,
                    encoded: true,
                    notCodifiedValue: "",
                    codifiedId: distrito,
                  },
                  {
                    idDemographic: 3,
                    encoded: true,
                    notCodifiedValue: "",
                    codifiedId: corregimiento,
                  },
                  {
                    idDemographic: 5,
                    encoded: false,
                    notCodifiedValue: phonecontact,
                    codifiedId: "",
                  },
                  {
                    idDemographic: 6,
                    encoded: false,
                    notCodifiedValue: phonecontacts,
                    codifiedId: "",
                  },
                ];
                var lastName = "";
                if (vm.dataadd[vm.count].primerapellido === undefined) {
                  lastName = vm.dataadd[vm.count].patient.lastName;
                } else if (vm.dataadd[vm.count].primerapellido.trim() === "") {
                  lastName = vm.dataadd[vm.count].patient.lastName;
                } else if (
                  vm.dataadd[vm.count].patient.lastName !==
                  vm.dataadd[vm.count].primerapellido.trim()
                ) {
                  lastName = vm.dataadd[vm.count].primerapellido.trim();
                } else {
                  lastName = vm.dataadd[vm.count].patient.lastName;
                }

                var surName = "";
                if (vm.dataadd[vm.count].segundoapellido === undefined) {
                  surName = vm.dataadd[vm.count].patient.surName;
                } else if (vm.dataadd[vm.count].segundoapellido.trim() === "") {
                  surName = vm.dataadd[vm.count].patient.surName;
                } else if (
                  vm.dataadd[vm.count].patient.surName !==
                  vm.dataadd[vm.count].segundoapellido.trim()
                ) {
                  surName = vm.dataadd[vm.count].segundoapellido.trim();
                } else {
                  surName = vm.dataadd[vm.count].patient.surName;
                }

                var name1 = "";
                if (vm.dataadd[vm.count].primernombre === undefined) {
                  name1 = vm.dataadd[vm.count].patient.name1;
                } else if (vm.dataadd[vm.count].primernombre.trim() === "") {
                  name1 = vm.dataadd[vm.count].patient.name1;
                } else if (
                  vm.dataadd[vm.count].patient.name1 !==
                  vm.dataadd[vm.count].primernombre.trim()
                ) {
                  name1 = vm.dataadd[vm.count].primernombre.trim();
                } else {
                  name1 = vm.dataadd[vm.count].patient.name1;
                }

                var name2 = "";
                if (vm.dataadd[vm.count].segundonombre === undefined) {
                  name2 = vm.dataadd[vm.count].patient.name2;
                } else if (vm.dataadd[vm.count].segundonombre.trim() === "") {
                  name2 = vm.dataadd[vm.count].patient.name2;
                } else if (
                  vm.dataadd[vm.count].patient.name2 !==
                  vm.dataadd[vm.count].segundonombre.trim()
                ) {
                  name2 = vm.dataadd[vm.count].segundonombre.trim();
                } else {
                  name2 = vm.dataadd[vm.count].patient.name2;
                }

                var birthday;
                if (moment(vm.dataadd[vm.count].fechadenacimiento, vm.formatDateBirthday.toUpperCase(), true).isValid()
                ) {
                  var birthday = moment(vm.dataadd[vm.count].fechadenacimiento, vm.formatDateBirthday.toUpperCase()).valueOf();
                  var datecompared = moment(birthday).format('YYYY');
                  var datetoday = moment().format('YYYY');
                  if (datecompared > datetoday) {
                    var day = moment(birthday).format('DD');
                    var month = parseInt(moment(birthday).format('MM')) - 1 + '';
                    var year = moment(birthday).subtract(100, 'y').format('YYYY');
                    var datecomplete = new Date(year, month, day)
                    var datebirthday = moment(datecomplete).format('YYYYMMDD');
                    birthday = moment(datebirthday, 'YYYYMMDD').valueOf();
                  }
                } else {
                  birthday = vm.dataadd[vm.count].patient.birthday;
                }

                var email = "";
                if (vm.dataadd[vm.count].correo === undefined) {
                  email = vm.dataadd[vm.count].patient.email;
                } else if (vm.dataadd[vm.count].correo.trim() === "") {
                  email = vm.dataadd[vm.count].patient.email;
                } else if (
                  vm.dataadd[vm.count].patient.email !==
                  vm.dataadd[vm.count].correo.trim()
                ) {
                  email = vm.dataadd[vm.count].correo.trim();
                } else {
                  email = vm.dataadd[vm.count].patient.email;
                }

                var phone = "";
                if (vm.dataadd[vm.count].telefono === undefined) {
                  phone = vm.dataadd[vm.count].patient.phone;
                } else if (vm.dataadd[vm.count].telefono.trim() === "") {
                  phone = vm.dataadd[vm.count].patient.phone;
                } else if (
                  vm.dataadd[vm.count].patient.phone !==
                  vm.dataadd[vm.count].telefono.trim()
                ) {
                  phone = vm.dataadd[vm.count].telefono.trim();
                } else {
                  phone = vm.dataadd[vm.count].patient.phone;
                }

                var address = "";
                if (vm.dataadd[vm.count].direccion === undefined) {
                  address = vm.dataadd[vm.count].patient.address;
                } else if (vm.dataadd[vm.count].direccion.trim() === "") {
                  address = vm.dataadd[vm.count].patient.address;
                } else if (
                  vm.dataadd[vm.count].patient.address !==
                  vm.dataadd[vm.count].direccion.trim()
                ) {
                  address = vm.dataadd[vm.count].direccion.trim();
                } else {
                  address = vm.dataadd[vm.count].patient.address;
                }

                if (vm.dataadd[vm.count].genero !== undefined) {
                  var data = JSON.parse(JSON.stringify(vm.patientDemos));
                  var sex = _.filter(data, function (o) {
                    o.demo = _.filter(o.items, function (p) {
                      return (
                        p.name.toUpperCase() ===
                        vm.dataadd[vm.count].genero.toUpperCase().trim()
                      );
                    });
                    return o.demo.length > 0 && o.id === -104;
                  });
                } else {
                  var sex = [];
                }

                var sexvalid = "";
                if (sex.length === 0) {
                  sexvalid = vm.dataadd[vm.count].patient.sex.id;
                } else if (
                  sex[0].demo[0].id !== vm.dataadd[vm.count].patient.sex.id
                ) {
                  sexvalid = sex[0].demo[0].id;
                } else {
                  sexvalid = vm.dataadd[vm.count].patient.sex.id;
                }

                var patient = {
                  documentType: {
                    id: vm.dataadd[vm.count].patient.documentType.id,
                  },
                  patientId: vm.dataadd[vm.count].patient.patientId,
                  lastName: lastName,
                  surName: surName,
                  name1: name1,
                  name2: name2,
                  sex: { id: sexvalid },
                  birthday: birthday,
                  email: email,
                  phone: phone,
                  address: address,
                  demographics: vm.demoH,
                };

                vm.patient = patient;
                if (vm.dataadd[vm.count].sede !== undefined) {
                  if (vm.dataadd[vm.count].sede.toUpperCase() !== undefined) {
                    var data = JSON.parse(JSON.stringify(vm.orderDemos));
                    vm.branch = _.filter(data, function (o) {
                      o.demo = _.filter(o.items, function (p) {
                        return (
                          p.name.toUpperCase() ===
                          vm.dataadd[vm.count].sede.toUpperCase().trim()
                        );
                      });
                      return o.demo.length > 0 && o.id === -5;
                    });
                  }
                } else {
                  vm.branch = [];
                }
                if (
                  vm.dataadd[vm.count].numerointerno === "" ||
                  vm.branch.length === 0
                ) {
                  vm.order = {
                    error:
                      vm.branch.length === 0 &&
                        vm.dataadd[vm.count].numerointerno === undefined
                        ? $filter('translate')('2043')
                        : vm.branch.length === 0
                          ? $filter('translate')('2044')
                          : $filter('translate')('2045'),
                    index: vm.count + 1,
                    createdDateShort: Number(moment().format("YYYYMMDD")),
                    orderNumber: null,
                    date: "",
                    type: {
                      id: 1,
                      code: "R",
                    },
                    branch: {
                      id: "",
                    },
                    demographics: [],
                    externalId: vm.dataadd[vm.count].numerointerno,
                    listDiagnostic: [],
                    patient: vm.patient,
                    tests: [],
                    deleteTests: [],
                    turn: "",
                  };
                  vm.duplicados.push(vm.order);
                  vm.porcent = Math.round((vm.count * 100) / vm.dataadd.length);
                  if (vm.dataadd.length === 1) {
                    UIkit.modal("#modalprogressprintexport", {
                      bgclose: false,
                      keyboard: false,
                    }).hide();
                    UIkit.modal("#eventloadexcel", {
                      bgclose: false,
                      keyboard: false,
                    }).hide();
                    vm.loading = false;
                    vm.viewreport();
                  } else if (vm.count === 0) {
                    vm.count = vm.count + 1;
                    UIkit.modal("#modalprogressprintexport", {
                      bgclose: false,
                      keyboard: false,
                    }).show();
                    vm.loadexcel();
                  } else if (vm.count === vm.dataadd.length - 1) {
                    UIkit.modal("#modalprogressprintexport", {
                      bgclose: false,
                      keyboard: false,
                    }).hide();
                    UIkit.modal("#eventloadexcel", {
                      bgclose: false,
                      keyboard: false,
                    }).hide();
                    vm.loading = false;
                    vm.viewreport();
                  } else {
                    vm.count = vm.count + 1;
                    vm.loadexcel();
                  }
                } else {
                  var auth = localStorageService.get(
                    "Enterprise_NT.authorizationData"
                  );
                  return orderDS
                    .getexternalId(
                      auth.authToken,
                      vm.dataadd[vm.count].numerointerno,
                      vm.branch[0].demo[0].code
                    )
                    .then(
                      function (data) {
                        if (data.data === true) {
                          vm.order = {
                            error: $filter('translate')('2046'),
                            index: vm.count + 1,
                            createdDateShort: Number(
                              moment().format("YYYYMMDD")
                            ),
                            orderNumber: null,
                            date: "",
                            type: {
                              id: 1,
                              code: "R",
                            },
                            branch: {
                              id:
                                vm.branch.length === 0
                                  ? ""
                                  : vm.branch[0].demo[0].id,
                            },
                            demographics: [],
                            externalId: vm.dataadd[vm.count].numerointerno,
                            listDiagnostic: [],
                            patient: vm.patient,
                            tests: [],
                            deleteTests: [],
                            turn: "",
                          };
                          vm.duplicados.push(vm.order);
                          vm.porcent = Math.round(
                            (vm.count * 100) / vm.dataadd.length
                          );
                          if (vm.dataadd.length === 1) {
                            UIkit.modal("#eventloadexcel", {
                              bgclose: false,
                              keyboard: false,
                            }).hide();
                            UIkit.modal("#modalprogressprintexport", {
                              bgclose: false,
                              keyboard: false,
                            }).hide();
                            vm.loading = false;
                            vm.viewreport();
                          } else if (vm.count === 0) {
                            vm.count = vm.count + 1;
                            UIkit.modal("#modalprogressprintexport", {
                              bgclose: false,
                              keyboard: false,
                            }).show();
                            vm.loadexcel();
                          } else if (vm.count === vm.dataadd.length - 1) {
                            UIkit.modal("#eventloadexcel", {
                              bgclose: false,
                              keyboard: false,
                            }).hide();
                            UIkit.modal("#modalprogressprintexport", {
                              bgclose: false,
                              keyboard: false,
                            }).hide();
                            vm.loading = false;
                            vm.viewreport();
                          } else {
                            vm.count = vm.count + 1;
                            vm.loadexcel();
                          }
                        } else {
                          if (
                            vm.dataadd[vm.count].procedenciamuestra !==
                            undefined
                          ) {
                            var data = JSON.parse(
                              JSON.stringify(vm.orderDemos)
                            );
                            var procent = _.filter(data, function (o) {
                              o.demo = _.filter(o.items, function (p) {
                                return (
                                  p.name.toUpperCase() ===
                                  vm.dataadd[vm.count].procedenciamuestra
                                    .toUpperCase()
                                    .trim()
                                );
                              });
                              return o.demo.length > 0 && o.id === 9;
                            });
                          } else {
                            var procent = [];
                          }

                          if (
                            vm.dataadd[vm.count].tipodepaciente !== undefined
                          ) {
                            var data = JSON.parse(
                              JSON.stringify(vm.orderDemos)
                            );
                            var tipodepaciente = _.filter(data, function (o) {
                              o.demo = _.filter(o.items, function (p) {
                                return (
                                  p.name.toUpperCase() ===
                                  vm.dataadd[vm.count].tipodepaciente
                                    .toUpperCase()
                                    .trim()
                                );
                              });
                              return o.demo.length > 0 && o.id === 14;
                            });
                          } else {
                            var tipodepaciente = [];
                          }

                          if (
                            vm.dataadd[vm.count].tipodemuestra !== undefined
                          ) {
                            var data = JSON.parse(
                              JSON.stringify(vm.orderDemos)
                            );
                            var tipodemuestra = _.filter(data, function (o) {
                              o.demo = _.filter(o.items, function (p) {
                                return (
                                  p.name.toUpperCase() ===
                                  vm.dataadd[vm.count].tipodemuestra
                                    .toUpperCase()
                                    .trim()
                                );
                              });
                              return o.demo.length > 0 && o.id === 15;
                            });
                          } else {
                            var tipodemuestra = [];
                          }

                          if (vm.dataadd[vm.count].sede !== undefined) {
                            var data = JSON.parse(
                              JSON.stringify(vm.orderDemos)
                            );
                            var branch = _.filter(data, function (o) {
                              o.demo = _.filter(o.items, function (p) {
                                return (
                                  p.name.toUpperCase() ===
                                  vm.dataadd[vm.count].sede.toUpperCase().trim()
                                );
                              });
                              return o.demo.length > 0 && o.id === -5;
                            });
                          } else {
                            var branch = [];
                          }

                          var fechavalid = moment(
                            vm.dataadd[vm.count].fechaderesultado,
                            vm.formatDateBirthday.toUpperCase(),
                            true
                          ).isValid();

                          if (vm.dataadd[vm.count].tipodeprueba !== undefined) {
                            var data = JSON.parse(JSON.stringify(vm.Testlist));
                            var test = $filter("filter")(data, function (e) {
                              return e.name.toUpperCase() === vm.dataadd[vm.count].tipodeprueba.toUpperCase().trim()
                            });
                          } else {
                            var test = [];
                          }
                          var validatetypetest = true;
                          if (vm.dataadd[vm.count].resultado === undefined) {
                            validatetypetest = true;
                          } else if (vm.dataadd[vm.count].resultado.trim() === "") {
                            validatetypetest = true;
                          } else {
                            validatetypetest = false;
                          }

                          if (
                            test.length === 0 ||
                            validatetypetest ||
                            !fechavalid
                          ) {
                            var error = $filter('translate')('2047');
                            if (test.length === 0) {
                              var error = error + " " + $filter('translate')('2048');
                            }
                            if (validatetypetest) {
                              var error = error + " " + $filter('translate')('2049');
                            }

                            if (!fechavalid) {
                              var error = error + " " + $filter('translate')('2052');
                            }

                            var datetake = moment(vm.dataadd[vm.count].fechadetoma, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechadetoma : "";
                            var viewCodifiedValue = '';
                            if (datetake !== '') {
                              viewCodifiedValue = moment(datetake, vm.formatDateBirthday.toUpperCase()).valueOf();
                              viewCodifiedValue = moment(viewCodifiedValue).format(vm.format.toUpperCase());
                            }

                            var datesintomas = moment(vm.dataadd[vm.count].fechadesintomas, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechadesintomas : "";
                            var dateview = '';
                            if (datesintomas !== '') {
                              dateview = moment(datesintomas, vm.formatDateBirthday.toUpperCase()).valueOf();
                              dateview = moment(dateview).format(vm.format.toUpperCase());
                            }


                            var dateresult = moment(vm.dataadd[vm.count].fechaderesultado, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechaderesultado : "";
                            var viewdateresult = '';
                            if (dateresult !== '') {
                              viewdateresult = moment(dateresult, vm.formatDateBirthday.toUpperCase()).valueOf();
                              viewdateresult = moment(viewdateresult).format(vm.format.toUpperCase());
                            }



                            vm.demoorder = [
                              {
                                idDemographic: 9,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  procent.length === 0
                                    ? ""
                                    : procent[0].demo[0].id,
                              },
                              {
                                idDemographic: 10,
                                encoded: false,
                                notCodifiedValue: viewCodifiedValue,
                                codifiedId: "",
                              },
                              {
                                idDemographic: 13,
                                encoded: false,
                                notCodifiedValue: viewdateresult,
                                codifiedId: "",
                              },
                              {
                                idDemographic: 14,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  tipodepaciente.length === 0
                                    ? ""
                                    : tipodepaciente[0].demo[0].id,
                              },
                              {
                                idDemographic: 18,
                                encoded: false,
                                notCodifiedValue: dateview,
                                codifiedId: "",
                              },
                              {
                                idDemographic: 15,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  tipodemuestra.length === 0
                                    ? ""
                                    : tipodemuestra[0].demo[0].id,
                              },
                            ];


                            vm.order = {
                              error: error,
                              index: vm.count + 1,
                              createdDateShort: Number(
                                moment().format("YYYYMMDD")
                              ),
                              orderNumber: null,
                              date: "",
                              type: {
                                id: 1,
                                code: "R",
                              },
                              branch: {
                                id:
                                  branch.length === 0
                                    ? ""
                                    : branch[0].demo[0].id,
                              },
                              demographics: vm.demoorder,
                              externalId: vm.dataadd[vm.count].numerointerno,
                              listDiagnostic: [],
                              patient: vm.patient,
                              resulttest: "",
                              tests: test,
                              inconsistency: true,
                              deleteTests: [],
                              turn: "",
                            };
                            vm.inconsistencias.push(vm.order);
                            var auth = localStorageService.get(
                              "Enterprise_NT.authorizationData"
                            );
                            orderDS.insertOrder(auth.authToken, vm.order).then(
                              function (data) {
                                if (data.status === 200) {
                                  if (vm.dataadd[vm.count].resultado === undefined || data.data.tests.length) {
                                    vm.porcent = Math.round(
                                      (vm.count * 100) / vm.dataadd.length
                                    );
                                    if (
                                      vm.count ===
                                      vm.dataadd.length - 1
                                    ) {
                                      UIkit.modal("#eventloadexcel", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).hide();
                                      UIkit.modal("#modalprogressprintexport", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).hide();
                                      vm.loading = false;
                                      vm.viewreport();
                                    } else if (vm.count === 0) {
                                      vm.count = vm.count + 1;
                                      UIkit.modal("#modalprogressprintexport", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).show();
                                      vm.loadexcel();
                                    } else {
                                      vm.count = vm.count + 1;
                                      vm.loadexcel();
                                    }

                                  } else if (vm.dataadd[vm.count].resultado.trim() === "") {
                                    vm.porcent = Math.round(
                                      (vm.count * 100) / vm.dataadd.length
                                    );
                                    if (
                                      vm.count ===
                                      vm.dataadd.length - 1
                                    ) {
                                      UIkit.modal("#eventloadexcel", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).hide();
                                      UIkit.modal("#modalprogressprintexport", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).hide();
                                      vm.loading = false;
                                      vm.viewreport();
                                    } else if (vm.count === 0) {
                                      vm.count = vm.count + 1;
                                      UIkit.modal("#modalprogressprintexport", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).show();
                                      vm.loadexcel();
                                    } else {
                                      vm.count = vm.count + 1;
                                      vm.loadexcel();
                                    }
                                  } else {
                                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                    return resultsentryDS.getresults(auth.authToken, data.data.orderNumber).then(function (data) {
                                      if (data.status === 200) {
                                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                        vm.listestresult = data.data;
                                        vm.listestresult[0].result = vm.dataadd[vm.count].resultado.trim();
                                        vm.listestresult[0].newState = 2;
                                        vm.listestresult[0].idUser = auth.id;
                                        vm.listestresult[0].resultChanged = true;
                                        return resultsentryDS.updateTest(auth.authToken, vm.listestresult[0]).then(function (data) {
                                          if (data.status === 200) {
                                            vm.porcent = Math.round(
                                              (vm.count * 100) / vm.dataadd.length
                                            );
                                            if (
                                              vm.count ===
                                              vm.dataadd.length - 1
                                            ) {
                                              UIkit.modal("#eventloadexcel", {
                                                bgclose: false,
                                                keyboard: false,
                                              }).hide();
                                              UIkit.modal("#modalprogressprintexport", {
                                                bgclose: false,
                                                keyboard: false,
                                              }).hide();
                                              vm.loading = false;
                                              vm.viewreport();
                                            } else if (vm.count === 0) {
                                              vm.count = vm.count + 1;
                                              UIkit.modal("#modalprogressprintexport", {
                                                bgclose: false,
                                                keyboard: false,
                                              }).show();
                                              vm.loadexcel();
                                            } else {
                                              vm.count = vm.count + 1;
                                              vm.loadexcel();
                                            }
                                          }
                                        }, function (error) {
                                          vm.modalError(error);
                                        });
                                      }
                                    },
                                      function (error) {
                                        vm.loading = false;
                                      }
                                    );
                                  }
                                }
                              },
                              function (error) {
                                vm.loading = false;
                              }
                            );
                          } else {
                            var datetake = moment(vm.dataadd[vm.count].fechadetoma, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechadetoma : "";
                            var viewCodifiedValue = '';
                            if (datetake !== '') {
                              viewCodifiedValue = moment(datetake, vm.formatDateBirthday.toUpperCase()).valueOf();
                              viewCodifiedValue = moment(viewCodifiedValue).format(vm.format.toUpperCase());
                            }


                            var dateresult = moment(vm.dataadd[vm.count].fechaderesultado, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechaderesultado : "";
                            var viewdateresult = '';
                            if (dateresult !== '') {
                              viewdateresult = moment(dateresult, vm.formatDateBirthday.toUpperCase()).valueOf();
                              viewdateresult = moment(viewdateresult).format(vm.format.toUpperCase());
                            }

                            var datesintomas = moment(vm.dataadd[vm.count].fechadesintomas, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechadesintomas : "";
                            var dateview = '';
                            if (datesintomas !== '') {
                              dateview = moment(datesintomas, vm.formatDateBirthday.toUpperCase()).valueOf();
                              dateview = moment(dateview).format(vm.format.toUpperCase());
                            }

                            vm.demoorder = [
                              {
                                idDemographic: 9,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  procent.length === 0
                                    ? ""
                                    : procent[0].demo[0].id,
                              },
                              {
                                idDemographic: 10,
                                encoded: false,
                                notCodifiedValue: viewCodifiedValue,
                              },
                              {
                                idDemographic: 13,
                                encoded: false,
                                notCodifiedValue: viewdateresult,
                                codifiedId: "",
                              },
                              {
                                idDemographic: 14,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  tipodepaciente.length === 0
                                    ? ""
                                    : tipodepaciente[0].demo[0].id,
                              },
                              {
                                idDemographic: 18,
                                encoded: false,
                                notCodifiedValue: dateview,
                                codifiedId: "",
                              },
                              {
                                idDemographic: 15,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  tipodemuestra.length === 0
                                    ? ""
                                    : tipodemuestra[0].demo[0].id,
                              },
                            ];
                            vm.order = {
                              externalId: vm.dataadd[vm.count].numerointerno,
                              error: error,
                              createdDateShort: Number(
                                moment().format("YYYYMMDD")
                              ),
                              orderNumber: null,
                              date: "",
                              type: {
                                id: 1,
                                code: "R",
                              },
                              branch: {
                                id:
                                  branch.length === 0
                                    ? ""
                                    : branch[0].demo[0].id,
                              },
                              demographics: vm.demoorder,
                              listDiagnostic: [],
                              patient: vm.patient,
                              tests: test,
                              inconsistency: false,
                              deleteTests: [],
                              turn: ""
                            };
                            var auth = localStorageService.get(
                              "Enterprise_NT.authorizationData"
                            );
                            orderDS.insertOrder(auth.authToken, vm.order).then(
                              function (data) {
                                if (data.status === 200) {
                                  data.data.resulttest = vm.dataadd[vm.count].resultado === undefined ? '' : vm.dataadd[vm.count].resultado;
                                  data.data.index = vm.count + 1;
                                  vm.Insertadas.push(data.data);
                                  var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                  return resultsentryDS.getresults(auth.authToken, data.data.orderNumber).then(function (data) {
                                    if (data.status === 200) {
                                      var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                      vm.listestresult = data.data;
                                      vm.listestresult[0].result = vm.dataadd[vm.count].resultado.trim();
                                      vm.listestresult[0].newState = 2;
                                      vm.listestresult[0].idUser = auth.id;
                                      vm.listestresult[0].resultChanged = true;
                                      return resultsentryDS.updateTest(auth.authToken, vm.listestresult[0]).then(function (data) {
                                        if (data.status === 200) {
                                          vm.porcent = Math.round(
                                            (vm.count * 100) / vm.dataadd.length
                                          );
                                          if (
                                            vm.count ===
                                            vm.dataadd.length - 1
                                          ) {
                                            UIkit.modal("#eventloadexcel", {
                                              bgclose: false,
                                              keyboard: false,
                                            }).hide();
                                            UIkit.modal("#modalprogressprintexport", {
                                              bgclose: false,
                                              keyboard: false,
                                            }).hide();
                                            vm.loading = false;
                                            vm.viewreport();
                                          } else if (vm.count === 0) {
                                            vm.count = vm.count + 1;
                                            UIkit.modal("#modalprogressprintexport", {
                                              bgclose: false,
                                              keyboard: false,
                                            }).show();
                                            vm.loadexcel();
                                          } else {
                                            vm.count = vm.count + 1;
                                            vm.loadexcel();
                                          }
                                        }
                                      }, function (error) {
                                        vm.modalError(error);
                                      });
                                    }
                                  },
                                    function (error) {
                                      vm.loading = false;
                                    }
                                  );
                                }
                              },
                              function (error) {
                                vm.loading = false;
                              }
                            );
                          }
                        }
                      },
                      function (error) {
                        vm.loading = false;
                        vm.modalError(error);
                      }
                    );
                }
              } else {
                if (vm.dataadd[vm.count].sede !== undefined) {
                  var data = JSON.parse(JSON.stringify(vm.orderDemos));
                  vm.branch = _.filter(data, function (o) {
                    o.demo = _.filter(o.items, function (p) {
                      return (
                        p.name.toUpperCase() ===
                        vm.dataadd[vm.count].sede.toUpperCase().trim()
                      );
                    });
                    return o.demo.length > 0 && o.id === -5;
                  });
                } else {
                  vm.branch = [];
                }
                if (
                  vm.dataadd[vm.count].numerointerno === undefined ||
                  vm.branch.length === 0
                ) {
                  var patient = {
                    documentType: {
                      id: "",
                    },
                    patientId:
                      vm.dataadd[vm.count].cedula === undefined
                        ? ""
                        : vm.dataadd[vm.count].cedula.trim() === ""
                          ? ""
                          : vm.dataadd[vm.count].cedula.trim(),
                    lastName:
                      vm.dataadd[vm.count].primerapellido === undefined
                        ? ""
                        : vm.dataadd[vm.count].primerapellido.trim() === ""
                          ? ""
                          : vm.dataadd[vm.count].primerapellido.trim(),
                    surName:
                      vm.dataadd[vm.count].segundoapellido === undefined
                        ? ""
                        : vm.dataadd[vm.count].segundoapellido.trim() === ""
                          ? ""
                          : vm.dataadd[vm.count].segundoapellido.trim(),
                    name1:
                      vm.dataadd[vm.count].primernombre === undefined
                        ? ""
                        : vm.dataadd[vm.count].primernombre.trim() === ""
                          ? ""
                          : vm.dataadd[vm.count].primernombre.trim(),
                    name2:
                      vm.dataadd[vm.count].segundonombre === undefined
                        ? ""
                        : vm.dataadd[vm.count].segundonombre.trim() === ""
                          ? ""
                          : vm.dataadd[vm.count].segundonombre.trim(),
                    sex: {
                      id: "",
                    },
                    birthday: "",
                    email: "",
                    phone:
                      vm.dataadd[vm.count].telefono === undefined
                        ? ""
                        : vm.dataadd[vm.count].telefono.trim() === ""
                          ? ""
                          : vm.dataadd[vm.count].telefono.trim(),
                    address: "",
                    demographics: [],
                  };

                  vm.order = {
                    error:
                      vm.branch.length === 0 &&
                        vm.dataadd[vm.count].numerointerno === undefined
                        ? $filter('translate')('2043')
                        : vm.branch.length === 0
                          ? $filter('translate')('2044')
                          : $filter('translate')('2045'),
                    index: vm.count + 1,
                    createdDateShort: Number(moment().format("YYYYMMDD")),
                    orderNumber: null,
                    date: "",
                    type: {
                      id: 1,
                      code: "R",
                    },
                    branch: {
                      id: vm.branch.length === 0 ? "" : vm.branch[0].demo[0].id,
                    },
                    demographics: [],
                    externalId: vm.dataadd[vm.count].numerointerno,
                    listDiagnostic: [],
                    patient: patient,
                    tests: [],
                    deleteTests: [],
                    turn: "",
                  };
                  vm.duplicados.push(vm.order);
                  vm.porcent = Math.round((vm.count * 100) / vm.dataadd.length);
                  if (vm.dataadd.length === 1) {
                    UIkit.modal("#eventloadexcel", {
                      bgclose: false,
                      keyboard: false,
                    }).hide();
                    UIkit.modal("#modalprogressprintexport", {
                      bgclose: false,
                      keyboard: false,
                    }).hide();
                    vm.loading = false;
                    vm.viewreport();
                  } else if (vm.count === 0) {
                    vm.count = vm.count + 1;
                    UIkit.modal("#modalprogressprintexport", {
                      bgclose: false,
                      keyboard: false,
                    }).show();
                    vm.loadexcel();
                  } else if (vm.count === vm.dataadd.length - 1) {
                    UIkit.modal("#eventloadexcel", {
                      bgclose: false,
                      keyboard: false,
                    }).hide();
                    UIkit.modal("#modalprogressprintexport", {
                      bgclose: false,
                      keyboard: false,
                    }).hide();
                    vm.loading = false;
                    vm.viewreport();
                  } else {
                    vm.count = vm.count + 1;
                    vm.loadexcel();
                  }
                } else {
                  var auth = localStorageService.get(
                    "Enterprise_NT.authorizationData"
                  );
                  return orderDS
                    .getexternalId(
                      auth.authToken,
                      vm.dataadd[vm.count].numerointerno,
                      vm.branch[0].demo[0].code
                    )
                    .then(
                      function (data) {
                        if (data.data === true) {
                          var patient = {
                            documentType: {
                              id: "",
                            },
                            patientId:
                              vm.dataadd[vm.count].cedula === undefined
                                ? ""
                                : vm.dataadd[vm.count].cedula.trim() === ""
                                  ? ""
                                  : vm.dataadd[vm.count].cedula,
                            lastName:
                              vm.dataadd[vm.count].primerapellido === undefined
                                ? ""
                                : vm.dataadd[vm.count].primerapellido.trim() ===
                                  ""
                                  ? ""
                                  : vm.dataadd[vm.count].primerapellido,
                            surName:
                              vm.dataadd[vm.count].segundoapellido === undefined
                                ? ""
                                : vm.dataadd[
                                  vm.count
                                ].segundoapellido.trim() === ""
                                  ? ""
                                  : vm.dataadd[vm.count].segundoapellido,
                            name1:
                              vm.dataadd[vm.count].primernombre === undefined
                                ? ""
                                : vm.dataadd[vm.count].primernombre.trim() ===
                                  ""
                                  ? ""
                                  : vm.dataadd[vm.count].primernombre,
                            name2:
                              vm.dataadd[vm.count].segundonombre === undefined
                                ? ""
                                : vm.dataadd[vm.count].segundonombre.trim() ===
                                  ""
                                  ? ""
                                  : vm.dataadd[vm.count].segundonombre,
                            sex: {
                              id: "",
                            },
                            birthday: "",
                            email: "",
                            phone:
                              vm.dataadd[vm.count].telefono === undefined
                                ? ""
                                : vm.dataadd[vm.count].telefono.trim() === ""
                                  ? ""
                                  : vm.dataadd[vm.count].telefono,
                            address: "",
                            demographics: [],
                          };
                          vm.order = {
                            error: $filter('translate')('2046'),
                            index: vm.count + 1,
                            createdDateShort: Number(
                              moment().format("YYYYMMDD")
                            ),
                            orderNumber: null,
                            date: "",
                            type: {
                              id: 1,
                              code: "R",
                            },
                            demographics: [],
                            externalId: vm.dataadd[vm.count].numerointerno,
                            listDiagnostic: [],
                            patient: patient,
                            tests: [],
                            deleteTests: [],
                            turn: "",
                          };
                          vm.duplicados.push(vm.order);
                          vm.porcent = Math.round(
                            (vm.count * 100) / vm.dataadd.length
                          );
                          if (vm.dataadd.length === 1) {
                            UIkit.modal("#eventloadexcel", {
                              bgclose: false,
                              keyboard: false,
                            }).hide();
                            UIkit.modal("#modalprogressprintexport", {
                              bgclose: false,
                              keyboard: false,
                            }).hide();
                            vm.loading = false;
                            vm.viewreport();
                          } else if (vm.count === 0) {
                            vm.count = vm.count + 1;
                            UIkit.modal("#modalprogressprintexport", {
                              bgclose: false,
                              keyboard: false,
                            }).show();
                            vm.loadexcel();
                          } else if (vm.count === vm.dataadd.length - 1) {
                            UIkit.modal("#eventloadexcel", {
                              bgclose: false,
                              keyboard: false,
                            }).hide();
                            UIkit.modal("#modalprogressprintexport", {
                              bgclose: false,
                              keyboard: false,
                            }).hide();
                            vm.loading = false;
                            vm.viewreport();
                          } else {
                            vm.count = vm.count + 1;
                            vm.loadexcel();
                          }
                        } else {
                          if (vm.dataadd[vm.count].region !== undefined) {
                            var data = JSON.parse(
                              JSON.stringify(vm.patientDemos)
                            );
                            var region = _.filter(data, function (o) {
                              o.demo = _.filter(o.items, function (p) {
                                return (
                                  p.name.toUpperCase() ===
                                  vm.dataadd[vm.count].region
                                    .toUpperCase()
                                    .trim()
                                );
                              });
                              return o.demo.length > 0 && o.id === 1;
                            });
                          } else {
                            var region = [];
                          }
                          if (vm.dataadd[vm.count].distrito !== undefined) {
                            var data = JSON.parse(
                              JSON.stringify(vm.patientDemos)
                            );
                            var distrito = _.filter(data, function (o) {
                              o.demo = _.filter(o.items, function (p) {
                                return (
                                  p.name.toUpperCase() ===
                                  vm.dataadd[vm.count].distrito
                                    .toUpperCase()
                                    .trim()
                                );
                              });
                              return o.demo.length > 0 && o.id === 2;
                            });
                          } else {
                            var distrito = [];
                          }
                          if (
                            vm.dataadd[vm.count].corregimiento !== undefined
                          ) {
                            var data = JSON.parse(
                              JSON.stringify(vm.patientDemos)
                            );
                            var corregimiento = _.filter(data, function (o) {
                              o.demo = _.filter(o.items, function (p) {
                                return (
                                  p.name.toUpperCase() ===
                                  vm.dataadd[vm.count].corregimiento
                                    .toUpperCase()
                                    .trim()
                                );
                              });
                              return o.demo.length > 0 && o.id === 3;
                            });
                          } else {
                            var corregimiento = [];
                          }
                          if (vm.dataadd[vm.count].genero !== undefined) {
                            var data = JSON.parse(
                              JSON.stringify(vm.patientDemos)
                            );
                            var sex = _.filter(data, function (o) {
                              o.demo = _.filter(o.items, function (p) {
                                return (
                                  p.name.toUpperCase() ===
                                  vm.dataadd[vm.count].genero
                                    .toUpperCase()
                                    .trim()
                                );
                              });
                              return o.demo.length > 0 && o.id === -104;
                            });
                          } else {
                            var sex = [];
                          }
                          vm.demoH = [
                            {
                              idDemographic: 1,
                              encoded: true,
                              notCodifiedValue: "",
                              codifiedId:
                                region.length === 0 ? "" : region[0].demo[0].id,
                            },
                            {
                              idDemographic: 2,
                              encoded: true,
                              notCodifiedValue: "",
                              codifiedId:
                                distrito.length === 0
                                  ? ""
                                  : distrito[0].demo[0].id,
                            },
                            {
                              idDemographic: 3,
                              encoded: true,
                              notCodifiedValue: "",
                              codifiedId:
                                corregimiento.length === 0
                                  ? ""
                                  : corregimiento[0].demo[0].id,
                            },
                            {
                              idDemographic: 5,
                              encoded: false,
                              notCodifiedValue:
                                vm.dataadd[vm.count].personacontacto ===
                                  undefined
                                  ? ""
                                  : vm.dataadd[
                                    vm.count
                                  ].personacontacto.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].personacontacto.trim(),
                              codifiedId: "",
                            },
                            {
                              idDemographic: 6,
                              encoded: false,
                              notCodifiedValue:
                                vm.dataadd[vm.count].telefonocontacto ===
                                  undefined
                                  ? ""
                                  : vm.dataadd[
                                    vm.count
                                  ].telefonocontacto.trim() === ""
                                    ? ""
                                    : vm.dataadd[
                                      vm.count
                                    ].telefonocontacto.trim(),
                              codifiedId: "",
                            }
                          ];
                          var birthday = moment(vm.dataadd[vm.count].fechadenacimiento, vm.formatDateBirthday.toUpperCase()).valueOf();
                          if (isNaN(birthday)) {
                            var datecompared = moment(vm.dataadd[vm.count].fechadenacimiento).format('YYYY');
                            var datetoday = moment().format('YYYY');
                            if (datecompared < datetoday) {
                              var day = moment(vm.dataadd[vm.count].fechadenacimiento).format('DD');
                              var month = moment(vm.dataadd[vm.count].fechadenacimiento).format('MM');
                              var year = moment(vm.dataadd[vm.count].fechadenacimiento).subtract(100, 'y').format('YYYY');
                              var datecomplete = new Date(year, month, day)
                              var datebirthday = moment(datecomplete).format('YYYYMMDD');
                              birthday = moment(datebirthday, 'YYYYMMDD').valueOf();
                            } else {
                              var datebirthday = moment(vm.dataadd[vm.count].fechadenacimiento).format(vm.formatDateBirthday.toUpperCase());
                              birthday = moment(datebirthday, vm.formatDateBirthday.toUpperCase()).valueOf();
                            }
                          } else {
                            var datecompared = moment(birthday).format('YYYY');
                            var datetoday = moment().format('YYYY');
                            if (datecompared > datetoday) {
                              var day = moment(birthday).format('DD');
                              var month = moment(birthday).format('MM');
                              var year = moment(birthday).subtract(100, 'y').format('YYYY');
                              var datecomplete = new Date(year, month, day)
                              var datebirthday = moment(datecomplete).format('YYYYMMDD');
                              birthday = moment(datebirthday, 'YYYYMMDD').valueOf();
                            }
                          }
                          var patient = {
                            documentType: {
                              id: vm.documentType,
                            },
                            patientId:
                              vm.dataadd[vm.count].cedula === undefined
                                ? ""
                                : vm.dataadd[vm.count].cedula.trim() === ""
                                  ? ""
                                  : vm.dataadd[vm.count].cedula.trim(),
                            lastName:
                              vm.dataadd[vm.count].primerapellido === undefined
                                ? ""
                                : vm.dataadd[vm.count].primerapellido.trim() ===
                                  ""
                                  ? ""
                                  : vm.dataadd[vm.count].primerapellido.trim(),
                            surName:
                              vm.dataadd[vm.count].segundoapellido === undefined
                                ? ""
                                : vm.dataadd[
                                  vm.count
                                ].segundoapellido.trim() === ""
                                  ? ""
                                  : vm.dataadd[vm.count].segundoapellido.trim(),
                            name1:
                              vm.dataadd[vm.count].primernombre === undefined
                                ? ""
                                : vm.dataadd[vm.count].primernombre.trim() ===
                                  ""
                                  ? ""
                                  : vm.dataadd[vm.count].primernombre.trim(),
                            name2:
                              vm.dataadd[vm.count].segundonombre === undefined
                                ? ""
                                : vm.dataadd[vm.count].segundonombre.trim() ===
                                  ""
                                  ? ""
                                  : vm.dataadd[vm.count].segundonombre.trim(),
                            sex: {
                              id: sex.length === 0 ? "" : sex[0].demo[0].id,
                            },
                            birthday: birthday,
                            email:
                              vm.dataadd[vm.count].correo === undefined
                                ? ""
                                : vm.dataadd[vm.count].correo.trim() === ""
                                  ? ""
                                  : vm.dataadd[vm.count].correo.trim(),
                            phone:
                              vm.dataadd[vm.count].telefono === undefined
                                ? ""
                                : vm.dataadd[vm.count].telefono.trim() === ""
                                  ? ""
                                  : vm.dataadd[vm.count].telefono.trim(),
                            address:
                              vm.dataadd[vm.count].direccion === undefined
                                ? ""
                                : vm.dataadd[vm.count].direccion.trim() === ""
                                  ? ""
                                  : vm.dataadd[vm.count].direccion.trim(),
                            demographics: vm.demoH,
                          };

                          if (
                            vm.dataadd[vm.count].procedenciamuestra !==
                            undefined
                          ) {
                            var data = JSON.parse(
                              JSON.stringify(vm.orderDemos)
                            );
                            var procent = _.filter(data, function (o) {
                              o.demo = _.filter(o.items, function (p) {
                                return (
                                  p.name.toUpperCase() ===
                                  vm.dataadd[vm.count].procedenciamuestra
                                    .toUpperCase()
                                    .trim()
                                );
                              });
                              return o.demo.length > 0 && o.id === 9;
                            });
                          } else {
                            var procent = [];
                          }

                          if (vm.dataadd[vm.count].tipodeprueba !== undefined) {
                            var data = JSON.parse(JSON.stringify(vm.Testlist));
                            var test = $filter("filter")(data, function (e) {
                              return e.name.toUpperCase() === vm.dataadd[vm.count].tipodeprueba.toUpperCase().trim()
                            });
                          } else {
                            var test = [];
                          }

                          var fechavalid = moment(
                            vm.dataadd[vm.count].fechaderesultado,
                            vm.formatDateBirthday.toUpperCase(),
                            true
                          ).isValid();
                          var datevalidate = moment(
                            vm.dataadd[vm.count].fechadesintomas,
                            vm.formatDateBirthday.toUpperCase(),
                            true
                          ).isValid();
                          var datebirthday = moment(
                            vm.dataadd[vm.count].fechadenacimiento,
                            vm.formatDateBirthday.toUpperCase(),
                            true
                          ).isValid();

                          var validatetypetest = true;
                          if (vm.dataadd[vm.count].resultado === undefined) {
                            validatetypetest = true;
                          } else if (vm.dataadd[vm.count].resultado.trim() === "") {
                            validatetypetest = true;
                          } else {
                            validatetypetest = false;
                          }

                          if (
                            region.length === 0 ||
                            distrito.length === 0 ||
                            corregimiento.length === 0 ||
                            !datevalidate ||
                            test.length === 0 ||
                            validatetypetest ||
                            !fechavalid ||
                            !datebirthday ||
                            vm.dataadd[vm.count].primerapellido === undefined ||
                            vm.dataadd[vm.count].primernombre === undefined ||
                            sex.length === 0
                          ) {
                            var error = $filter('translate')('2047');
                            if (test.length === 0) {
                              var error = error + " " + $filter('translate')('2048') + " " + $filter('translate')('2049');
                            }
                            if (validatetypetest && test.length !== 0) {
                              var error = error + " " + $filter('translate')('2049');
                            }
                            if (!fechavalid) {
                              var error = error + " " + $filter('translate')('2052');
                            }
                            if (!fechavalid) {
                              error = error + ' ' + $filter('translate')('2052');
                            }
                            if (region.length === 0) {
                              error = error + ' ' + $filter('translate')('2032');
                            }
                            if (distrito.length === 0) {
                              error = error + ' ' + $filter('translate')('2033');
                            }
                            if (corregimiento.length === 0) {
                              error = error + ' ' + $filter('translate')('2034');
                            }
                            if (!datevalidate) {
                              error = error + ' ' + $filter('translate')('2031');
                            }
                            if (!datebirthday) {
                              error = error + ' ' + $filter('translate')('0976');
                            }
                            if (
                              vm.dataadd[vm.count].primerapellido === undefined
                            ) {
                              error = error + ' ' + $filter('translate')('0686');
                            }
                            if (
                              vm.dataadd[vm.count].primernombre === undefined
                            ) {
                              error = error + ' ' + $filter('translate')('0118');
                            }
                            if (sex.length === 0) {
                              error = error + ' ' + $filter('translate')('0124');
                            }
                            if (vm.dataadd[vm.count].region !== undefined) {
                              var data = JSON.parse(
                                JSON.stringify(vm.patientDemos)
                              );
                              var region = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].region
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 1;
                              });
                            } else {
                              var region = [];
                            }

                            if (vm.dataadd[vm.count].distrito !== undefined) {
                              var data = JSON.parse(
                                JSON.stringify(vm.patientDemos)
                              );
                              var distrito = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].distrito
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 2;
                              });
                            } else {
                              var distrito = [];
                            }

                            if (
                              vm.dataadd[vm.count].corregimiento !== undefined
                            ) {
                              var data = JSON.parse(
                                JSON.stringify(vm.patientDemos)
                              );
                              var corregimiento = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].corregimiento
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 3;
                              });
                            } else {
                              var corregimiento = [];
                            }

                            if (vm.dataadd[vm.count].genero !== undefined) {
                              var data = JSON.parse(
                                JSON.stringify(vm.patientDemos)
                              );
                              var sex = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].genero
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === -104;
                              });
                            } else {
                              var sex = [];
                            }

                            vm.demoH = [
                              {
                                idDemographic: 1,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  region.length === 0
                                    ? ""
                                    : region[0].demo[0].id,
                              },
                              {
                                idDemographic: 2,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  distrito.length === 0
                                    ? ""
                                    : distrito[0].demo[0].id,
                              },
                              {
                                idDemographic: 3,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  corregimiento.length === 0
                                    ? ""
                                    : corregimiento[0].demo[0].id,
                              },
                              {
                                idDemographic: 5,
                                encoded: false,
                                notCodifiedValue:
                                  vm.dataadd[vm.count].personacontacto ===
                                    undefined
                                    ? ""
                                    : vm.dataadd[
                                      vm.count
                                    ].personacontacto.trim() === ""
                                      ? ""
                                      : vm.dataadd[
                                        vm.count
                                      ].personacontacto.trim(),
                                codifiedId: "",
                              },
                              {
                                idDemographic: 6,
                                encoded: false,
                                notCodifiedValue:
                                  vm.dataadd[vm.count].telefonocontacto ===
                                    undefined
                                    ? ""
                                    : vm.dataadd[
                                      vm.count
                                    ].telefonocontacto.trim() === ""
                                      ? ""
                                      : vm.dataadd[
                                        vm.count
                                      ].telefonocontacto.trim(),
                                codifiedId: "",
                              },
                            ];

                            var birthday = moment(vm.dataadd[vm.count].fechadenacimiento, vm.formatDateBirthday.toUpperCase()).valueOf();
                            var datecompared = moment(birthday).format('YYYY');
                            var datetoday = moment().format('YYYY');
                            if (datecompared > datetoday) {
                              var day = moment(birthday).format('DD');
                              var month = parseInt(moment(birthday).format('MM')) - 1 + '';
                              var year = moment(birthday).subtract(100, 'y').format('YYYY');
                              var datecomplete = new Date(year, month, day)
                              var datebirthday = moment(datecomplete).format('YYYYMMDD');
                              birthday = moment(datebirthday, 'YYYYMMDD').valueOf();
                            }

                            var patient = {
                              documentType: {
                                id: vm.documentType,
                              },
                              patientId:
                                vm.dataadd[vm.count].cedula === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].cedula.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].cedula,
                              lastName:
                                vm.dataadd[vm.count].primerapellido ===
                                  undefined
                                  ? ""
                                  : vm.dataadd[
                                    vm.count
                                  ].primerapellido.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].primerapellido,
                              surName:
                                vm.dataadd[vm.count].segundoapellido ===
                                  undefined
                                  ? ""
                                  : vm.dataadd[
                                    vm.count
                                  ].segundoapellido.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].segundoapellido,
                              name1:
                                vm.dataadd[vm.count].primernombre === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].primernombre.trim() ===
                                    ""
                                    ? ""
                                    : vm.dataadd[vm.count].primernombre,
                              name2:
                                vm.dataadd[vm.count].segundonombre === undefined
                                  ? ""
                                  : vm.dataadd[
                                    vm.count
                                  ].segundonombre.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].segundonombre,
                              sex: {
                                id: sex.length === 0 ? "" : sex[0].demo[0].id,
                              },
                              birthday: birthday,
                              email:
                                vm.dataadd[vm.count].correo === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].correo.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].correo,
                              phone:
                                vm.dataadd[vm.count].telefono === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].telefono.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].telefono,
                              address:
                                vm.dataadd[vm.count].direccion === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].direccion.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].direccion,
                              demographics: vm.demoH,
                            };

                            if (
                              vm.dataadd[vm.count].procedenciamuestra !==
                              undefined
                            ) {
                              var data = JSON.parse(
                                JSON.stringify(vm.orderDemos)
                              );
                              var procent = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].procedenciamuestra
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 9;
                              });
                            } else {
                              var procent = [];
                            }

                            if (vm.dataadd[vm.count].tipodeprueba !== undefined) {
                              var data = JSON.parse(JSON.stringify(vm.Testlist));
                              var test = $filter("filter")(data, function (e) {
                                return e.name.toUpperCase() === vm.dataadd[vm.count].tipodeprueba.toUpperCase().trim()
                              });
                            } else {
                              var test = [];
                            }
                            if (
                              vm.dataadd[vm.count].tipodepaciente !== undefined
                            ) {
                              var data = JSON.parse(
                                JSON.stringify(vm.orderDemos)
                              );
                              var tipodepaciente = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].tipodepaciente
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 14;
                              });
                            } else {
                              var tipodepaciente = [];
                            }

                            if (
                              vm.dataadd[vm.count].tipodemuestra !== undefined
                            ) {
                              var data = JSON.parse(
                                JSON.stringify(vm.orderDemos)
                              );
                              var tipodemuestra = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].tipodemuestra
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 15;
                              });
                            } else {
                              var tipodemuestra = [];
                            }
                            var datetake = moment(vm.dataadd[vm.count].fechadetoma, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechadetoma : "";
                            var viewCodifiedValue = '';
                            if (datetake !== '') {
                              viewCodifiedValue = moment(datetake, vm.formatDateBirthday.toUpperCase()).valueOf();
                              viewCodifiedValue = moment(viewCodifiedValue).format(vm.format.toUpperCase());
                            }


                            var dateresult = moment(vm.dataadd[vm.count].fechaderesultado, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechaderesultado : "";
                            var viewdateresult = '';
                            if (dateresult !== '') {
                              viewdateresult = moment(dateresult, vm.formatDateBirthday.toUpperCase()).valueOf();
                              viewdateresult = moment(viewdateresult).format(vm.format.toUpperCase());
                            }


                            var datesintomas = moment(vm.dataadd[vm.count].fechadesintomas, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechadesintomas : "";
                            var dateview = '';
                            if (datesintomas !== '') {
                              dateview = moment(datesintomas, vm.formatDateBirthday.toUpperCase()).valueOf();
                              dateview = moment(dateview).format(vm.format.toUpperCase());
                            }
                            vm.demoorder = [
                              {
                                idDemographic: 9,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  procent.length === 0
                                    ? ""
                                    : procent[0].demo[0].id,
                              },
                              {
                                idDemographic: 10,
                                encoded: false,
                                notCodifiedValue: viewCodifiedValue,
                                codifiedId: "",
                              },
                              {
                                idDemographic: 13,
                                encoded: false,
                                notCodifiedValue: viewdateresult,
                                codifiedId: "",
                              },
                              {
                                idDemographic: 14,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  tipodepaciente.length === 0
                                    ? ""
                                    : tipodepaciente[0].demo[0].id,
                              },
                              {
                                idDemographic: 15,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  tipodemuestra.length === 0
                                    ? ""
                                    : tipodemuestra[0].demo[0].id,
                              },
                              {
                                idDemographic: 18,
                                encoded: false,
                                notCodifiedValue: dateview,
                                codifiedId: "",
                              },
                            ];
                            vm.order = {
                              error: error,
                              index: vm.count + 1,
                              createdDateShort: Number(
                                moment().format("YYYYMMDD")
                              ),
                              orderNumber: null,
                              date: "",
                              type: {
                                id: 1,
                                code: "R",
                              },
                              branch: {
                                id:
                                  vm.branch.length === 0
                                    ? ""
                                    : vm.branch[0].demo[0].id,
                              },
                              demographics: vm.demoorder,
                              externalId: vm.dataadd[vm.count].numerointerno,
                              listDiagnostic: [],
                              patient: patient,
                              tests: test,
                              inconsistency: true,
                              deleteTests: [],
                              turn: "",
                            };
                            vm.inconsistencias.push(vm.order);
                            var auth = localStorageService.get(
                              "Enterprise_NT.authorizationData"
                            );
                            orderDS.insertOrder(auth.authToken, vm.order).then(
                              function (data) {
                                if (data.status === 200) {
                                  if (vm.dataadd[vm.count].resultado === undefined || data.data.tests.length) {
                                    vm.porcent = Math.round(
                                      (vm.count * 100) / vm.dataadd.length
                                    );
                                    if (
                                      vm.count ===
                                      vm.dataadd.length - 1
                                    ) {
                                      UIkit.modal("#eventloadexcel", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).hide();
                                      UIkit.modal("#modalprogressprintexport", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).hide();
                                      vm.loading = false;
                                      vm.viewreport();
                                    } else if (vm.count === 0) {
                                      vm.count = vm.count + 1;
                                      UIkit.modal("#modalprogressprintexport", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).show();
                                      vm.loadexcel();
                                    } else {
                                      vm.count = vm.count + 1;
                                      vm.loadexcel();
                                    }

                                  } else if (vm.dataadd[vm.count].resultado.trim() === "") {
                                    vm.porcent = Math.round(
                                      (vm.count * 100) / vm.dataadd.length
                                    );
                                    if (
                                      vm.count ===
                                      vm.dataadd.length - 1
                                    ) {
                                      UIkit.modal("#eventloadexcel", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).hide();
                                      UIkit.modal("#modalprogressprintexport", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).hide();
                                      vm.loading = false;
                                      vm.viewreport();
                                    } else if (vm.count === 0) {
                                      vm.count = vm.count + 1;
                                      UIkit.modal("#modalprogressprintexport", {
                                        bgclose: false,
                                        keyboard: false,
                                      }).show();
                                      vm.loadexcel();
                                    } else {
                                      vm.count = vm.count + 1;
                                      vm.loadexcel();
                                    }
                                  } else {
                                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                    return resultsentryDS.getresults(auth.authToken, data.data.orderNumber).then(function (data) {
                                      if (data.status === 200) {
                                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                        vm.listestresult = data.data;
                                        vm.listestresult[0].result = vm.dataadd[vm.count].resultado.trim();
                                        vm.listestresult[0].newState = 2;
                                        vm.listestresult[0].idUser = auth.id;
                                        vm.listestresult[0].resultChanged = true;
                                        return resultsentryDS.updateTest(auth.authToken, vm.listestresult[0]).then(function (data) {
                                          if (data.status === 200) {
                                            vm.porcent = Math.round(
                                              (vm.count * 100) / vm.dataadd.length
                                            );
                                            if (
                                              vm.count ===
                                              vm.dataadd.length - 1
                                            ) {
                                              UIkit.modal("#eventloadexcel", {
                                                bgclose: false,
                                                keyboard: false,
                                              }).hide();
                                              UIkit.modal("#modalprogressprintexport", {
                                                bgclose: false,
                                                keyboard: false,
                                              }).hide();
                                              vm.loading = false;
                                              vm.viewreport();
                                            } else if (vm.count === 0) {
                                              vm.count = vm.count + 1;
                                              UIkit.modal("#modalprogressprintexport", {
                                                bgclose: false,
                                                keyboard: false,
                                              }).show();
                                              vm.loadexcel();
                                            } else {
                                              vm.count = vm.count + 1;
                                              vm.loadexcel();
                                            }
                                          }
                                        }, function (error) {
                                          vm.modalError(error);
                                        });
                                      }
                                    },
                                      function (error) {
                                        vm.loading = false;
                                      }
                                    );
                                  }
                                }
                              },
                              function (error) {
                                vm.loading = false;
                              }
                            );
                          } else {
                            if (vm.dataadd[vm.count].region !== undefined) {
                              var data = JSON.parse(
                                JSON.stringify(vm.patientDemos)
                              );
                              var region = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].region
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 1;
                              });
                            } else {
                              var region = [];
                            }
                            if (vm.dataadd[vm.count].distrito !== undefined) {
                              var data = JSON.parse(
                                JSON.stringify(vm.patientDemos)
                              );
                              var distrito = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].distrito
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 2;
                              });
                            } else {
                              var distrito = [];
                            }
                            if (
                              vm.dataadd[vm.count].corregimiento !== undefined
                            ) {
                              var data = JSON.parse(
                                JSON.stringify(vm.patientDemos)
                              );
                              var corregimiento = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].corregimiento
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 3;
                              });
                            } else {
                              var corregimiento = [];
                            }

                            if (vm.dataadd[vm.count].genero !== undefined) {
                              var data = JSON.parse(
                                JSON.stringify(vm.patientDemos)
                              );
                              var sex = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].genero
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === -104;
                              });
                            } else {
                              var sex = [];
                            }
                            /* 
                             */
                            vm.demoH = [
                              {
                                idDemographic: 1,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  region.length === 0
                                    ? ""
                                    : region[0].demo[0].id,
                              },
                              {
                                idDemographic: 2,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  distrito.length === 0
                                    ? ""
                                    : distrito[0].demo[0].id,
                              },
                              {
                                idDemographic: 3,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  corregimiento.length === 0
                                    ? ""
                                    : corregimiento[0].demo[0].id,
                              },
                              {
                                idDemographic: 5,
                                encoded: false,
                                notCodifiedValue:
                                  vm.dataadd[vm.count].personacontacto ===
                                    undefined
                                    ? ""
                                    : vm.dataadd[
                                      vm.count
                                    ].personacontacto.trim() === ""
                                      ? ""
                                      : vm.dataadd[
                                        vm.count
                                      ].personacontacto.trim(),
                                codifiedId: "",
                              },
                              {
                                idDemographic: 6,
                                encoded: false,
                                notCodifiedValue:
                                  vm.dataadd[vm.count].telefonocontacto ===
                                    undefined
                                    ? ""
                                    : vm.dataadd[
                                      vm.count
                                    ].telefonocontacto.trim() === ""
                                      ? ""
                                      : vm.dataadd[
                                        vm.count
                                      ].telefonocontacto.trim(),
                                codifiedId: "",
                              },
                            ];

                            var birthday = moment(vm.dataadd[vm.count].fechadenacimiento, vm.formatDateBirthday.toUpperCase()).valueOf();
                            var datecompared = moment(birthday).format('YYYY');
                            var datetoday = moment().format('YYYY');
                            if (datecompared > datetoday) {
                              var day = moment(birthday).format('DD');
                              var month = parseInt(moment(birthday).format('MM')) - 1 + '';
                              var year = moment(birthday).subtract(100, 'y').format('YYYY');
                              var datecomplete = new Date(year, month, day)
                              var datebirthday = moment(datecomplete).format('YYYYMMDD');
                              birthday = moment(datebirthday, 'YYYYMMDD').valueOf();
                            }

                            var patient = {
                              documentType: {
                                id: vm.documentType,
                              },
                              patientId:
                                vm.dataadd[vm.count].cedula === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].cedula.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].cedula.trim(),
                              lastName:
                                vm.dataadd[vm.count].primerapellido ===
                                  undefined
                                  ? ""
                                  : vm.dataadd[
                                    vm.count
                                  ].primerapellido.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].primerapellido.trim(),
                              surName:
                                vm.dataadd[vm.count].segundoapellido ===
                                  undefined
                                  ? ""
                                  : vm.dataadd[
                                    vm.count
                                  ].segundoapellido.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].segundoapellido.trim(),
                              name1:
                                vm.dataadd[vm.count].primernombre === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].primernombre.trim() ===
                                    ""
                                    ? ""
                                    : vm.dataadd[vm.count].primernombre.trim(),
                              name2:
                                vm.dataadd[vm.count].segundonombre === undefined
                                  ? ""
                                  : vm.dataadd[
                                    vm.count
                                  ].segundonombre.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].segundonombre.trim(),
                              sex: {
                                id: sex.length === 0 ? "" : sex[0].demo[0].id,
                              },
                              birthday: birthday,
                              email:
                                vm.dataadd[vm.count].correo === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].correo.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].correo.trim(),
                              phone:
                                vm.dataadd[vm.count].telefono === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].telefono.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].telefono.trim(),
                              address:
                                vm.dataadd[vm.count].direccion === undefined
                                  ? ""
                                  : vm.dataadd[vm.count].direccion.trim() === ""
                                    ? ""
                                    : vm.dataadd[vm.count].direccion.trim(),
                              demographics: vm.demoH,
                            };
                            if (
                              vm.dataadd[vm.count].procedenciamuestra !==
                              undefined
                            ) {
                              var data = JSON.parse(
                                JSON.stringify(vm.orderDemos)
                              );
                              var procent = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].procedenciamuestra
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 9;
                              });
                            } else {
                              var procent = [];
                            }
                            if (vm.dataadd[vm.count].tipodeprueba !== undefined) {
                              var data = JSON.parse(JSON.stringify(vm.Testlist));
                              var test = $filter("filter")(data, function (e) {
                                return e.name.toUpperCase() === vm.dataadd[vm.count].tipodeprueba.toUpperCase().trim()
                              });
                            } else {
                              var test = [];
                            }
                            if (
                              vm.dataadd[vm.count].tipodepaciente !== undefined
                            ) {
                              var data = JSON.parse(
                                JSON.stringify(vm.orderDemos)
                              );
                              var tipodepaciente = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].tipodepaciente
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 14;
                              });
                            } else {
                              var tipodepaciente = [];
                            }

                            if (
                              vm.dataadd[vm.count].tipodemuestra !== undefined
                            ) {
                              var data = JSON.parse(
                                JSON.stringify(vm.orderDemos)
                              );
                              var tipodemuestra = _.filter(data, function (o) {
                                o.demo = _.filter(o.items, function (p) {
                                  return (
                                    p.name.toUpperCase() ===
                                    vm.dataadd[vm.count].tipodemuestra
                                      .toUpperCase()
                                      .trim()
                                  );
                                });
                                return o.demo.length > 0 && o.id === 15;
                              });
                            } else {
                              var tipodemuestra = [];
                            }
                            var datetake = moment(vm.dataadd[vm.count].fechadetoma, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechadetoma : "";
                            var viewCodifiedValue = '';
                            if (datetake !== '') {
                              viewCodifiedValue = moment(datetake, vm.formatDateBirthday.toUpperCase()).valueOf();
                              viewCodifiedValue = moment(viewCodifiedValue).format(vm.format.toUpperCase());
                            }


                            var dateresult = moment(vm.dataadd[vm.count].fechaderesultado, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechaderesultado : "";
                            var viewdateresult = '';
                            if (dateresult !== '') {
                              viewdateresult = moment(dateresult, vm.formatDateBirthday.toUpperCase()).valueOf();
                              viewdateresult = moment(viewdateresult).format(vm.format.toUpperCase());
                            }

                            var datesintomas = moment(vm.dataadd[vm.count].fechadesintomas, vm.formatDateBirthday.toUpperCase(), true).isValid() ? vm.dataadd[vm.count].fechadesintomas : "";
                            var dateview = '';
                            if (datesintomas !== '') {
                              dateview = moment(datesintomas, vm.formatDateBirthday.toUpperCase()).valueOf();
                              dateview = moment(dateview).format(vm.format.toUpperCase());
                            }

                            vm.demoorder = [
                              {
                                idDemographic: 9,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  procent.length === 0
                                    ? ""
                                    : procent[0].demo[0].id,
                              },
                              {
                                idDemographic: 10,
                                encoded: false,
                                notCodifiedValue: viewCodifiedValue,
                                codifiedId: "",
                              },
                              {
                                idDemographic: 13,
                                encoded: false,
                                notCodifiedValue: viewdateresult,
                                codifiedId: "",
                              },
                              {
                                idDemographic: 14,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  tipodepaciente.length === 0
                                    ? ""
                                    : tipodepaciente[0].demo[0].id,
                              },
                              {
                                idDemographic: 15,
                                encoded: true,
                                notCodifiedValue: "",
                                codifiedId:
                                  tipodemuestra.length === 0
                                    ? ""
                                    : tipodemuestra[0].demo[0].id,
                              },
                              {
                                idDemographic: 18,
                                encoded: false,
                                notCodifiedValue: dateview,
                                codifiedId: "",
                              },
                            ];
                            vm.order = {
                              createdDateShort: Number(
                                moment().format("YYYYMMDD")
                              ),
                              orderNumber: null,
                              date: "",
                              type: {
                                id: 1,
                                code: "R",
                              },
                              branch: {
                                id:
                                  vm.branch.length === 0
                                    ? ""
                                    : vm.branch[0].demo[0].id,
                              },
                              demographics: vm.demoorder,
                              externalId: vm.dataadd[vm.count].numerointerno,
                              listDiagnostic: [],
                              patient: patient,
                              tests: test,
                              deleteTests: [],
                              turn: "",
                            };
                            var auth = localStorageService.get(
                              "Enterprise_NT.authorizationData"
                            );
                            orderDS.insertOrder(auth.authToken, vm.order).then(
                              function (data) {
                                if (data.status === 200) {
                                  data.data.resulttest = vm.dataadd[vm.count].resultado === undefined ? '' : vm.dataadd[vm.count].resultado;
                                  data.data.index = vm.count + 1;
                                  vm.Insertadas.push(data.data);
                                  var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                  return resultsentryDS.getresults(auth.authToken, data.data.orderNumber).then(function (data) {
                                    if (data.status === 200) {
                                      var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                      vm.listestresult = data.data;
                                      vm.listestresult[0].result = vm.dataadd[vm.count].resultado.trim();
                                      vm.listestresult[0].newState = 2;
                                      vm.listestresult[0].idUser = auth.id;
                                      vm.listestresult[0].resultChanged = true;
                                      return resultsentryDS.updateTest(auth.authToken, vm.listestresult[0]).then(function (data) {
                                        if (data.status === 200) {
                                          vm.porcent = Math.round(
                                            (vm.count * 100) / vm.dataadd.length
                                          );
                                          if (
                                            vm.count ===
                                            vm.dataadd.length - 1
                                          ) {
                                            UIkit.modal("#eventloadexcel", {
                                              bgclose: false,
                                              keyboard: false,
                                            }).hide();
                                            UIkit.modal("#modalprogressprintexport", {
                                              bgclose: false,
                                              keyboard: false,
                                            }).hide();
                                            vm.loading = false;
                                            vm.viewreport();
                                          } else if (vm.count === 0) {
                                            vm.count = vm.count + 1;
                                            UIkit.modal("#modalprogressprintexport", {
                                              bgclose: false,
                                              keyboard: false,
                                            }).show();
                                            vm.loadexcel();
                                          } else {
                                            vm.count = vm.count + 1;
                                            vm.loadexcel();
                                          }
                                        }
                                      }, function (error) {
                                        vm.modalError(error);
                                      });
                                    }
                                  },
                                    function (error) {
                                      vm.loading = false;
                                    }
                                  );
                                }
                              },
                              function (error) {
                                vm.loading = false;
                              }
                            );
                          }
                        }
                      },
                      function (error) {
                        vm.loading = false;
                        vm.modalError(error);
                      }
                    );
                }
              }
            }
          }

          function viewreport() {
            vm.loadingdata = true;
            var variables = [
              {
                abbreviation: "cltech",
                date: "",
                Username: "",
              },
            ];

            vm.datareport = {
              inconsistencias: vm.inconsistencias,
              Insertadas: vm.Insertadas,
              duplicados: vm.duplicados,
            };

            var parameterReport = {};
            parameterReport.variables = variables;
            parameterReport.pathreport =
              "/Report/pre-analitic/consolidateorder/consolidate.mrt";
            parameterReport.labelsreport = JSON.stringify(
              $translate.getTranslationTable()
            );
            var datareport = LZString.compressToUTF16(
              JSON.stringify(vm.datareport)
            );
            localStorageService.set("parameterReport", parameterReport);
            localStorageService.set("dataReport", datareport);
            window.open("/viewreport/viewreport.html");
            vm.loadingdata = false;
          }
        },
      ],
      controllerAs: "eventloadexcel",
    };
    return directive;
  }
})();