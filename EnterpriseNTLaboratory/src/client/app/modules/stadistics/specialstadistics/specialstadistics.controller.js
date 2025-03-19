/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.specialstadistics')
    .controller('specialstadisticsController', specialstadisticsController);


  specialstadisticsController.$inject = ['localStorageService', 'LZString', '$translate',
    '$filter', '$state', 'moment', '$rootScope', 'stadisticsDS', 'testDS', 'listDS', 'reportadicional'
  ];

  function specialstadisticsController(localStorageService, LZString, $translate,
    $filter, $state, moment, $rootScope, stadisticsDS, testDS, listDS, reportadicional) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'specialstadistics';
    $rootScope.helpReference = '05.Stadistics/specialstadistics.htm';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0034');
    vm.numbergroup = 3;
    vm.numbergroupr = 3;
    vm.statetypereport = false;
    vm.loading = true;
    vm.report = false;
    vm.report2 = false;
    vm.report3 = false;
    vm.reportSE = false;
    vm.printReportmotivereject = printReportmotivereject;
    vm.isOpenReport = false;
    vm.listgroup = [];
    vm.modalError = modalError;
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    vm.printReporepeated = printReporepeated;
    vm.cleang1 = false;
    vm.cleang2 = false;
    vm.typereport = '1';
    vm.typefilter = '1';
    $rootScope.pageview = 3;
    vm.typeresult = '0';
    vm.type = '1';
    vm.getTest = getTest;
    vm.getGender = getGender;
    vm.validage = validage;
    vm.validref = validref;
    vm.printReportspecialstadistics = printReportspecialstadistics;
    vm.minimumage = null;
    vm.maximumage = null;
    vm.minimalreference = null;
    vm.maximumreference = null;
    vm.serie = null;
    vm.changetyreport = changetyreport;
    vm.windowOpenReport = windowOpenReport;
    vm.printReportmicro = printReportmicro;
    vm.datehoytoday = moment().format('YYYYMMDD');
    vm.rangeInit4 = vm.datehoytoday;
    vm.rangeEnd4 = vm.datehoytoday;
    vm.rangeInitR = vm.datehoytoday;
    vm.rangeEndR = vm.datehoytoday;
    vm.rangeInit = vm.datehoytoday;
    vm.rangeEnd = vm.datehoytoday;
    vm.rangeInitSE = vm.datehoytoday;
    vm.rangeEndSE = vm.datehoytoday;
    vm.loadingdata = true;
    vm.clearalltab = clearalltab;
    vm.button = button;
    vm.buttonmicrobiology = buttonmicrobiology;
    vm.decimal = 0;
    vm.format = 'n0';
    vm.demosmask = "-110||-104||-100||-101||-102||-103||-109";
    vm.abbrCustomer = localStorageService.get("Abreviatura");
    vm.nameCustomer = localStorageService.get("Entidad");

    function clearalltab() {
      vm.minimalreference = null;
      vm.maximumreference = null;
      vm.dataTest.selected = null;
      vm.minimumage = null;
      vm.maximumage = null;
      vm.serie = null;
      vm.graphtype = null;
      vm.cleang1 = true;
      vm.cleang2 = true;
      vm.cleang4 = true
    }

    function button(id) {
      vm.typefilter = vm.typefilter === null ? id : vm.typefilter;
    }

    function buttonmicrobiology(id) {
      vm.type = vm.type === null ? id : vm.type;
    }

    function getTest(id) {
      vm.typeresult = vm.typeresult === null ? id : vm.typeresult;
      vm.minimalreference = null;
      vm.maximumreference = null;
      vm.result = null;
      vm.comment = null;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(function (data) {
        vm.loadingdata = false;
        vm.dataTest = [];
        if (data.data.length > 0) {
          if (vm.typeresult !== '2') {
            var typeresult = vm.typeresult === '0' ? 1 : 2
            data.data = $filter('filter')(data.data, {
              resultType: typeresult
            });
          }
          if (vm.typeresult !== '0' && vm.typereport === '2') {
            vm.graphtype = 1;
          }
          vm.dataTest = data.data
          vm.dataTest.selected = null;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    vm.changuedate = changuedate;

    function changuedate() {
      vm.minimalreference = null;
      vm.maximumreference = null;
      vm.decimal = $filter('filter')(vm.dataTest, {
        id: vm.dataTest.selected.id
      })[0].decimal
      vm.format = 'n' + vm.decimal;
    }

    function getGender(id, index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 6).then(function (data) {
        vm.getTest();
        vm.dataGender = [];
        if (data.data.length > 0) {

          data.data.forEach(function (value) {
            if (value.id !== 9) {
              vm.dataGender.push({
                'id': value.id,
                'name': ($filter('translate')('0000') === 'enUsa' ? value.enUsa : value.esCo)
              });
            }
          });
        }
        vm.gender = 42;

      }, function (error) {
        vm.modalError(error);
      });
    }

    function validage() {
      if (vm.minimumage > vm.maximumage) {
        vm.maximumage = vm.minimumage + 1;
      }
    }

    function validref() {
      if (vm.minimalreference > vm.maximumreference) {
        vm.maximumreference = vm.minimalreference + 1;
      }
    }

    function changetyreport(id) {
      vm.typereport = vm.typereport === null ? id : vm.typereport;
      if (vm.typereport === '1') {
        vm.serie = null;
        vm.graphtype = null;
      } else {
        vm.graphtype = 1;
      }
    }

    function windowOpenReport() {
      // if (vm.datareport.length > 0) {
      //   var parameterReport = {};
      //   parameterReport.variables = vm.variables;
      //   parameterReport.pathreport = vm.pathreport;
      //   parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
      //   var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      //   localStorageService.set('parameterReport', parameterReport);
      //   localStorageService.set('dataReport', datareport);
      //   window.open('/viewreport/viewreport.html');
      // } else {
      //   UIkit.modal('#modalReportError').show();
      // }

      if (vm.datareport.length > 0) {
        var labelsreport = JSON.stringify($translate.getTranslationTable());
        labelsreport = JSON.parse(labelsreport);
        var parameterReport = {};
        parameterReport.datareport = vm.datareport;
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = labelsreport;
        parameterReport.type = vm.type;
        vm.ind = 1;
        vm.total = vm.datareport.length / 3;
        vm.porcent = 0;
        UIkit.modal('#modalprogress', { bgclose: false, escclose: false, modal: false }).show();
        var nIntervId;
        nIntervId = setInterval(vm.flasheaTexto, 200);
        reportadicional.reportRender(parameterReport).then(function (data) {
          UIkit.modal('#modalprogress', { bgclose: false, escclose: false, modal: false }).hide();
          vm.porcent = 0;
          clearInterval(nIntervId);
        });
        vm.report = false;
        vm.loadingdata = false;
      } else {
        UIkit.modal("#modalReportError").show();
      }
    }

    function changedateresult(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        value.resultTest.forEach(function (value1) {
          value1.resultDate = moment(value1.resultDate).format(vm.formatDate);
          value1.hasObservationResult = value1.hasComment === true ? true : value1.hasTemplate === true ? true : false;
        });
      });

      return data.data;
    }

    function printReportspecialstadistics(type) {
      vm.reportSE = true;
      vm.type = type;
      vm.datareport = [];
      var data = {
        'resultType': vm.typeresult,
        'init': vm.rangeInitSE,
        'end': vm.rangeEndSE,
        'test': vm.dataTest.selected.id,
        'demographics': vm.demographics,
        'gender': vm.gender,
        'ageMin': vm.minimumage,
        'ageMax': vm.maximumage,
        'refMin': vm.minimalreference,
        'refMax': vm.maximumreference,
        'result': vm.result,
        'comment': vm.comment
      }
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return stadisticsDS.getspecialstadistics(auth.authToken, data).then(function (data) {
          if (data.status === 200) {
            vm.variables = {
              'entity': vm.nameCustomer,
              'abbreviation': vm.abbrCustomer,
              'rangeInit': moment(vm.rangeInitSE).format(vm.formatDate),
              'rangeEnd': moment(vm.rangeEndSE).format(vm.formatDate),
              'username': auth.userName,
              'test': vm.dataTest.selected.code + ' - ' + vm.dataTest.selected.name,
              'date': moment().format(vm.formatDate)
            }
            if (vm.typereport === '1') {
              vm.datareport = data.data.length === 0 ? [] : changedateresult(data);
              vm.pathreport = '/Report/stadistics/specialStatistics/specialStatistics.mrt';
            } else {
              var serie = vm.serie;
              var group = [];
              var min = vm.graphtype === 1 ? vm.minimumage : vm.minimalreference;
              var max = vm.graphtype === 1 ? vm.maximumage : vm.maximumreference;
              var iteration = Math.round(((max - min) / serie));

              for (var i = 0; i < serie; i++) {
                var item = {
                  min: i === 0 ? min : group[i - 1].max + 1,
                  max: i === 0 ? iteration - 1 : group[i - 1].max + iteration,
                  serie: (i === 0 ? min : group[i - 1].max + 1) + '-' + (i === 0 ? iteration - 1 : group[i - 1].max + iteration),
                  cantwomen: 0,
                  cantmen: 0
                }
                group.push(item)
              }

              data.data.forEach(function (value, key) {
                var yearpatient = moment().diff(value.patient.birthday, 'years');
                for (var i = 0; i < group.length; i++) {
                  if (yearpatient >= group[i].min && yearpatient <= group[i].max) {

                    if (value.patient.sex.id === 7) {
                      group[i].cantmen = group[i].cantmen + 1
                    } else if (value.patient.sex.id === 8) {
                      group[i].cantwomen = group[i].cantwomen + 1
                    }
                    break;
                  }
                }
              });

              vm.datareport = group;
              vm.pathreport = '/Report/stadistics/specialStatistics/specialStatisticsGraph.mrt';
            }

          }
          vm.reportSE = false;
          vm.openreport = false;
          vm.windowOpenReport();

        },
        function (error) {
          vm.reportSE = false;
          vm.modalError(error);
        });
    }

    function printReportmotivereject(type) {
      vm.report = true;
      vm.type = type;
      var motivereject = {
        'init': vm.rangeInit,
        'end': vm.rangeEnd,
        'demographics': [],
        'areas': [],
        'levels': [],
        'laboratories': [],
        'samples': []
      }

      for (var i = 0; i < vm.listgroup.length; i++) {
        if (vm.listgroup[i].filter1 === null || vm.listgroup[i].filter1 === undefined) {
          break;
        } else {
          switch (vm.listgroup[i].filter1) {
            case '2':
              if (vm.listgroup[i].filter2 === 1) {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  motivereject.areas.push(itemvalue.id)
                })
              } else if (vm.listgroup[i].filter2 === 2) {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  motivereject.levels.push(itemvalue.id)
                })
              } else if (vm.listgroup[i].filter2 === 3) {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  motivereject.laboratories.push(itemvalue.id)
                })
              } else if (vm.listgroup[i].filter2 === 5) {

                var demo = $filter('filter')(vm.listgroup[i].listfilter, function (e) {
                  return e.id === vm.listgroup[i].filter2
                });

                var item = {
                  'demographic': -11,
                  'demographicItems': [],
                }

                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  item.demographicItems.push(itemvalue.id)
                })

                if(demo.length > 0) {
                  item.origin = demo[0].origin;
                  item.name = demo[0].name;
                  item.encoded = demo[0].encoded;
                }

                motivereject.demographics.push(item)
              } else {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  motivereject.samples.push(itemvalue.id)
                })
              }
              break;
            case '1':
              if (vm.listgroup[i].filter2 !== null) {

                var demo = $filter('filter')(vm.listgroup[i].listfilter, function (e) {
                  return e.id === vm.listgroup[i].filter2
                });

                var item = {
                  'demographic': vm.listgroup[i].filter2,
                  'demographicItems': [],
                }

                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  item.demographicItems.push(itemvalue.id)
                })

                if(demo.length > 0) {
                  item.origin = demo[0].origin;
                  item.name = demo[0].name;
                  item.encoded = demo[0].encoded;
                }

                motivereject.demographics.push(item);
              }
              break;
          }
        }
      }
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return stadisticsDS.getmotiverejectStadistics(auth.authToken, motivereject).then(function (data) {
          vm.report = false;
          var data = data.data;
          var datareport = [];
          for (var i = 0; i < data.length; i++) {
            var group5id = null;
            var group5name = '';
            var group4id = null;
            var group4name = '';
            var group3id = null;
            var group3name = '';

            var orderNumber = data[i].orderNumber;


            // agrupamiento 3
            if (vm.listgroup[2].filter2 === -1) {
              group3id = data[i].account === 0 ? null : data[i].account;
              group3name = data[i].accountName;
            }
            if (vm.listgroup[2].filter2 === -2) {
              group3id = data[i].physician === 0 ? null : data[i].physician;
              group3name = data[i].physicianName;
            }
            if (vm.listgroup[2].filter2 === -3) {
              group3id = data[i].rate === 0 ? null : data[i].rate;
              group3name = data[i].rateName;
            }
            if (vm.listgroup[2].filter2 === -5) {
              group3id = data[i].branch === 0 ? null : data[i].branch;
              group3name = data[i].branchName;
            }
            if (vm.listgroup[2].filter2 === -6) {
              group3id = data[i].service === 0 ? null : data[i].service;
              group3name = data[i].serviceName;
            }
            if (vm.listgroup[2].filter2 === -7) {
              group3id = data[i].patient.race === 0 ? null : data[i].patient.race;
              group3name = data[i].patient.raceName;
            }
            if (vm.listgroup[2].filter2 === -10) {
              group3id = data[i].patient.documentType === 0 ? null : data[i].patient.documentType;
              group3name = data[i].patient.documentTypeName;
            }
            if (vm.listgroup[2].field === 'SampleId') {
              group3id = null;
              group3name = '';
            }
            if (vm.listgroup[2].field === 'codifiedId') {
              vm.demoDemographics = $filter('filter')(data[i].allDemographics, {
                idDemographic: parseInt(vm.listgroup[2].filter2)
              }, true);
              group3id = vm.demoDemographics[0].codifiedName === null ? null : vm.demoDemographics[0].idDemographic;
              group3name = vm.demoDemographics[0].codifiedName;
            }
            // agrupamiento 2
            if (vm.listgroup[1].filter2 === -1) {
              group4id = data[i].account === 0 ? null : data[i].account;
              group4name = data[i].accountName;
            }
            if (vm.listgroup[1].filter2 === -2) {
              group4id = data[i].physician === 0 ? null : data[i].physician;
              group4name = data[i].physicianName;
            }
            if (vm.listgroup[1].filter2 === -3) {
              group4id = data[i].rate === 0 ? null : data[i].rate;
              group4name = data[i].rateName;
            }
            if (vm.listgroup[1].filter2 === -5) {
              group4id = data[i].branch === 0 ? null : data[i].branch;
              group4name = data[i].branchName;
            }
            if (vm.listgroup[1].filter2 === -6) {
              group4id = data[i].service === 0 ? null : data[i].service;
              group4name = data[i].serviceName;
            }
            if (vm.listgroup[1].filter2 === -7) {
              group4id = data[i].patient.race === 0 ? null : data[i].patient.race;
              group4name = data[i].patient.raceName;
            }
            if (vm.listgroup[1].filter2 === -10) {
              group4id = data[i].patient.documentType === 0 ? null : data[i].patient.documentType;
              group4name = data[i].patient.documentTypeName;
            }
            if (vm.listgroup[1].field === 'SampleId') {
              group4id = null;
              group4name = '';
            }
            if (vm.listgroup[1].field === 'codifiedId') {
              vm.demoDemographics = $filter('filter')(data[i].allDemographics, {
                idDemographic: parseInt(vm.listgroup[1].filter2)
              }, true);
              group4id = vm.demoDemographics[0].codifiedName === null ? null : vm.demoDemographics[0].idDemographic;
              group4name = vm.demoDemographics[0].codifiedName;
            }

            // agrupamiento 3
            if (vm.listgroup[0].filter2 === -1) {
              group5id = data[i].account === 0 ? null : data[i].account;
              group5name = data[i].accountName;
            }
            if (vm.listgroup[0].filter2 === -2) {
              group5id = data[i].physician === 0 ? null : data[i].physician;
              group5name = data[i].physicianName;
            }
            if (vm.listgroup[0].filter2 === -3) {
              group5id = data[i].rate === 0 ? null : data[i].rate;
              group5name = data[i].rateName;
            }
            if (vm.listgroup[0].filter2 === -5) {
              group5id = data[i].branch === 0 ? null : data[i].branch;
              group5name = data[i].branchName;
            }
            if (vm.listgroup[0].filter2 === -6) {
              group5id = data[i].service === 0 ? null : data[i].service;
              group5name = data[i].serviceName;
            }
            if (vm.listgroup[0].filter2 === -7) {
              group5id = data[i].patient.race === 0 ? null : data[i].patient.race;
              group5name = data[i].patient.raceName;
            }
            if (vm.listgroup[0].filter2 === -10) {
              group5id = data[i].patient.documentType === 0 ? null : data[i].patient.documentType;
              group5name = data[i].patient.documentTypeName;
            }
            if (vm.listgroup[0].field === 'SampleId') {
              group5id = null;
              group5name = '';
            }
            if (vm.listgroup[0].field === 'codifiedId') {
              vm.demoDemographics = $filter('filter')(data[i].allDemographics, {
                idDemographic: parseInt(vm.listgroup[0].filter2)
              }, true);
              group5id = vm.demoDemographics[0].codifiedName === null ? null : vm.demoDemographics[0].idDemographic;
              group5name = vm.demoDemographics[0].codifiedName;
            }
            for (var j = 0; j < data[i].results.length; j++) {
              var item = {
                'orderNumber': orderNumber,
                'group5id': group5id,
                'group5name': group5name,
                'group4id': group4id,
                'group4name': group4name,
                'group3id': group3id,
                'group3name': group3name,
                'group2id': data[i].results[j].idMotive,
                'group2name': data[i].results[j].nameMotive,
                'group1id': data[i].results[j].sample,
                'group1name': data[i].results[j].sampleName
              }

              datareport.push(item);
            }

          }
          vm.datareport = datareport;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var namegroups = [];
          for (var i = 0; i < vm.listgroup.length; i++) {
            if (vm.listgroup[i].filter1 !== null && vm.listgroup[i].filter2 !== null && vm.listgroup[i].filter3 !== null) {
              namegroups.push(' ' + vm.listgroup[i].filter1name)
            }
          }
          vm.variables = {
            'entity': vm.nameCustomer,
            'abbreviation': vm.abbrCustomer,
            'rangeInit': moment(vm.rangeInit).format(vm.formatDate),
            'rangeEnd': moment(vm.rangeEnd).format(vm.formatDate),
            'typeFilter': namegroups.toString(),
            'username': auth.userName,
            'date': moment().format(vm.formatDate)
          }
          vm.pathreport = '/Report/stadistics/Stadisticsmotivereject/Stadisticsmotivereject.mrt';
          vm.openreport = false;
          vm.report = false;
          vm.windowOpenReport();
        },
        function (error) {
          vm.report = false;
          vm.modalError(error);
        });
    }

    function printReporepeated(type) {
      vm.report2 = true;
      vm.type = type;
      var motiverepeate = {
        'rangeType': 0,
        'init': vm.rangeInitR,
        'end': vm.rangeEndR,
        'testState': 1,
        'demographics': [],
        'areas': [],
        'levels': [],
        'laboratories': [],
        'tests': []
      }

      for (var i = 0; i < vm.listgroupr.length; i++) {
        if (vm.listgroupr[i].filter1 === null || vm.listgroupr[i].filter1 === undefined) {
          break;
        } else {
          switch (vm.listgroupr[i].filter1) {
            case '2':
              if (vm.listgroupr[i].filter2 === 1) {
                vm.listgroupr[i].listvalues.forEach(function (itemvalue, key) {
                  motiverepeate.areas.push(itemvalue.id)
                })
              } else if (vm.listgroupr[i].filter2 === 2) {
                vm.listgroupr[i].listvalues.forEach(function (itemvalue, key) {
                  motiverepeate.levels.push(itemvalue.id)
                })
              } else if (vm.listgroupr[i].filter2 === 3) {
                vm.listgroupr[i].listvalues.forEach(function (itemvalue, key) {
                  motiverepeate.laboratories.push(itemvalue.id)
                })
              } else {
                vm.listgroupr[i].listvalues.forEach(function (itemvalue, key) {
                  motiverepeate.tests.push(itemvalue.id)
                })
              }
              break;
            case '1':

              var demo = $filter('filter')(vm.listgroupr[i].listfilter, function (e) {
                return e.id === vm.listgroupr[i].filter2
              });

              var item = {
                'demographic': vm.listgroupr[i].filter2,
                'demographicItems': [],
              }

              if(demo.length > 0) {
                item.origin = demo[0].origin;
                item.name = demo[0].name;
                item.encoded = demo[0].encoded;
              }

              vm.listgroupr[i].listvalues.forEach(function (itemvalue, key) {
                item.demographicItems.push(itemvalue.id)
              })
              motiverepeate.demographics.push(item)
              break;
          }
        }
      }
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return stadisticsDS.getmotiverepeatedStadistics(auth.authToken, motiverepeate).then(function (data) {


          vm.report2 = false;
          var data = data.data;
          //var data = [];
          var datareport = [];
          for (var i = 0; i < data.length; i++) {
            var group5id = null;
            var group5name = '';
            var group4id = null;
            var group4name = '';
            var group3id = null;
            var group3name = '';

            var orderNumber = data[i].orderNumber;


            // agrupamiento 3
            if (vm.listgroupr[2].filter2 === -1) {
              group3id = data[i].account === 0 ? null : data[i].account;
              group3name = data[i].accountName;
            }
            if (vm.listgroupr[2].filter2 === -2) {
              group3id = data[i].physician === 0 ? null : data[i].physician;
              group3name = data[i].physicianName;
            }
            if (vm.listgroupr[2].filter2 === -3) {
              group3id = data[i].rate === 0 ? null : data[i].rate;
              group3name = data[i].rateName;
            }
            if (vm.listgroupr[2].filter2 === -5) {
              group3id = data[i].branch === 0 ? null : data[i].branch;
              group3name = data[i].branchName;
            }
            if (vm.listgroupr[2].filter2 === -6) {
              group3id = data[i].service === 0 ? null : data[i].service;
              group3name = data[i].serviceName;
            }
            if (vm.listgroupr[2].filter2 === -7) {
              group3id = data[i].patient.race === 0 ? null : data[i].patient.race;
              group3name = data[i].patient.raceName;
            }
            if (vm.listgroupr[2].filter2 === -10) {
              group3id = data[i].patient.documentType === 0 ? null : data[i].patient.documentType;
              group3name = data[i].patient.documentTypeName;
            }
            if (vm.listgroupr[2].field === 'id') {
              group3id = null;
              group3name = '';
            }
            if (vm.listgroupr[2].field === 'codifiedId') {
              vm.demoDemographics = $filter('filter')(data[i].allDemographics, {
                idDemographic: parseInt(vm.listgroupr[2].filter2)
              }, true);
              group3id = vm.demoDemographics[0].codifiedName === null ? null : vm.demoDemographics[0].idDemographic;
              group3name = vm.demoDemographics[0].codifiedName;
            }
            // agrupamiento 2
            if (vm.listgroupr[1].filter2 === -1) {
              group4id = data[i].account === 0 ? null : data[i].account;
              group4name = data[i].accountName;
            }
            if (vm.listgroupr[1].filter2 === -2) {
              group4id = data[i].physician === 0 ? null : data[i].physician;
              group4name = data[i].physicianName;
            }
            if (vm.listgroupr[1].filter2 === -3) {
              group4id = data[i].rate === 0 ? null : data[i].rate;
              group4name = data[i].rateName;
            }
            if (vm.listgroupr[1].filter2 === -5) {
              group4id = data[i].branch === 0 ? null : data[i].branch;
              group4name = data[i].branchName;
            }
            if (vm.listgroupr[1].filter2 === -6) {
              group4id = data[i].service === 0 ? null : data[i].service;
              group4name = data[i].serviceName;
            }
            if (vm.listgroupr[1].filter2 === -7) {
              group4id = data[i].patient.race === 0 ? null : data[i].patient.race;
              group4name = data[i].patient.raceName;
            }
            if (vm.listgroupr[1].filter2 === -10) {
              group4id = data[i].patient.documentType === 0 ? null : data[i].patient.documentType;
              group4name = data[i].patient.documentTypeName;
            }
            if (vm.listgroupr[1].field === 'id') {
              group4id = null;
              group4name = '';
            }
            if (vm.listgroupr[1].field === 'codifiedId') {
              vm.demoDemographics = $filter('filter')(data[i].allDemographics, {
                idDemographic: parseInt(vm.listgroupr[1].filter2)
              }, true);
              group4id = vm.demoDemographics[0].codifiedName === null ? null : vm.demoDemographics[0].idDemographic;
              group4name = vm.demoDemographics[0].codifiedName;
            }

            // agrupamiento 3
            if (vm.listgroupr[0].filter2 === -1) {
              group5id = data[i].account === 0 ? null : data[i].account;
              group5name = data[i].accountName;
            }
            if (vm.listgroupr[0].filter2 === -2) {
              group5id = data[i].physician === 0 ? null : data[i].physician;
              group5name = data[i].physicianName;
            }
            if (vm.listgroupr[0].filter2 === -3) {
              group5id = data[i].rate === 0 ? null : data[i].rate;
              group5name = data[i].rateName;
            }
            if (vm.listgroupr[0].filter2 === -5) {
              group5id = data[i].branch === 0 ? null : data[i].branch;
              group5name = data[i].branchName;
            }
            if (vm.listgroupr[0].filter2 === -6) {
              group5id = data[i].service === 0 ? null : data[i].service;
              group5name = data[i].serviceName;
            }
            if (vm.listgroupr[0].filter2 === -7) {
              group5id = data[i].patient.race === 0 ? null : data[i].patient.race;
              group5name = data[i].patient.raceName;
            }
            if (vm.listgroupr[0].filter2 === -10) {
              group5id = data[i].patient.documentType === 0 ? null : data[i].patient.documentType;
              group5name = data[i].patient.documentTypeName;
            }
            if (vm.listgroupr[0].field === 'id') {
              group5id = null;
              group5name = '';
            }
            if (vm.listgroupr[0].field === 'codifiedId') {
              vm.demoDemographics = $filter('filter')(data[i].allDemographics, {
                idDemographic: parseInt(vm.listgroupr[0].filter2)
              }, true);
              group5id = vm.demoDemographics[0].codifiedName === null ? null : vm.demoDemographics[0].idDemographic;
              group5name = vm.demoDemographics[0].codifiedName;
            }

            for (var j = 0; j < data[i].results.length; j++) {

              if (vm.listgroupr[2].field === 'sectionId') {
                group3id = data[i].results[j].sectionId === 0 ? null : data[i].results[j].sectionId;
                group3name = data[i].results[j].sectionName;
              }

              if (vm.listgroupr[2].field === 'levelComplex') {
                group3id = data[i].results[j].levelComplex === 0 ? null : data[i].results[j].levelComplex;
                if (data[i].results[j].levelComplex !== 0) {
                  var levels = 0;
                  if (data[i].results[j].levelComplex === 33) {
                    levels = 1
                  }
                  if (data[i].results[j].levelComplex === 34) {
                    levels = 2
                  }
                  if (data[i].results[j].levelComplex === 35) {
                    levels = 3
                  }
                  if (data[i].results[j].levelComplex === 36) {
                    levels = 4
                  }
                  if (data[i].results[j].levelComplex === 37) {
                    levels = 5
                  }
                }
                group3name = $filter('translate')('0442') + ' ' + levels;
              }

              if (vm.listgroupr[2].field === 'laboratoryId') {
                group3id = data[i].results[j].laboratoryId === 0 ? null : data[i].results[j].laboratoryId;
                group3name = data[i].results[j].laboratoryName;
              }


              if (vm.listgroupr[1].field === 'sectionId') {
                group4id = data[i].results[j].sectionId === 0 ? null : data[i].results[j].sectionId;
                group4name = data[i].results[j].sectionName;
              }

              if (vm.listgroupr[1].field === 'levelComplex') {
                group4id = data[i].results[j].levelComplex === 0 ? null : data[i].results[j].levelComplex;
                if (data[i].results[j].levelComplex !== 0) {
                  var levels = 0;
                  if (data[i].results[j].levelComplex === 33) {
                    levels = 1
                  }
                  if (data[i].results[j].levelComplex === 34) {
                    levels = 2
                  }
                  if (data[i].results[j].levelComplex === 35) {
                    levels = 3
                  }
                  if (data[i].results[j].levelComplex === 36) {
                    levels = 4
                  }
                  if (data[i].results[j].levelComplex === 37) {
                    levels = 5
                  }
                }
                group4name = $filter('translate')('0442') + ' ' + levels;
              }

              if (vm.listgroupr[1].field === 'laboratoryId') {
                group4id = data[i].results[j].laboratoryId === 0 ? null : data[i].results[j].laboratoryId;
                group4name = data[i].results[j].laboratoryName;
              }

              if (vm.listgroupr[0].field === 'sectionId') {
                group5id = data[i].results[j].sectionId === 0 ? null : data[i].results[j].sectionId;
                group5name = data[i].results[j].sectionName;
              }

              if (vm.listgroupr[0].field === 'levelComplex') {
                group5id = data[i].results[j].levelComplex === 0 ? null : data[i].results[j].levelComplex;
                if (data[i].results[j].levelComplex !== 0) {
                  var levels = 0;
                  if (data[i].results[j].levelComplex === 33) {
                    levels = 1
                  }
                  if (data[i].results[j].levelComplex === 34) {
                    levels = 2
                  }
                  if (data[i].results[j].levelComplex === 35) {
                    levels = 3
                  }
                  if (data[i].results[j].levelComplex === 36) {
                    levels = 4
                  }
                  if (data[i].results[j].levelComplex === 37) {
                    levels = 5
                  }
                }
                group5name = $filter('translate')('0442') + ' ' + levels;
              }

              if (vm.listgroupr[0].field === 'laboratoryId') {
                group5id = data[i].results[j].laboratoryId === 0 ? null : data[i].results[j].laboratoryId;
                group5name = data[i].results[j].laboratoryName;
              }



              for (var k = 0; k < data[i].results[j].repeatReasons.length; k++) {
                var item = {
                  'orderNumber': orderNumber,
                  'group5id': group5id,
                  'group5name': group5name,
                  'group4id': group4id,
                  'group4name': group4name,
                  'group3id': group3id,
                  'group3name': group3name,
                  'group2id': data[i].results[j].repeatReasons[k].id,
                  'group2name': data[i].results[j].repeatReasons[k].name,
                  'group1id': data[i].results[j].id,
                  'group1code': data[i].results[j].code,
                  'group1name': data[i].results[j].name
                }

                datareport.push(item);

              }

            }

          }
          vm.datareport = datareport;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var namegroups = [];

          for (var i = 0; i < vm.listgroupr.length; i++) {
            if (vm.listgroupr[i].filter1 !== null && vm.listgroupr[i].filter2 !== null &&
              vm.listgroupr[i].listvalues.length > 0) {
              namegroups.push(' ' + vm.listgroupr[i].filter1name)
            }
          }

          vm.variables = {
            'entity': vm.nameCustomer,
            'abbreviation': vm.abbrCustomer,
            'rangeInit': moment(vm.rangeInitR).format(vm.formatDate),
            'rangeEnd': moment(vm.rangeEndR).format(vm.formatDate),
            'typeFilter': namegroups.toString(),
            'username': auth.userName,
            'date': moment().format(vm.formatDate)
          }
          vm.pathreport = '/Report/stadistics/Stadisticsmotiverepeated/Stadisticsmotiverepeated.mrt';
          vm.openreport = false;
          vm.report2 = false;
          vm.windowOpenReport();
        },
        function (error) {
          vm.report2 = false;
          vm.modalError(error);
        });
    }

    function printReportmicro(type) {
      vm.report3 = true;
      vm.type = type;
      var microbiology = {
        'rangeType': 0,
        'init': vm.rangeInit4,
        'end': vm.rangeEnd4,
        'demographics': [],
        'tests': [],
        'samples': [],
        'antibiotics': [],
        'microorganisms': []
      }

      for (var i = 0; i < vm.listgroupm.length; i++) {
        if (vm.listgroupm[i].filter1 === null || vm.listgroupm[i].filter1 === undefined) {
          break;
        } else {
          switch (vm.listgroupm[i].filter1) {
            case '2':
              if (vm.listgroupm[i].filter2 === 6) {
                vm.listgroupm[i].listvalues.forEach(function (itemvalue, key) {
                  microbiology.samples.push(itemvalue.id)
                })
              } else if (vm.listgroupm[i].filter2 === 7) {
                vm.listgroupm[i].listvalues.forEach(function (itemvalue, key) {
                  microbiology.tests.push(itemvalue.id)
                })
              } else if (vm.listgroupm[i].filter2 === 8) {
                vm.listgroupm[i].listvalues.forEach(function (itemvalue, key) {
                  microbiology.antibiotics.push(itemvalue.id)
                })
              } else if (vm.listgroupm[i].filter2 === 9) {
                vm.listgroupm[i].listvalues.forEach(function (itemvalue, key) {
                  microbiology.microorganisms.push(itemvalue.id)
                })
              }
              break;
            case '1':

              var demo = $filter('filter')(vm.listgroupm[i].listfilter, function (e) {
                return e.id === vm.listgroupm[i].filter2
              });

              var item = {
                'demographic': vm.listgroupm[i].filter2,
                'demographicItems': [],
              }

              vm.listgroupm[i].listvalues.forEach(function (itemvalue, key) {
                item.demographicItems.push(itemvalue.id)
              })

              if(demo.length > 0) {
                item.origin = demo[0].origin;
                item.name = demo[0].name;
                item.encoded = demo[0].encoded;
              }

              microbiology.demographics.push(item)
              break;
          }
        }
      }
      vm.datareport = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return stadisticsDS.getstatisticsmicrobiology(auth.authToken, microbiology).then(function (data) {
          if (data.status === 200) {
            vm.report3 = false;
            vm.datareport = changedataStasmi(data.data);
            var namegroups = [];
            for (var i = 0; i < vm.listgroupm.length; i++) {
              if (vm.listgroupm[i].filter1 !== null && vm.listgroupm[i].filter2 !== null && vm.listgroupm[i].listvalues.length > 0) {
                namegroups.push(' ' + vm.listgroupm[i].filter1name)
              }
            }
            vm.variables = {
              'entity': vm.nameCustomer,
              'abbreviation': vm.abbrCustomer,
              'rangeInit': moment(vm.rangeInit4).format(vm.formatDate),
              'rangeEnd': moment(vm.rangeEnd4).format(vm.formatDate),
              'typeFilter': namegroups.toString(),
              'username': auth.userName,
              'date': moment().format(vm.formatDate)
            }
            vm.pathreport = '/Report/stadistics/Stadisticsmicroobiology/Stadisticsmicroobiology.mrt';
            vm.openreport = false;
            vm.windowOpenReport();
          } else {
            vm.report3 = false;
            vm.windowOpenReport();
          }
        },
        function (error) {
          vm.report3 = false;
          vm.modalError(error);
        });
    }

    function changedataStasmi(data) {
      var datareport = [];
      for (var i = 0; i < data.length; i++) {
        var group5id = null;
        var group5name = '';
        var group4id = null;
        var group4name = '';
        var group3id = null;
        var group3name = '';

        var orderNumber = data[i].orderNumber;

        // agrupamiento 3
        if (vm.listgroupm[2].filter2 === -1) {
          group3id = data[i].account === 0 ? null : data[i].account;
          group3name = data[i].accountName;
        }
        if (vm.listgroupm[2].filter2 === -2) {
          group3id = data[i].physician === 0 ? null : data[i].physician;
          group3name = data[i].physicianName;
        }
        if (vm.listgroupm[2].filter2 === -3) {
          group3id = data[i].rate === 0 ? null : data[i].rate;
          group3name = data[i].rateName;
        }
        if (vm.listgroupm[2].filter2 === -5) {
          group3id = data[i].branch === 0 ? null : data[i].branch;
          group3name = data[i].branchName;
        }
        if (vm.listgroupm[2].filter2 === -6) {
          group3id = data[i].service === 0 ? null : data[i].service;
          group3name = data[i].serviceName;
        }
        if (vm.listgroupm[2].filter2 === -7) {
          group3id = data[i].patient.race === 0 ? null : data[i].patient.race;
          group3name = data[i].patient.raceName;
        }
        if (vm.listgroupm[2].filter2 === -10) {
          group3id = data[i].patient.documentType === 0 ? null : data[i].patient.documentType;
          group3name = data[i].patient.documentTypeName;
        }
        if (vm.listgroupm[2].field === 'codifiedId') {
          vm.demoDemographics = $filter('filter')(data[i].allDemographics, {
            idDemographic: parseInt(vm.listgroupm[2].filter2)
          }, true);
          group3id = vm.demoDemographics[0].codifiedName === null ? null : vm.demoDemographics[0].idDemographic;
          group3name = vm.demoDemographics[0].codifiedName;
        }
        if (vm.listgroupm[2].field === 'AntibioticId') {
          group3id = null;
          group3name = '';
        }
        if (vm.listgroupm[2].field === 'MicroorganismId') {
          group3id = null;
          group3name = '';
        }
        // agrupamiento 2
        if (vm.listgroupm[1].filter2 === -1) {
          group4id = data[i].account === 0 ? null : data[i].account;
          group4name = data[i].accountName;
        }
        if (vm.listgroupm[1].filter2 === -2) {
          group4id = data[i].physician === 0 ? null : data[i].physician;
          group4name = data[i].physicianName;
        }
        if (vm.listgroupm[1].filter2 === -3) {
          group4id = data[i].rate === 0 ? null : data[i].rate;
          group4name = data[i].rateName;
        }
        if (vm.listgroupm[1].filter2 === -5) {
          group4id = data[i].branch === 0 ? null : data[i].branch;
          group4name = data[i].branchName;
        }
        if (vm.listgroupm[1].filter2 === -6) {
          group4id = data[i].service === 0 ? null : data[i].service;
          group4name = data[i].serviceName;
        }
        if (vm.listgroupm[1].filter2 === -7) {
          group4id = data[i].patient.race === 0 ? null : data[i].patient.race;
          group4name = data[i].patient.raceName;
        }
        if (vm.listgroupm[1].filter2 === -10) {
          group4id = data[i].patient.documentType === 0 ? null : data[i].patient.documentType;
          group4name = data[i].patient.documentTypeName;
        }
        if (vm.listgroupm[1].field === 'codifiedId') {
          vm.demoDemographics = $filter('filter')(data[i].allDemographics, {
            idDemographic: parseInt(vm.listgroupm[1].filter2)
          }, true);
          group4id = vm.demoDemographics[0].codifiedName === null ? null : vm.demoDemographics[0].idDemographic;
          group4name = vm.demoDemographics[0].codifiedName;
        }
        if (vm.listgroupm[1].field === 'AntibioticId') {
          group4id = null;
          group4name = '';
        }
        if (vm.listgroupm[1].field === 'MicroorganismId') {
          group4id = null;
          group4name = '';
        }
        // agrupamiento 3
        if (vm.listgroupm[0].filter2 === -1) {
          group5id = data[i].account === 0 ? null : data[i].account;
          group5name = data[i].accountName;
        }
        if (vm.listgroupm[0].filter2 === -2) {
          group5id = data[i].physician === 0 ? null : data[i].physician;
          group5name = data[i].physicianName;
        }
        if (vm.listgroupm[0].filter2 === -3) {
          group5id = data[i].rate === 0 ? null : data[i].rate;
          group5name = data[i].rateName;
        }
        if (vm.listgroupm[0].filter2 === -5) {
          group5id = data[i].branch === 0 ? null : data[i].branch;
          group5name = data[i].branchName;
        }
        if (vm.listgroupm[0].filter2 === -6) {
          group5id = data[i].service === 0 ? null : data[i].service;
          group5name = data[i].serviceName;
        }
        if (vm.listgroupm[0].filter2 === -7) {
          group5id = data[i].patient.race === 0 ? null : data[i].patient.race;
          group5name = data[i].patient.raceName;
        }
        if (vm.listgroupm[0].filter2 === -10) {
          group5id = data[i].patient.documentType === 0 ? null : data[i].patient.documentType;
          group5name = data[i].patient.documentTypeName;
        }
        if (vm.listgroupm[0].field === 'codifiedId') {
          vm.demoDemographics = $filter('filter')(data[i].allDemographics, {
            idDemographic: parseInt(vm.listgroupm[0].filter2)
          }, true);
          group5id = vm.demoDemographics[0].codifiedName === null ? null : vm.demoDemographics[0].idDemographic;
          group5name = vm.demoDemographics[0].codifiedName;
        }
        if (vm.listgroupm[0].field === 'AntibioticId') {
          group5id = null;
          group5name = '';
        }
        if (vm.listgroupm[0].field === 'MicroorganismId') {
          group5id = null;
          group5name = '';
        }
        for (var j = 0; j < data[i].results.length; j++) {

          if (vm.listgroupm[2].field === 'SampleId') {
            group3id = data[i].results[j].sample;
            group3name = data[i].results[j].sampleName;
          }


          if (vm.listgroupm[2].field === 'id') {
            group3id = data[i].results[j].id;
            group3name = data[i].results[j].code + '-' + data[i].results[j].name;
          }


          if (vm.listgroupm[1].field === 'SampleId') {
            group4id = data[i].results[j].sample;
            group4name = data[i].results[j].sampleName;
          }


          if (vm.listgroupm[1].field === 'id') {
            group4id = data[i].results[j].id;
            group4name = data[i].results[j].code + '-' + data[i].results[j].name;
          }


          if (vm.listgroupm[0].field === 'SampleId') {
            group5id = data[i].results[j].sample;
            group5name = data[i].results[j].sampleName;
          }


          if (vm.listgroupm[0].field === 'id') {
            group5id = data[i].results[j].id;
            group5name = data[i].results[j].code + '-' + data[i].results[j].name;
          }



          for (var k = 0; k < data[i].results[j].microorganisms.length; k++) {

            for (var l = 0; l < data[i].results[j].microorganisms[k].resultsMicrobiology.length; l++) {

              vm.sensitive = '1|' + $filter('translate')('0562');
              vm.medium = '2|' + $filter('translate')('0563');
              vm.resistant = '3|' + $filter('translate')('0564');

              var dataCMI = data[i].results[j].microorganisms[k].resultsMicrobiology[l].interpretationCMI;

              var sensitive = dataCMI === vm.sensitive ? 1 : 0;
              var medium = dataCMI === vm.medium ? 1 : 0;
              var resistant = dataCMI === vm.resistant ? 1 : 0;


              var item = {
                'orderNumber': orderNumber,
                'group5id': group5id,
                'group5name': group5name,
                'group4id': group4id,
                'group4name': group4name,
                'group3id': group3id,
                'group3name': group3name,
                'group2id': vm.type === '1' ? data[i].results[j].microorganisms[k].id : null,
                'group2name': vm.type === '1' ? data[i].results[j].microorganisms[k].name : null,
                'group1id': data[i].results[j].microorganisms[k].resultsMicrobiology[l].idAntibiotic,
                'group1name': data[i].results[j].microorganisms[k].resultsMicrobiology[l].nameAntibiotic,
                'group1sensitive': sensitive,
                'group1medium': medium,
                'group1resistant': resistant
              }

              datareport.push(item);

            }

          }
        }
      }
      return datareport;
    }

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    function isAuthenticate() {
      //var auth = null
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }

    function init() {
      vm.getGender();
      vm.listtypegraph = [{
          'name': $filter('translate')('0102'),
          'id': 1
        },
        {
          'name': $filter('translate')('0394'),
          'id': 2
        }
      ]
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
