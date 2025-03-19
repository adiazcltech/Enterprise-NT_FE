/* jshint ignore:start */
(function() {
    'use strict';

    angular
        .module('app.sampleentry')
        .controller('sampleentryController', sampleentryController);

    sampleentryController.$inject = ['common', 'localStorageService', 'logger', 'orderDS', 'organDS', 'specimenDS', 'containerPathologyDS', 'fixativeDS',
        'motiveDS', 'caseDS', 'protocolDS', 'caseteDS', 'reportadicional', 'reportPathologyDS' , '$filter', '$state', 'moment', '$scope', '$rootScope'
    ];

    function sampleentryController(common, localStorageService, logger, orderDS, organDS, specimenDS, containerPathologyDS, fixativeDS,
      motiveDS, caseDS, protocolDS, caseteDS, reportadicional, reportPathologyDS, $filter, $state, moment, $scope, $rootScope
    ) {

    //Variables generales
    var vm = this;
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('3104');
    $rootScope.helpReference = '08.Pathology/sampleentry.htm';
    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.orders = [];
    vm.casePat = null;
    vm.sample = null;
    vm.cases = [];
    vm.order = null;
    $scope.collapsed = false;
    vm.setFilter = setFilter;
    vm.modalError = modalError;
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.formatDateAge = localStorageService.get('FormatoFecha').toUpperCase();
    vm.autocomplenumberorder = autocomplenumberorder;
    vm.getOrgans = getOrgans;
    vm.getCasetes = getCasetes;
    vm.getContainers = getContainers;
    vm.getFixatives = getFixatives;
    vm.getMotives = getMotives;
    vm.getCases = getCases;
    vm.orderFormSamples = orderFormSamples;
    vm.undo = undo;
    vm.selectOrder = selectOrder;
    vm.save = save;
    vm.updateCase = updateCase;
    vm.getCaseData = getCaseData;
    vm.getSpecimensData = getSpecimensData;
    vm.getSamplesData = getSamplesData;
    vm.afterSaveCases = afterSaveCases;
    vm.stateButton = stateButton;
    vm.saveAttachment = saveAttachment;
    vm.studies = [];
    vm.specimens = [];
    vm.organs = [];
    vm.casetes = [];
    vm.containers = [];
    vm.fixatives = [];
    vm.motives = [];
    vm.motive = null;
    vm.case = null;
    vm.caseSearch = null;
    vm.edit = false;
    vm.opencaseattachment = false;
    vm.observation = '';
    vm.editor = {
        menubar: false,
        language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
        plugins: [
            'link',
            'lists',
            'autolink',
            'anchor',
            'textcolor',
            'charmap'
        ],
        toolbar: [
            'undo redo | bold italic underline superscript | fontselect fontsizeselect forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
        ],
        resize: false,
        height: 'calc(100vh - 450px)',
        readonly: false,
        mode: "design"
    };
    //Variables para la gestion de filtros
    vm.filter = {};
    vm.filterRange = '0';
    vm.rangeInit = moment().format('YYYYMMDD');
    vm.rangeEnd = moment().format('YYYYMMDD');
    vm.listAreasActive = [];
    vm.stateFilters = 3;
    vm.searchorder = '';
    vm.searchFilter = '';
    var orderdigit = localStorageService.get('DigitosOrden');
    vm.maxcantdigit = parseInt(orderdigit) + 8;
    vm.selectedDate = new Date();
    vm.showModalDailySearch = false;
    vm.caseSearchEvent = caseSearchEvent;
    vm.eventDailySearch = eventDailySearch;
    vm.eventFiles = eventFiles;
    vm.selectStudy = selectStudy;
    vm.formTemplate = [];
    vm.loadFormTemplate = loadFormTemplate;
    vm.cloneSection = cloneSection;
    vm.deleteSection = deleteSection;
    vm.getCaseForm = getCaseForm;
    vm.totalReceive = 0;
    vm.totalReject = 0;
    vm.closeModal = closeModal;
    vm.caseFiles = null;
    vm.rejecteSamples = rejecteSamples;
    vm.loadSchedule = loadSchedule;
    vm.workDays = localStorageService.get('DiasLaborales').split(",");
    vm.dates = {
      daysShort: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      daysMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      days: [
        $filter('translate')('1132'),
        $filter('translate')('1126'),
        $filter('translate')('1127'),
        $filter('translate')('1128'),
        $filter('translate')('1129'),
        $filter('translate')('1130'),
        $filter('translate')('1131')
      ],
      weekShort: 'S',
      weekStart: vm.workDays.length
    };
    vm.days = [];
    vm.openassignpathologist = false;
    vm.eventAssignPathologist = eventAssignPathologist;
    vm.assignPathologist = assignPathologist;
    vm.closeAssignPathologist = closeAssignPathologist;
    vm.initDate = null;
    vm.endDate = null;
    vm.confirmAssignment = confirmAssignment;
    vm.assignPathologistCase = assignPathologistCase;
    vm.loadCasetes = loadCasetes;
    vm.setConsecutives = setConsecutives;
    vm.consecutives = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',' W', 'X', 'Y', 'Z'];
    vm.loadConsecutive = loadConsecutive;
    vm.specimen = null;
    vm.protocol = null;
    vm.setCasete = setCasete;
    vm.saveCasetes = saveCasetes;
    vm.resetCasetes = resetCasetes;
    vm.eventBarcodes = eventBarcodes;
    vm.printlabels = printlabels;
    vm.quantityBarcode = null;
    vm.getProcessPrint = getProcessPrint;
    vm.prepotition = $filter("translate")("0000") === "esCo" ? "de" : "of";
    vm.directImpression = directImpression;
    vm.minQuantity = 1;
    vm.maxQuantity = 1;
    vm.validateQuantity = validateQuantity;
    vm.invalidQuantity = false;
    vm.changeStatus = changeStatus;
    vm.pathologist = null;
    vm.selectOrgan = selectOrgan;
    vm.modalfilter = modalfilter;

    function modalfilter() {
      vm.showModalFilter = true;
      setTimeout(function () {
        UIkit.modal("#modalfilter-date", {
          keyboard: false,
          bgclose: false,
          center: true,
        }).show();
      }, 30);
    }

    function selectOrgan(specimen) {
      if(specimen.organ.sample) {
        specimen.subSample = _.find(specimen.subSamples, function(o) { return o.subSample === specimen.organ.sample});
      } else {
        specimen.subSample = null;
      }
    }

    function changeStatus() {
      if(vm.casePat) {
        vm.loadingdata = true;
        caseDS.getCaseById(auth.authToken, vm.casePat.id, vm.casePat.order.numberOrder ).then(function(response) {
          UIkit.modal('#modalConfirmMacroscopy').hide();
          vm.caseFiles = response.data;
          if(vm.caseFiles.pathologist === undefined || vm.caseFiles.pathologist === null) {
            vm.loadingdata = false;
            logger.error($filter("translate")("3188"));
            return false;
          } else {
            var validateSpecimens = false;
            vm.caseFiles.specimens.forEach( function (value) {
              value.samples.forEach( function (sample) {
                if(sample.container.print === 1 && (sample.casetes === undefined || sample.casetes === null || sample.casetes.length === 0)) {
                  validateSpecimens = true;
                }
              });
            });
            if(validateSpecimens) {
              vm.loadingdata = false;
              logger.error($filter("translate")("3189"));
              return false;
            } else {
              vm.caseFiles.status = 2;
              return caseDS.changeStatus(auth.authToken, vm.caseFiles).then(function(data) {
                if(response.status === 200) {
                  vm.loadingdata = false;
                  logger.success($filter("translate")("3187"));
                  vm.undo();
                }
              },
              function(error) {
                vm.loadingdata = false;
                vm.modalError(error);
              });
            }
          }
        },
        function(error) {
          vm.loadingdata = false;
          vm.modalError(error);
        });
      }
    }

    function validateQuantity() {
      vm.invalidQuantity = false;
      if (vm.quantityBarcode > vm.maxQuantity || vm.quantityBarcode < vm.minQuantity) {
        vm.invalidQuantity = true;
      }
    }

    function directImpression() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var filter = {
        casePat: vm.caseFiles,
        count: vm.quantityBarcode,
        serial: $rootScope.serialprint
      }
      reportPathologyDS.printCaseBarcode(auth.authToken, filter).then(function(response) {
        if (response.status === 200) {
          if(response.data.length > 0) {
            var i = vm.ind;
            setTimeout(function () {
              for (vm.ind; vm.ind < vm.quantityBarcode; vm.ind++) {
                vm.porcent = Math.round((vm.ind * 100) / vm.quantityBarcode);
              }
              vm.totalBarcode++;
              vm.ind--;
              setTimeout(function () {
                logger.success($filter("translate")("3168"));
                UIkit.modal("#modalprogressprint", {
                  bgclose: false,
                  keyboard: false,
                }).hide();
              }, 1000);
            }, 30);
          }
        }
      }, function(error) {
        vm.loadingdata = false;
        if (error.data.code === 2) {
          UIkit.modal("#modalprogressprint").hide();
          vm.message = $filter("translate")("1074");
          setTimeout(function () {
            UIkit.modal("#logNoData", {
              modal: false,
              keyboard: false,
              bgclose: false,
              center: true,
            }).show();
          }, 1000);
        } else {
          vm.modalError(error);
          UIkit.modal("#modalprogressprint").hide();
          vm.message = $filter("translate")("1074");
          setTimeout(function () {
            UIkit.modal("#logNoData").show();
          }, 1000);
        }
      });
    }

    function getProcessPrint() {
      UIkit.modal("#modalprogressprint", {
        bgclose: false,
        escclose: false,
        modal: false,
      }).show();
      vm.directImpression();
    }

    function printlabels() {
      vm.loadingdata = true;
      vm.ind = 1;
      vm.porcent = 0;
      vm.totalBarcode = 0;
      vm.quantityBarcode = null;
      caseDS.getCaseById(auth.authToken, vm.casePat.id, vm.casePat.order.numberOrder ).then(function(response) {
        vm.caseFiles = response.data;
        var count = 0;
        vm.caseFiles.specimens.forEach( function(value) {
          value.samples.forEach( function(sample) {
            if(sample.container.print === 1) {
              count = count + sample.quantity;
            }
          });
        });
        vm.minQuantity = count;
        vm.maxQuantity = vm.minQuantity + 3;
        vm.caseFiles.quantity = count;
        vm.loadingdata = false;
        UIkit.modal("#modalquantitybarcode", { bgclose: false, escclose: false, modal: false}).show();
      },
      function(error) {
        vm.modalError(error);
      });
    }

    function eventBarcodes() {
      vm.loadingdata = true;
      if ($rootScope.serialprint === '') {
          vm.message = $filter('translate')('1067');
          UIkit.modal('#logNoData').show();
          vm.loadingdata = false;
      } else {
          return reportadicional.testServerPrint(vm.UrlNodeJs).then(function (data) {
              if (data.status === 200) {
                  vm.printlabels();
              }
          }, function (error) {
              vm.message = $filter('translate')('1085');
              UIkit.modal('#logNoData').show();
              vm.loadingdata = false;
          });
      }
    }

    function saveCasetes() {
      var casetes = [];
      vm.caseFiles.specimens.forEach( function(value) {
        value.samples.forEach( function(sample) {
          if(sample.consecutive) {
            sample.consecutive.forEach( function (consecutive) {
              casetes.push({
                id: consecutive.id,
                sample: consecutive.sample,
                quantity: consecutive.quantity,
                consecutive: consecutive.consecutive,
                casete: consecutive.casete
              });
            });
          }
        });
      });
      var validate = _.filter(casetes, function(o) { return o.casete === null || o.casete === undefined});
      if(validate.length > 0) {
        logger.warning($filter('translate')('3189'));
        return false;
      }
      if(casetes.length > 0) {
        caseDS.saveCasetes(auth.authToken, casetes).then(  function (response) {
          UIkit.modal('#modal_casetes').hide();
          vm.resetCasetes();
          logger.success($filter('translate')('3164'));
        });
      }
    }

    function resetCasetes() {
      vm.caseFiles = null;
      vm.protocol = null;
      vm.specimen = null;
      vm.stateButton('new');
    }

    function setCasete(selectSample, selectConsecutive) {
      selectSample.consecutive.forEach( function(value) {
        if(value.consecutive === selectConsecutive.consecutive && value.sample === selectSample.id) {
          value.show = true;
        } else {
          value.show = false;
        }
      });
    }

    function loadConsecutive(specimen) {
      if(specimen.print) {
        vm.loadingdata = true;
        vm.protocol = null;
        vm.specimen = null;
        if(specimen.organ.id > 0 && (specimen.protocol === null || specimen.protocol === undefined)) {
          //Se consulta por submuestra si tiene, de lo contrario se consulta por muestra
          var id = 0;
          if(specimen.subSample > 0) {
            id = specimen.subSampleId;
          } else {
            id = specimen.id;
          }
          protocolDS.getBySpecimen(auth.authToken, id, specimen.organ.id).then( function (response) {
            if(response.status === 200) {
              vm.protocol = response.data;
              specimen.protocol = vm.protocol;
            }
            var casetes = _.filter(_.filter(specimen.samples, function(o) { return o.container.print === 1}), function(o) { return o.casetes === null || o.casetes === undefined || o.casetes.length === 0});
            specimen.samples.forEach( function(value) {
              if(value.consecutive) {
                value.consecutive.forEach( function (consecutive) {
                  if(specimen.protocol && casetes.length > 0) {
                    consecutive.quantity = vm.protocol.quantity;
                    consecutive.casete = _.find(vm.casetes, function(o) { return o.id === vm.protocol.casete.id;});
                  } else {
                    var exist = _.find(value.casetes, function(o) { return o.consecutive === consecutive.consecutive});
                    if(exist) {
                      consecutive.id = exist.id;
                      consecutive.quantity = exist.quantity;
                      consecutive.casete = _.find(vm.casetes, function(o) { return o.id === exist.casete.id;});;
                    }
                  }
                });
              }
            });
            if(casetes.length > 0) {
              vm.stateButton('add');
            } else {
              vm.stateButton('new');
            }
            vm.specimen = specimen;
            vm.loadingdata = false;
          }, function(error) {
            vm.modalError(error);
          });
        } else {
            vm.protocol = specimen.protocol;
            var casetes = _.filter(_.filter(specimen.samples, function(o) { return o.container.print === 1}), function(o) { return o.casetes === null || o.casetes === undefined || o.casetes.length === 0});
            if(casetes.length === 0) {
            specimen.samples.forEach( function(value) {
              if(value.consecutive) {
                value.consecutive.forEach( function (consecutive) {
                  var exist = _.find(value.casetes, function(o) { return o.consecutive === consecutive.consecutive});
                  if(exist) {
                    consecutive.id = exist.id;
                    consecutive.quantity = exist.quantity;
                    consecutive.casete = _.find(vm.casetes, function(o) { return o.id === exist.casete.id;});;
                  }
                });
              }
            });
            vm.stateButton('new');
          } else {
            vm.stateButton('add');
          }
          vm.specimen = specimen;
          vm.loadingdata = false;
        }
      }
    }

    function setConsecutives() {
      var count = 0;
      vm.caseFiles.specimens.forEach( function(value) {
        var consecutives = [];
        var print = false;
        value.samples = _.orderBy(value.samples, ['id'], ['asc']);
        value.samples.forEach( function(sample) {
          if(sample.container.print === 1) {
            consecutives = [];
            print = true;
            for( var i = 0 ; i < sample.quantity ; i++) {
              consecutives.push({
                  id: '',
                  consecutive: vm.consecutives[count],
                  quantity: '',
                  sample: sample.id,
                  casete: null,
                  show: i === 0 ? true : false
              });
              count++;
            }
            sample.consecutive = consecutives;
          }
        });
        value.print = print;
      });
      UIkit.modal('#modal_casetes').show();
      vm.loadingdata = false;
    }

    function loadCasetes() {
      vm.resetCasetes();
      vm.loadingdata = true;
      caseDS.getCaseById(auth.authToken, vm.casePat.id, vm.casePat.order.numberOrder ).then(function(response) {
        vm.caseFiles = response.data;
        vm.caseFiles.initialsPatient = response.data.order.name1.charAt(0) + response.data.order.name2.charAt(0) + response.data.order.lastName.charAt(0) + response.data.order.surName.charAt(0);
        vm.setConsecutives();
      },
      function(error) {
        vm.modalError(error);
      });
    }

    function assignPathologistCase(casePat) {
      caseDS.assignPathologist(auth.authToken, casePat).then(function(response) {
        vm.case = response.data;
        vm.afterSaveCases();
        vm.loadingdata = false;
        logger.success($filter('translate')('3139'));
      },
      function(error) {
        vm.modalError(error);
      });
    }

    function confirmAssignment() {
      vm.casePat.pathologist = vm.pathologist;
      vm.casePat.schedule = vm.daySelected;
      var casePat = vm.getCaseData();
      if(casePat.id && casePat.numberCase) {
        UIkit.modal('#modalConfirmAssignment').hide();
        vm.assignPathologistCase(casePat);
      }
    }

    function closeAssignPathologist() {
      vm.loadingdata = false;
    }

    function eventAssignPathologist() {
      if(vm.casePat) {
        vm.loadingdata = true;
        caseDS.getCaseById(auth.authToken, vm.casePat.id, vm.casePat.order.numberOrder).then(function(response) {
          vm.caseFiles = response.data;
          vm.openassignpathologist = true;
        },
        function(error) {
          vm.modalError(error);
        });
      }
    }

    function assignPathologist(data) {
      vm.loadingdata = false;
      vm.pathologist = data.pathologist.pathologist;
      vm.daySelected = data.day;
      vm.date = data.date;
      UIkit.modal('#modalConfirmAssignment').show();
    }

    //** Método que inicializa la agenda**//
    function loadSchedule() {
      var currentDate = new Date();
      var i = 1;
      do {
        var exists = _.find(vm.workDays, function(o) { return o === String(currentDate.getDay()); });
        if(exists) {
          vm.days.push({
            day: vm.dates.days[currentDate.getDay()],
            date: moment(currentDate).format(vm.formatDateAge),
            dateS: new Date(currentDate)
          });
          i++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      while (i <= vm.dates.weekStart);
      vm.initDate = vm.days[0].dateS.toISOString().substr(0,10) + "T00:00:00";
      vm.endDate = vm.days[vm.days.length-1].dateS.toISOString().substr(0,10) + "T23:59:59"
    }

    function rejecteSamples() {
      UIkit.modal('#modalConfirmCancel').hide();
      vm.loadingdata = true;
      var rejected = {
        orderNumber: vm.order.numberOrder,
        studyType: vm.casePat.studyType,
        motive: vm.motive,
        observation: vm.observation,
        userCreated: auth
      };
      caseDS.samplesReject(auth.authToken, rejected).then(function(response) {
        vm.casePat.rejected = true;
        vm.casePat.active = false;
        vm.casePat = null;
        vm.motive = null;
        vm.observation = null;
        vm.totalReject++;
        vm.stateButton('init');
        logger.success($filter('translate')('3135'));
        vm.loadingdata = false;
      },
      function(error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }

    function saveAttachment() {
      logger.success($filter('translate')('3141'));
    }

    function eventFiles() {
      if(vm.casePat) {
        vm.loadingdata = true;
        caseDS.getCaseById(auth.authToken, vm.casePat.id, vm.casePat.order.numberOrder).then(function(response) {
          vm.caseFiles = response.data;
          vm.opencaseattachment = true;
          vm.loadingdata = false;
        },
        function(error) {
          vm.modalError(error);
        });
      }
    }

    function eventDailySearch() {
      vm.showModalDailySearch = true;
    }

    function caseSearchEvent(casePat) {
      vm.undo();
      if(casePat) {
        vm.caseSearch = casePat;
        vm.order = {
          numberOrder: casePat.orderNumber,
          branch: casePat.branch
        }
        vm.getCases();
      }
    }

    function afterSaveCases() {
      vm.casePat.id = vm.case.id;
      vm.casePat.numberCase = vm.case.numberCase;
      vm.casePat.pathologist = vm.case.pathologist;
      vm.casePat.schedule = vm.case.schedule;
      if(vm.casePat.schedule) {
        vm.casePat.schedule.date = moment(vm.casePat.schedule.init).format(vm.formatDateAge);
      }
      vm.casePat.specimens = vm.orderFormSamples(vm.casePat.specimens, vm.casePat.specimens);
      vm.caseFiles = null;
      vm.stateButton('new');
    }

    function getSamplesData(samples) {
      var data = [];
      _.forEach(samples, function(value) {
        var quantity = '';
        var container = '';
        var fixative = '';
        _.forEach(value, function(form) {
          if(form.name == "quantity") {
            quantity = form.value;
          }
          if(form.name == "container") {
            container = form.value;
          }
          if(form.name == "fixative") {
            fixative = form.value;
          }
        });
        data.push({ quantity: quantity, container: container, fixative: fixative });
      });
      return data;
    }

    function getSpecimensData(specimens) {
      _.forEach(specimens, function(value) {
        value.samples = vm.getSamplesData(value.form);
        value.subSample = value.subSample !== undefined && value.subSample !== null ? value.subSample.id : null;
      });
      return specimens;
    }

    function getCaseData() {
      var casePat = {
        id: vm.casePat.id,
        numberCase: vm.casePat.numberCase,
        studyType: vm.casePat.studyType,
        createdDateShort: Number(moment().format('YYYYMMDD')),
        order: vm.order,
        branch: vm.order.branch,
        specimens: vm.getSpecimensData(vm.casePat.specimens),
        userCreated: auth,
        userUpdated: auth,
        pathologist: vm.casePat.pathologist !== null && (vm.casePat.pathologist.id !== null && vm.casePat.pathologist.id !== undefined) ? vm.casePat.pathologist : null,
        schedule: vm.casePat.schedule !== null && vm.casePat.schedule !== undefined ? vm.casePat.schedule : null
      }
      return casePat;
    }

    /*Crea o modifica los casos*/
    function save(Form) {
      if(Form.$valid) {
        UIkit.modal('#modal_cases').hide();
        vm.loadingdata = true;
        var casePat = vm.getCaseData();
        if(casePat.id && casePat.numberCase) {
          vm.updateCase(casePat);
        } else {
          caseDS.createCase(auth.authToken, casePat).then(function(response) {
            vm.case = response.data;
            vm.totalReceive++;
            vm.afterSaveCases();
            vm.loadingdata = false;
            logger.success($filter('translate')('3134'));
          },
          function(error) {
            vm.modalError(error);
          });
        }
      }
    }

    function updateCase(casePat) {
      caseDS.updateCase(auth.authToken, casePat).then(function(response) {
        vm.case = response.data;
        vm.afterSaveCases();
        vm.loadingdata = false;
        logger.success($filter('translate')('3139'));
      },
      function(error) {
        vm.modalError(error);
      });
    }

    function deleteSection($event, $index, specimen) {
      if(!vm.disabledAdd) {
        $event.preventDefault();
        specimen.form.splice($index,1);
      }
    }

    function cloneSection($event,$index, specimen) {
        if(!vm.disabledAdd) {
          $event.preventDefault();
          specimen.form.push(JSON.parse(JSON.stringify(vm.formTemplate)));
        }
    }

    function selectStudy(casePat) {
      _.map(vm.cases, function (o) {
        if(o.studyType.id !== casePat.studyType.id) {
          o.active = false;
        }
      });
      casePat.active = !casePat.active;
      if(casePat.active) {
        vm.casePat = casePat;
        if(vm.casePat.rejected) {
          vm.stateButton('init');
        } else {
          if(vm.casePat.status > 1) {
            vm.stateButton('description');
          } else {
            vm.casePat.id !== '' && vm.casePat.id !== null && vm.casePat.id !== undefined ? vm.stateButton('new') : vm.stateButton('add');
          }
        }
      } else {
        vm.casePat = null;
        vm.stateButton('init');
      }
    }

    function undo() {
      vm.order = null;
      vm.edit = false;
      vm.cases = [];
      vm.casePat = null;
      vm.totalReceive = 0;
      vm.totalReject = 0;
      vm.caseSearch = null;
      vm.case = null;
      vm.caseFiles = null;
      vm.pathologist = null;
      vm.stateButton('init');
    }

    function getCaseForm(samples) {
      var form = [];
      _.forEach(samples, function(value) {
        var template = JSON.parse(JSON.stringify(vm.formTemplate));
        _.find(template, function(o) { return o.name === "fixative" }).value = value.fixative;
        _.find(template, function(o) { return o.name === "container" }).value = value.container;
        _.find(template, function(o) { return o.name === "quantity" }).value = value.quantity;
        form.push(template);
      });
      return form;
    }

    function orderFormSamples(samples, form) {
      var list = [];
      _.forEach(samples, function(value) {
        specimenDS.getSubsamplesBySpecimen(auth.authToken, value.id).then(function(response) {
          value.subSamples = response.data === "" || response.data === null || response.data === undefined ? [] : response.data;
          value.subSamples = _.filter(value.subSamples, function(o) { return o.selected });
          value.organs = _.filter(vm.organs, function(o) { return o.sample === value.id });
          if(value.organs.length === 0) {
            value.organs = vm.organs;
          }
          if(form) {
            var specimen = _.find(form, function(o) { return o.id === value.id });
            var subSample = _.find(value.subSamples, function(o) { return o.id === value.subSample });
            if(subSample) {
              value.subSample = subSample
            }
            value.form = vm.getCaseForm(specimen.samples);
          } else {
            if(value.organs.length === 1) {
              value.organ = value.organs[0];
            }
            value.form = [JSON.parse(JSON.stringify(vm.formTemplate))];
          }
          list.push(value);
        },
        function(error) {
          vm.modalError(error);
        });
      });
      return list;
    }

    /* Obtiene la lista de estudios de una orden*/
    function getCases() {
      vm.loadingdata = true;
      vm.loadFormTemplate();
      caseDS.getCaseByOrder(auth.authToken, vm.order.numberOrder).then(function(response) {
          vm.cases = response.data;
          vm.loadingdata = false;
          if(vm.caseSearch != null) {
            vm.cases = _.filter(vm.cases, function(o) { return o.studyType.id === vm.caseSearch.studyType.id; });
          }
          vm.cases.forEach(function(value) {
            if(value.numberCase) {
              vm.totalReceive++;
              value.specimens = vm.orderFormSamples(value.specimens, value.specimens);
            } else {
              value.specimens = vm.orderFormSamples(value.specimens, null);
            }
            if(value.schedule) {
              value.schedule.date = moment(value.schedule.init).format(vm.formatDateAge);
            }
            if(value.rejected) {
              vm.totalReject++;
            }
          });
        },
        function(error) {
          vm.loadingdata = false;
          vm.modalError(error);
      });
    }

    function closeModal() {
      UIkit.modal('#modal_cases').hide();
      vm.sample.id !== '' ? vm.stateButton('new') : vm.stateButton('add');
    }

    function loadFormTemplate() {
      vm.formTemplate = [
        {
          'type': 'text',
          'name': 'quantity',
          'label': $filter('translate')('3121'),
          'required': true,
          'value': ''
        },
        {
            'type': 'selectize',
            'name': 'container',
            'label': $filter('translate')('3122'),
            'placeholder': $filter('translate')('3058'),
            'code': false,
            'data': vm.containers,
            'required': true,
            'value': ''
        },
        {
            'type': 'selectize',
            'name': 'fixative',
            'label': $filter('translate')('3144'),
            'placeholder': $filter('translate')('3058'),
            'code': true,
            'data': vm.fixatives,
            'required': true,
            'value': ''
        }
      ];
    }

    function selectOrder(order) {
      vm.undo();
      vm.order = order;
      vm.getCases();
    }

    function getMotives() {
        motiveDS.getMotivePathology(auth.authToken).then(function(response) {
                vm.motives = _.orderBy(response.data, ['name'], ['asc']);
            },
            function(error) {
                vm.Error = error;
                vm.ShowPopupError = true;
            });
    }

    function getFixatives() {
        fixativeDS.getByStatus(auth.authToken).then(function(response) {
                vm.fixatives = _.orderBy(response.data, ['name'], ['asc']);
            },
            function(error) {
                vm.Error = error;
                vm.ShowPopupError = true;
            });
    }

    function getContainers() {
        containerPathologyDS.getByStatus(auth.authToken).then(function(response) {
                vm.containers = _.orderBy(response.data, ['name'], ['asc']);
            },
            function(error) {
                vm.Error = error;
                vm.ShowPopupError = true;
            });
    }

    function getOrgans() {
      organDS.getByStatus(auth.authToken).then(function(response) {
        vm.organs = _.orderBy(response.data, ['name'], ['asc']);
      },
      function(error) {
        vm.Error = error;
        vm.ShowPopupError = true;
      });
    }

    function getCasetes() {
      caseteDS.getByStatus(auth.authToken).then(function(response) {
              vm.casetes = _.orderBy(response.data, ['name'], ['asc']);
          },
          function(error) {
              vm.Error = error;
              vm.ShowPopupError = true;
          });
    }

    function autocomplenumberorder($event) {
        var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
        if (keyCode === 13 || keyCode === undefined) {
            var orderdigit = localStorageService.get('DigitosOrden');
            var cantdigit = parseInt(orderdigit) + 4;

            if (vm.searchorder.length < cantdigit) {
                if (vm.searchorder.length === cantdigit - 1) {
                    vm.searchorder = '0' + vm.searchorder;
                    vm.searchorder = moment().year() + vm.searchorder;
                } else if (parseInt(orderdigit) === vm.searchorder.length - 1) {
                    vm.searchorder = '0' + vm.searchorder;
                    vm.searchorder = moment().year() + (common.getOrderComplete(vm.searchorder, orderdigit)).substring(4);
                } else {
                    vm.searchorder = vm.searchorder === '' ? 0 : vm.searchorder;
                    vm.searchorder = moment().year() + (common.getOrderComplete(vm.searchorder, orderdigit)).substring(4);
                }
            } else if (vm.searchorder.length > cantdigit) {
                if (vm.searchorder.length === cantdigit + 1) {
                    vm.searchorder = (moment().format('YYYY')).substring(0, 3) + vm.searchorder;
                } else if (vm.searchorder.length === cantdigit + 2) {
                    vm.searchorder = (moment().format('YYYY')).substring(0, 2) + vm.searchorder;
                } else if (vm.searchorder.length === cantdigit + 3) {
                    vm.searchorder = (moment().format('YYYY')).substring(0, 1) + vm.searchorder;
                } else {
                    vm.searchorder = vm.searchorder;
                }
            } else if (vm.searchorder.length === cantdigit) {
                vm.searchorder = moment().year() + vm.searchorder
            }
            vm.setFilter();
        } else {
            if (!(keyCode >= 48 && keyCode <= 57)) {
                $event.preventDefault();
            }
        }
    }

    /** Funcion  Configura el filtro principal para la consulta de las órdenes */
    function setFilter() {
      UIkit.modal('#modalfilter-date').hide();
      vm.showModalFilter = false;
      vm.loadingdata = true;
      //Rango de órdenes
      if (vm.searchorder === '') {
          vm.filter.filterRange = vm.filterRange;
          vm.filter.firstOrder = vm.filterRange === '0' ? 0 - 1 : parseInt(vm.rangeInit) - 1; //No incluye la primera orden
          vm.filter.lastOrder = vm.filterRange === '0' ? 0 + 1 : parseInt(vm.rangeEnd) + 1; //No incluye la última  orden
          //Rango de fecha de verificación
          vm.filter.firstDate = vm.filterRange !== '0' ? 0 - 1 : parseInt(vm.rangeInit) - 1; //No incluye la primera fecha
          vm.filter.lastDate = vm.filterRange !== '0' ? 0 + 1 : parseInt(vm.rangeEnd) + 1; //No incluye la última  fecha
          vm.filterinfo.textinit = vm.filterRange === '0' ? $filter('translate')('0075') : $filter('translate')('0073');
          vm.filterinfo.valueinit = vm.filterRange === '0' ? moment(vm.rangeInit).format(vm.formatDateAge) : vm.rangeInit.substring(3);
          vm.filterinfo.textend = vm.filterRange === '0' ? $filter('translate')('0076') : $filter('translate')('0074');
          vm.filterinfo.valueend = vm.filterRange === '0' ? moment(vm.rangeEnd).format(vm.formatDateAge) : vm.rangeEnd.substring(3);
      } else {
          vm.filter.filterRange = '1';
          vm.filter.firstOrder = parseInt(vm.searchorder) - 1;
          vm.filter.lastOrder = parseInt(vm.searchorder) + 1;
          vm.filterinfo.valueinit = 'N/A';
          vm.filterinfo.valueend = 'N/A';
      }
      vm.undo();
      vm.orders = [];
      return orderDS.getPathologyFilter(auth.authToken, vm.filter).then(function(data) {
          if (data.status === 200) {
              vm.loadingdata = false;
              vm.orders = _.orderBy(data.data, ['id'], ['asc']);
          } else {
              vm.loadingdata = false;
              UIkit.modal('#nofoundfilter').show();
          }
      }, function(error) {
          vm.loadingdata = false;
          vm.modalError(error);
      });
    }

    //** Metodo que evalua los estados de los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.disabled = true;
        vm.disabledReceive = true;
        vm.disabledReject  = true;
        vm.disabledSave = true;
        vm.disableBarCode = true;
        vm.disabledEdit = true;
        vm.disabledAttachment = true;
        vm.disabledSchedule = true;
        vm.disabledCasete = true;
        vm.disabledAdd = true;
        vm.disabledMacroscopy = true
      }
      if (state === 'add') {
        vm.disabled = false;
        vm.disabledReceive = false;
        vm.disabledReject  = false;
        vm.disabledSave = false;
        vm.disableBarCode = true;
        vm.disabledEdit = true;
        vm.disabledAttachment = true;
        vm.disabledSchedule = true;
        vm.disabledCasete = true;
        vm.disabledAdd = false;
        vm.disabledMacroscopy = true;
      }
      if (state === 'new') {
        vm.disabled = true;
        vm.disabledReceive = false;
        vm.disabledReject  = true;
        vm.disableBarCode = false;
        vm.disabledSave = true;
        vm.disabledEdit = false;
        vm.disabledAttachment = false;
        vm.disabledSchedule = false;
        vm.disabledCasete = false;
        vm.disabledAdd = true;
        vm.disabledMacroscopy = false;
      }
      if (state === 'edit') {
        vm.disabled = false;
        vm.disabledReceive = false;
        vm.disabledReject  = true;
        vm.disableBarCode = false;
        vm.disabledSave = false;
        vm.disabledEdit = true;
        vm.disabledAttachment = false;
        vm.disabledSchedule = false;
        vm.disabledCasete = false;
        vm.disabledAdd = false;
        vm.disabledMacroscopy = false;
      }
      if (state === 'description') {
        vm.disabled = true;
        vm.disabledReceive = true;
        vm.disabledReject  = true;
        vm.disableBarCode = false;
        vm.disabledSave = true;
        vm.disabledEdit = true;
        vm.disabledAttachment = false;
        vm.disabledSchedule = true;
        vm.disabledCasete = true;
        vm.disabledAdd = true;
        vm.disabledMacroscopy = true;
      }
    }

    //** Método para sacar el popup de error**//
    function modalError(error) {
        vm.loadingdata = false;
        if (error.data !== null) {
          if (error.data.code === 2) {
              error.data.errorFields.forEach(function(value) {
                  var item = value.split('|');
                  if (item[0] === '0' && item[1] === 'study') {
                      logger.error($filter('translate')('3132').replace('@@@@', item[2]));
                  }
              });
              vm.undo();
              vm.loadingdata = false;
          }
        }
        if (vm.codeRepeat === false && vm.nameRepeat === false) {
            vm.Error = error;
            vm.ShowPopupError = true;
            vm.loadingdata = false;
        }
    }

    $scope.$on('onLastRepeat', function (scope, element, attrs) {
      altair_uikit.reinitialize_grid_margin();
    });

    function isAuthenticate() {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        if (auth === null || auth.token) {
            $state.go('login');
        } else {
            vm.init();
        }
    }

    function init() {
        vm.filterinfo = {
            'textinit': $filter('translate')('0075'),
            'textend': $filter('translate')('0076'),
            'valueinit': 'N/A',
            'valueend': 'N/A',
            'valuefilterareatest': 'N/A'
        }
        vm.stateButton('init');
        vm.getContainers();
        vm.getOrgans();
        vm.getFixatives();
        vm.getMotives();
        vm.getCasetes();
        vm.loadSchedule();
    }

    vm.isAuthenticate();

  }
})();
/* jshint ignore:end */
