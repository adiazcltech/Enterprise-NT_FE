/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.reviewofresults")
    .controller("reviewofresultsController", reviewofresultsController);

  reviewofresultsController.$inject = [
    "LZString",
    "common",
    "localStorageService",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "reviewofresultDS",
    "ordertypeDS",
    "$translate",
    "laboratoryDS",
    "reportadicional",
    "reportsDS",
  ];

  function reviewofresultsController(
    LZString,
    common,
    localStorageService,
    $filter,
    $state,
    moment,
    $rootScope,
    reviewofresultDS,
    ordertypeDS,
    $translate,
    laboratoryDS,
    reportadicional,
    reportsDS
  ) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = "Listed";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0023").toUpperCase();
    $rootScope.helpReference = "03.Result/reviewofresults.htm";
    $rootScope.blockView = true;
    vm.tabActive = 1;
    $rootScope.pageview = 3;
    vm.printReport = printReport;
    vm.getOrderType = getOrderType;
    vm.printPending = printPending;
    vm.printReportOrderDate = printReportOrderDate;
    vm.printManagement = printManagement;
    vm.changeTypeReport = changeTypeReport;
    vm.windowOpenReport = windowOpenReport;
    vm.commentpending = "0";
    vm.formatDate = localStorageService.get("FormatoFecha");
    vm.formatDateAge = localStorageService.get("FormatoFecha").toUpperCase();
    vm.trazability = localStorageService.get("Trazabilidad");
    vm.takesample = localStorageService.get("TomaMuestra");
    vm.HandlebarsResultsReview =
      localStorageService.get("RevisiondeResultadosHandlebars") === "True";
    vm.isPricesCheckResults =
      localStorageService.get("PreciosRevisionResultados") === "True";
    vm.pruebareport = false;
    vm.openreport = true;
    vm.itemcomment = 2;
    vm.typereport = 2;
    vm.Resultfilter = 0;
    vm.demographics = [];
    vm.isOpenReport = false;
    vm.rangeInit = moment().format("YYYYMMDD");
    vm.rangeEnd = moment().format("YYYYMMDD");
    vm.filterRange = "0";
    vm.printPanic = printPanic;
    vm.printCritical = printCritical;
    vm.groupProfiles = true;
    vm.flasheaTexto = flasheaTexto;
    vm.abbrCustomer = localStorageService.get("Abreviatura");
    vm.nameCustomer = localStorageService.get("Entidad");
    vm.generarpdf = generarpdf;

    vm.listcomment1 = [
      { name: $filter("translate")("0315"), id: 1 },
      { name: $filter("translate")("0316"), id: 2 },
    ];

    vm.listcomment = [
      { name: $filter("translate")("0315"), id: 1 },
      { name: $filter("translate")("0316"), id: 2 },
    ];

    vm.listtype = [
      { name: $filter("translate")("0320"), id: 1 },
      { name: $filter("translate")("0321"), id: 2 },
      { name: "Pivot", id: 3 },
    ];

    vm.listypepanic = [
      { name: $filter("translate")("1839"), id: 1 },
      { name: $filter("translate")("1840"), id: 2 },
    ];

    vm.listResultstate = [
      { id: 0, name: $filter("translate")("0353") }, //Todos
      // { id: 1, name: $filter('translate')('0354') },
      { id: 2, name: $filter("translate")("0355") }, //Repetición
      { id: 3, name: $filter("translate")("0323") }, //Patológico
      { id: 4, name: $filter("translate")("0356") }, //Pánico
      //  { id: 5, name: $filter('translate')('0357') }
    ];

    vm.typepanic = vm.listypepanic[0];
    vm.durations = [5, 10, 15, 30, 60];

    function getOrderType() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return ordertypeDS
        .getOrderTypeActive(auth.authToken)
        .then(function (data) {
          vm.getlaboratory();
          var all = [
            {
              id: null,
              name: $filter("translate")("0215"),
            },
          ];

          if (data.data.length > 0) {
            vm.listordertype = all.concat(data.data);
            vm.itemordertype = { id: null };
          }
        });
    }

    vm.getlaboratory = getlaboratory;
    function getlaboratory() {
      vm.listlaboratory = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return laboratoryDS
        .getLaboratoryActive(auth.authToken)
        .then(function (data) {
          var all = [
            {
              id: null,
              name: $filter("translate")("0215"),
            },
          ];
          if (data.data.length > 0) {
            vm.listlaboratory = all.concat(data.data);
            vm.laboratoryid = { id: null };
          }
        });
    }

    function printReport(type) {
      vm.type = type;
      var filterstate = [];
      vm.typeFilter = [];
      vm.outputBrowsers.forEach(function (value, key) {
        filterstate.push(value.id);
        vm.typeFilter.push(" " + value.name);
      });

      var filter = {
        rangeType: vm.filterRange,
        init: vm.rangeInit,
        end: vm.rangeEnd,
        orderType: vm.itemordertype.id,
        filterState: filterstate,
        demographics: vm.demographics,
        testFilterType: vm.numFilterAreaTest,
        tests: vm.numFilterAreaTest === 1 ? vm.listAreas : vm.listTests,
        attended: vm.typepanic ? vm.typepanic.id : null,
        laboratory: vm.laboratoryid.id,
        groupProfiles: vm.groupProfiles,
        resultState: [0],
        userId: 0,
        pending: vm.tabActive === 1,
      };

      if (vm.Resultfilter !== -1 && vm.Resultfilter !== 0) {
        filter.resultState = [vm.Resultfilter];
      }

      vm.datareport = [];

      if (vm.tabActive === 1) {
        vm.printPending(filter);
      } else if (vm.tabActive === 2) {
        vm.printManagement(filter);
      } else if (vm.tabActive === 3) {
        vm.printCritical(filter);
      } else if (vm.tabActive === 4) {
        vm.printPanic(filter);
      } else if (vm.tabActive === 5) {
        vm.printReportOrderDate(filter);
      }
    }

    function printCritical(filter) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
 
      return reviewofresultDS
        .getCriticalValues(auth.authToken, filter)
        .then(function (data) {
          if (data.data !== "") {
            data.data = _.orderBy(data.data, ["order"], ["asc"]);
            data.data.forEach(function (value, key) {
              //Tiempo total
              var init = moment(value.entryDate);
              var end = null;
              var duration = 0;
              var hours = 0;
              var minutes = 0;
              var seconds = 0;

              if (value.reportedDoctor) {
                end = moment(value.reportedDoctor);
                duration = moment.duration(end.diff(init));
                hours = duration.get("hours");
                minutes = duration.get("minutes");
                seconds = duration.get("seconds");
                value.reportedDoctor = moment(value.reportedDoctor).format(
                  vm.formatDateAge + ", HH:mm:ss"
                );
              }
              value.hours =
                hours === 0
                  ? "00:"
                  : hours <= 9
                  ? "0" + hours + ":"
                  : hours + ":";
              value.minutes =
                minutes === 0
                  ? "00:"
                  : minutes <= 9
                  ? "0" + minutes + ":"
                  : minutes + ":";
              value.seconds =
                seconds === 0
                  ? "00"
                  : seconds <= 9
                  ? "0" + seconds
                  : seconds + "";
              value.totalMinutes = minutes;
              value.totalHours = hours;
              value.totalSeconds = seconds;
              value.entryDate = moment(value.entryDate).format(
                vm.formatDateAge + ", HH:mm:ss"
              );
            });

            var services = _.filter(
              _.map(_.uniqBy(data.data, "serviceId"), function (x) {
                return {
                  id: x.serviceId,
                  name: x.service,
                };
              }),
              function (a) {
                return !_.isUndefined(a.name);
              }
            );

            //Chart
            var chart = [];
            services.forEach(function (value) {
              var criticalValue = {};
              criticalValue.name = value.name;
              criticalValue.data = [];

              for (var i = 0; i <= vm.durations.length; i++) {
                var duration = vm.durations[i];
                var total = 0;
                var init = "";

                if (i === 0) {
                  init = $filter("translate")("1847") + " ";
                } else if (i === vm.durations.length) {
                  duration = vm.durations[i - 1] + 1;
                  init = $filter("translate")("1846");
                } else {
                  init =
                    vm.durations[i - 1] +
                    1 +
                    " " +
                    $filter("translate")("0646");
                }

                if (duration <= 60) {
                  if (i === 0) {
                    total = _.filter(data.data, function (o) {
                      return (
                        o.serviceId === value.id &&
                        o.totalHours === 0 &&
                        ((o.totalMinutes === 0 && o.totalSeconds > 0) ||
                          (o.totalMinutes > 0 && o.totalMinutes <= duration))
                      );
                    }).length;
                  } else if (i === vm.durations.length) {
                    total = _.filter(data.data, function (o) {
                      return (
                        o.serviceId === value.id &&
                        o.totalHours === 0 &&
                        o.totalMinutes > 0 &&
                        o.totalMinutes >= duration
                      );
                    }).length;
                  } else {
                    total = _.filter(data.data, function (o) {
                      return (
                        o.serviceId === value.id &&
                        o.totalHours === 0 &&
                        o.totalMinutes >= vm.durations[i - 1] + 1 &&
                        o.totalMinutes > 0 &&
                        o.totalMinutes <= duration
                      );
                    }).length;
                  }
                } else {
                  total = _.filter(data.data, function (o) {
                    return o.serviceId === value.id && o.totalHours >= 1;
                  }).length;
                }

                criticalValue.data.push({
                  duration: init + " " + duration,
                  total: total,
                });
              }

              chart.push(criticalValue);
            });

            //Totales Por Columna
            var criticalValues = JSON.parse(JSON.stringify(chart));

            criticalValues.forEach(function (value) {
              var total = _.sumBy(value.data, function (o) {
                return o.total;
              });
              value.data.push({
                duration: "Total",
                total: total,
              });
            });

            var total = [];
            var percentage = [];

            for (var i = 0; i <= vm.durations.length + 1; i++) {
              var col = 0;
              criticalValues.forEach(function (value) {
                col += value.data[i].total;
              });
              total.push({
                duration: criticalValues[0].data[i].duration,
                total: col,
              });
              percentage.push({
                duration: criticalValues[0].data[i].duration,
                total:
                  Math.round(
                    (col /
                      _.filter(data.data, function (a) {
                        return a.serviceId !== 0;
                      }).length) *
                      100 *
                      100
                  ) / 100,
              });
            }

            criticalValues.push({
              name: "Total",
              data: total,
            });

            criticalValues.push({
              name: $filter("translate")("0827"),
              data: percentage,
            });

            vm.datareport = {
              data: data.data,
              chart: chart,
              criticalValues: criticalValues,
            };

            vm.variables = {
              entity: vm.nameCustomer,
              abbreviation: vm.abbrCustomer,
              rangeInit: vm.rangeInit,
              rangeEnd: vm.rangeEnd,
              rangeType: vm.filterRange,
              username: auth.userName,
              date: moment().format(vm.formatDateAge + ", HH:mm:ss"),
              critics: _.filter(data.data, function (o) {
                return (
                  o.totalHours === 0 &&
                  ((o.totalMinutes === 0 && o.totalSeconds > 0) ||
                    (o.totalMinutes > 0 && o.totalMinutes <= 30))
                );
              }).length,
            };

            vm.pathreport =
              "/Report/post-analitic/reviewofresult/criticalvalues/criticalvalues.mrt";
            vm.dowload();
          } else {
            UIkit.modal("#modalReportError").show();
            vm.pruebareport = false;
          }
        });
    }

    function printPanic(filter) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      filter.resultState = [4];
      filter.pending = false;
      filter.groupProfiles = false
      filter.filterState.push(2)
      return reviewofresultDS
        .getPanicInterview(auth.authToken, filter)
        .then(function (data) {
          if (data.data !== "") {
            var finalData = [];
            data.data.forEach(function (value, key) {
              if (vm.typepanic.id === 1) {
                value.date =
                  value.date === null || value.date === undefined
                    ? ""
                    : moment(value.date).format(
                        vm.formatDateAge + ", HH:mm:ss"
                      );
                value.dateValidated =
                  value.dateValidated === null ||
                  value.dateValidated === undefined
                    ? ""
                    : moment(value.dateValidated).format(
                        vm.formatDateAge + ", HH:mm:ss"
                      );
                if (value.answerId !== 0) {
                  var final = _.filter(data.data, function (o) {
                    return (
                      o.order === value.order &&
                      o.testId === value.testId &&
                      o.questionId === value.questionId
                    );
                  });
                  var answer = [];
                  final.forEach(function (val) {
                    answer.push(val.answerClose);
                  });
                  value.answerClose = answer.join();
                }
                finalData.push(value);
              } else {
                finalData.push(value);
              }
            });
            vm.datareport = finalData;
            vm.variables = {
              entity: vm.nameCustomer,
              abbreviation: vm.abbrCustomer,
              rangeInit: vm.rangeInit,
              rangeEnd: vm.rangeEnd,
              rangeType: vm.filterRange,
              username: auth.userName,
              typeFilter: vm.typeFilter.toString(),
              date: moment().format(vm.formatDateAge + ", HH:mm:ss"),
            };

            if (vm.typepanic.id === 1) {
              vm.pathreport =
                "/Report/post-analitic/reviewofresult/panicinterview/panicinterview.mrt";
            } else {
              vm.pathreport =
                "/Report/post-analitic/reviewofresult/unattendedpanic/unattendedpanic.mrt";
            }
            vm.dowload();
          } else {
            UIkit.modal("#modalReportError").show();
            vm.pruebareport = false;
          }
        });
    }

    function printReportOrderDate(filter) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var initialDate = vm.rangeInit;
      var finalDate = vm.rangeEnd;
      return reviewofresultDS
        .getresultsOrderDate(auth.authToken, initialDate, finalDate, filter)
        .then(function (data) {
          if (data.data !== "" &&
            data.data !== null &&
            data.data !== undefined) {
            vm.datareport = data.data;
            vm.pathreport =
              "/Report/post-analitic/reviewofresult/informationbydates/informationbydates.mrt";
            vm.variables = {
              entity: vm.nameCustomer,
              abbreviation: vm.abbrCustomer,
              rangeInit: vm.rangeInit,
              rangeEnd: vm.rangeEnd,
              rangeType: vm.filterRange,
              username: auth.userName,
              typeFilter: vm.typeFilter.toString(),
              date: moment().format(vm.formatDateAge + ", HH:mm:ss"),
            };
            vm.dowload();

            // vm.windowOpenReport(); // Esta funcion no va porque el reporte lo van a descargar en excel o pdf
          } else {
            UIkit.modal("#modalReportError").show();
            vm.pruebareport = false;
          }
        });
    }

    function printPending(filter) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return reviewofresultDS
        .getresultspending(auth.authToken, filter)
        .then(function (data) {
          if (data.data !== "" &&
            data.data !== null &&
            data.data !== undefined) {
            data.data.forEach(function (value, key) {
              value.createdDate = moment(value.createdDate).format(
                vm.formatDateAge
              );
              value.patient.sex =
                $filter("translate")("0000") === "enUsa"
                  ? value.patient.sex.enUsa
                  : value.patient.sex.esCo;
              value.patient.birthday = common.getAgeAsString(
                moment(value.patient.birthday).format(vm.formatDateAge),
                vm.formatDateAge,
                value.createdDate,
                true
              );
              if (value.dateOfDeath !== undefined) {
                value.dateOfDeath = moment(value.dateOfDeath).format(
                  vm.formatDateAge
                );
              }
              if (value.allDemographics.length > 0) {
                value.allDemographics.forEach(function (value2) {
                  value["demo_" + value2.idDemographic + "_name"] =
                    value2.demographic;
                  value["demo_" + value2.idDemographic + "_value"] =
                    value2.encoded === false
                      ? value2.notCodifiedValue
                      : value2.codifiedName;
                });
              }
              value.comment = "";
              value.comments = $filter("filter")(value.comments, {
                print: true,
              });
              if (value.comments.length > 0) {
                for (var i = 0; i < value.comments.length; i++) {
                  var comment = value.comments[i].comment.replace(/'/g, "");
                  comment = JSON.parse(comment).content.replace(
                    /span/g,
                    "font"
                  );
                  try {
                    value.comment =
                      (value.comment === "" ? +"" : +"<br/>") +
                      JSON.parse(comment);
                  } catch (e) {
                    value.comment =
                      (value.comment === "" ? +"" : +"<br/>") +
                      "<br/>" +
                      comment;
                  }
                }
              }

              var filterstate = null;
              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 0;
              });
              value.testconcat0 = _.uniq(_.map(filterstate, "abbr")).toString();

              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 1;
              });
              value.testconcat1 = _.uniq(_.map(filterstate, "abbr")).toString();

              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 2;
              });
              value.testconcat2 = _.uniq(_.map(filterstate, "abbr")).toString();

              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 3;
              });
              value.testconcat3 = _.uniq(_.map(filterstate, "abbr")).toString();

              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 4;
              });
              value.testconcat4 = _.uniq(_.map(filterstate, "abbr")).toString();

              for (var i = 0; i < value.tests.length; i++) {
                if (value.tests[i].hasTemplate === false) {
                  value.tests[i].optionsTemplate = [
                    {
                      idTest: value.tests[i].testId,
                      order: value.orderNumber,
                      option: null,
                    },
                  ];
                }
                value.tests[i].hasObservationResult =
                  value.tests[i].hasComment === true
                    ? true
                    : value.tests[i].hasTemplate === true
                    ? true
                    : false;
              }
            });

            vm.datareport = data.data;
            vm.variables = {
              rangeInit: vm.rangeInit,
              rangeEnd: vm.rangeEnd,
              rangeType: vm.filterRange,
              username: auth.userName,
              typeFilter: vm.typeFilter.toString(),
              date: moment().format(vm.formatDateAge + ", HH:mm:ss"),
            };

            if (vm.itemcomment === 3) {
              vm.pathreport =
                "/Report/post-analitic/reviewofresult/templateresult.mrt";
            } else if (vm.itemcomment === 2) {
              vm.pathreport =
                "/Report/post-analitic/reviewofresult/PendingResult.mrt";
            } else {
              vm.pathreport =
                "/Report/post-analitic/reviewofresult/PendingResultComment.mrt";
            }
            vm.dowload();
            //vm.windowOpenReport();
          } else {
            UIkit.modal("#modalReportError").show();
            vm.pruebareport = false;
          }
        });
    }

    function printManagement(filter) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      filter.rangeType = filter.rangeType === "0" ? "3" : filter.rangeType;
      filter.facturation = vm.typereport === 4 ? 1 : 0;
      return reviewofresultDS
        .getresultManagement(auth.authToken, filter)
        .then(function (data) {
          if (
            data.data !== "" &&
            data.data !== null &&
            data.data !== undefined
          ) {
            data.data.forEach(function (value, key) {
              if (value.allDemographics.length > 0) {
                value.allDemographics.forEach(function (value2) {
                  value["demo_" + value2.idDemographic + "_name"] =
                    value2.demographic;
                  value["demo_" + value2.idDemographic + "_codifiedCode"] =
                    value2.codifiedCode;
                  value["demo_" + value2.idDemographic + "_value"] =
                    value2.encoded === false
                      ? value2.notCodifiedValue
                      : value2.codifiedName;
                });
              }

              value.patient.sexcode = value.patient.sex.code;
              value.patient.sex =
                $filter("translate")("0000") === "enUsa"
                  ? value.patient.sex.enUsa
                  : value.patient.sex.esCo;
              value.patient.sexabbr = value.patient.sexcode == "2" ? "F" : "M";
              value.patient.email =
                value.patient.email != undefined
                  ? value.patient.email.replace(";", " ")
                  : "";
              value.suborderNumber = value.orderNumber
                .toString()
                .substring(3, value.orderNumber.length);
              value.createdDate = moment(value.createdDate).format(
                vm.formatDateAge + " HH:mm:ss "
              );
              value.patient.birthdaydate = moment(
                value.patient.birthday
              ).format(vm.formatDateAge);
              value.patient.birthday = common.getAgeAsString(
                moment(value.patient.birthday).format(vm.formatDateAge),
                vm.formatDateAge,
                value.createdDate,
                true
              );

              var filterstate = null;
              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 0;
              });
              value.testconcat0 = _.uniq(_.map(filterstate, "abbr")).toString();

              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 1;
              });
              value.testconcat1 = _.uniq(_.map(filterstate, "abbr")).toString();

              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 2;
              });
              value.testconcat2 = _.uniq(_.map(filterstate, "abbr")).toString();

              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 3;
              });
              value.testconcat3 = _.uniq(_.map(filterstate, "abbr")).toString();

              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 4;
              });
              value.testconcat4 = _.uniq(_.map(filterstate, "abbr")).toString();

              filterstate = _.filter(value.tests, function (o) {
                return o.result.state === 5;
              });
              value.testconcat5 = _.uniq(_.map(filterstate, "abbr")).toString();

              //pendiente.
              value.comment = "";
              value.comments = $filter("filter")(value.comments, {
                print: true,
              });
              if (value.comments.length > 0) {
                for (var i = 0; i < value.comments.length; i++) {
                  value.comments[i].comment = JSON.parse(
                    value.comments[i].comment
                  ).content.replace(/span/g, "font");
                  try {
                    value.comment =
                      (value.comment === "" ? +"" : +"<br/>") +
                      "<br/>" +
                      JSON.parse(value.comments[i].comment);
                  } catch (e) {
                    value.comment =
                      (value.comment === "" ? +"" : +"<br/>") +
                      "<br/>" +
                      value.comments[i].comment;
                  }
                }
              }

              //pendiente
              for (var i = 0; i < value.tests.length; i++) {
                if (value.tests[i].hasTemplate === false) {
                  value.tests[i].optionsTemplate = [
                    {
                      idTest: value.tests[i].testId,
                      order: value.orderNumber,
                    },
                  ];
                }

                value.tests[i].validationDate =
                  value.tests[i].result.dateValidation === undefined
                    ? ""
                    : moment
                        .utc(value.tests[i].result.dateValidation)
                        .format(vm.formatDateAge + " HH:mm:ss ");
                value.tests[i].verificationDate =
                  value.tests[i].result.dateVerific === undefined
                    ? ""
                    : moment
                        .utc(value.tests[i].result.dateVerific)
                        .format(vm.formatDateAge + " HH:mm:ss ");
                value.tests[i].resultDate =
                  value.tests[i].result.dateResult === undefined
                    ? ""
                    : moment
                        .utc(value.tests[i].result.dateResult)
                        .format(vm.formatDateAge + " HH:mm:ss ");
                value.tests[i].entryDate =
                  value.tests[i].result.dateOrdered === undefined
                    ? ""
                    : moment
                        .utc(value.tests[i].result.dateOrdered)
                        .format(vm.formatDateAge + " HH:mm:ss ");
                value.tests[i].datePrint =
                  value.tests[i].result.datePrint === undefined
                    ? ""
                    : moment
                        .utc(value.tests[i].result.datePrint)
                        .format(vm.formatDateAge + " HH:mm:ss ");
                value.tests[i].pathology =
                  value.tests[i].result.pathology === 0 ? 0 : 1;

                if (vm.HandlebarsResultsReview) {
                  if (value.tests[i].resultComment != undefined) {
                    value.tests[i].resultComment.commentformat = htmlEntities(
                      value.tests[i].resultComment.comment
                    );
                    value.tests[i].resultComment.commentformat =
                      value.tests[i].resultComment.commentformat == "null"
                        ? ""
                        : value.tests[i].resultComment.commentformat;
                  } else {
                    value.tests[i].resultComment.commentformat = "";
                  }
                  switch (value.tests[i].result.state) {
                    case 0:
                      value.tests[i].result.state = "Ingresados";
                      break;
                    case 1:
                      value.tests[i].result.state = "Repetición";
                      break;
                    case 2:
                      value.tests[i].result.state = "Resultado";
                      break;
                    case 3:
                      value.tests[i].result.state = "Pre Validados";
                      break;
                    case 4:
                      value.tests[i].result.state = "Validados";
                      break;
                    case 5:
                      value.tests[i].result.state = "Impresos";
                      break;
                  }
                }
              }
            });

            vm.datareport = data.data;

            vm.variables = {
              entity: vm.nameCustomer,
              abbreviation: vm.abbrCustomer,
              rangeInit: vm.rangeInit,
              rangeEnd: vm.rangeEnd,
              rangeType: vm.filterRange,
              username: auth.userName,
              typeFilter: vm.typeFilter.toString(),
              date: moment().format(vm.formatDateAge + ", HH:mm:ss"),
            };
            if (vm.typereport === 1) {
              vm.pathreport =
                "/Report/post-analitic/reviewofresult/ResumeManagement.mrt";
              vm.dowload();
            } else if (vm.typereport === 3) {
              vm.pathreport = "/Report/post-analitic/reviewofresult/pivot.mrt";
              vm.dowload();
            } else if (vm.typereport === 4) {
              //vm.pathreport = '/Report/post-analitic/reviewofresult/billing.mrt';
              //vm.dowload();
              vm.pathreport = "reviewofresult/billing";
              vm.generarpdf(vm.datareport, vm.variables, "Tabloid");
              vm.pruebareport = false;
            } else {
              if (vm.itemcomment === 2) {
                if (vm.HandlebarsResultsReview) {
                  vm.type = "csv";
                  vm.pathreport = "reviewofresult/ManagementResult";
                  vm.generarpdf(vm.datareport, vm.variables, "Legal");
                  vm.pruebareport = false;
                } else {
                  vm.pathreport =
                    "/Report/post-analitic/reviewofresult/ManagementResult.mrt";
                  vm.dowload();
                }
              } else {
                if (vm.HandlebarsResultsReview) {
                  //vm.type = 'csv';
                  vm.pathreport = "/reviewofresult/ManagementResultComment";
                  vm.generarpdf(vm.datareport, vm.variables, "Legal");
                  vm.pruebareport = false;
                } else {
                  vm.pathreport =
                    "/Report/post-analitic/reviewofresult/ManagementResultComment.mrt";
                  vm.dowload();
                }
              }
            }
          } else {
            UIkit.modal("#modalReportError").show();
            vm.pruebareport = false;
          }
        });
    }

    function esJSONValido(variable) {
      // Verificar que es una cadena
      if (!_.isString(variable)) {
          return false;
      }
  
      // Intentar hacer JSON.parse
      try {
          JSON.parse(variable);
          return true; // Es una cadena JSON válida
      } catch (e) {
          return false; // No es un JSON válido
      }
  }

    function generarpdf(data, variables, format) {
      var orders = {
        data: data,
        variables: [variables],
        template: vm.pathreport,
        format: format,
        orientation: "landscape",
        type: vm.type,
      };

      vm.ind = 1;
      vm.total = vm.datareport.length / 3;
      vm.porcent = 0;
      UIkit.modal("#modalprogress", {
        bgclose: false,
        escclose: false,
        modal: false,
      }).show();

      var nIntervId;
      nIntervId = setInterval(vm.flasheaTexto, 200);

      reportsDS.generarpdf(orders).then(function (response) {
        if (response.status === 200) {
          if (vm.type == "pdf") {
            var reportbasee64 = _base64ToArrayBuffer(response.data);
            var pdfUrl = URL.createObjectURL(
              new Blob([reportbasee64], {
                type: "application/pdf",
              })
            );
            //window.download(pdfUrl, '_blank');
            //window.open(pdfUrl, '_blank');
            var a = document.createElement("a");
            a.setAttribute("download", "Reporte.pdf");
            a.setAttribute("href", pdfUrl);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else if (vm.type == "xls") {
            var reportbasee64 = _base64ToArrayBuffer(response.data);
            var pdfUrl = URL.createObjectURL(
              new Blob([reportbasee64], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              })
            );
            //window.download(pdfUrl, '_blank');
            //window.open(pdfUrl, '_blank');
            var a = document.createElement("a");
            a.setAttribute("download", "Reporte.xlsx");
            a.setAttribute("href", pdfUrl);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            if (
              response.config == undefined ||
              response.config == null ||
              response.config.data.data.length === 0
            ) {
              UIkit.modal("#modalprogress", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).hide();
              vm.porcent = 0;
              clearInterval(nIntervId);
              return;
            }

            if (
              esJSONValido(response.data) 
            ) {
             var binaryString = window.atob(JSON.parse(response.data));
            } else {
             var binaryString = window.atob(response.data);
            }
            var bytes = new Uint8Array(binaryString.length);
            for (var i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            var decoder = new TextDecoder("utf-8");
            var utf8String = decoder.decode(bytes);

            var csvBlob = new Blob(["\ufeff" + utf8String], {
              type: "application/octet-stream; charset=utf-8",
            });
            var csvURL = URL.createObjectURL(csvBlob);
            var downloadLink = document.createElement("a");
            downloadLink.href = csvURL;
            downloadLink.download = "report.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
          UIkit.modal("#modalprogress", {
            bgclose: false,
            escclose: false,
            modal: false,
          }).hide();
          vm.porcent = 0;
          clearInterval(nIntervId);
        }
      });

      vm.progressPrint = false;
    }   

    function _base64ToArrayBuffer(base64) {
      var binary_string = window.atob(JSON.parse(base64));
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    function htmlEntities(str) {
      var valorhtml = String(str)
        .replace(/&ntilde;/g, "ñ")
        .replace(/\n/g, "  ")
        .replace(/<[^>]*>?/g, "")
        .replace(/&Ntilde;/g, "Ñ")
        .replace(/&amp;/g, "&")
        .replace(/&Ntilde;/g, "Ñ")
        .replace(/&ntilde;/g, "ñ")
        .replace(/&Ntilde;/g, "Ñ")
        .replace(/&Agrave;/g, "À")
        .replace(/&Aacute;/g, "Á")
        .replace(/&Acirc;/g, "Â")
        .replace(/&Atilde;/g, "Ã")
        .replace(/&Auml;/g, "Ä")
        .replace(/&Aring;/g, "Å")
        .replace(/&AElig;/g, "Æ")
        .replace(/&Ccedil;/g, "Ç")
        .replace(/&Egrave;/g, "È")
        .replace(/&Eacute;/g, "É")
        .replace(/&Ecirc;/g, "Ê")
        .replace(/&Euml;/g, "Ë")
        .replace(/&Igrave;/g, "Ì")
        .replace(/&Iacute;/g, "Í")
        .replace(/&Icirc;/g, "Î")
        .replace(/&Iuml;/g, "Ï")
        .replace(/&ETH;/g, "Ð")
        .replace(/&Ntilde;/g, "Ñ")
        .replace(/&Ograve;/g, "Ò")
        .replace(/&Oacute;/g, "Ó")
        .replace(/&Ocirc;/g, "Ô")
        .replace(/&Otilde;/g, "Õ")
        .replace(/&Ouml;/g, "Ö")
        .replace(/&Oslash;/g, "Ø")
        .replace(/&Ugrave;/g, "Ù")
        .replace(/&Uacute;/g, "Ú")
        .replace(/&Ucirc;/g, "Û")
        .replace(/&Uuml;/g, "Ü")
        .replace(/&Yacute;/g, "Ý")
        .replace(/&THORN;/g, "Þ")
        .replace(/&szlig;/g, "ß")
        .replace(/&agrave;/g, "à")
        .replace(/&aacute;/g, "á")
        .replace(/&acirc;/g, "â")
        .replace(/&atilde;/g, "ã")
        .replace(/&auml;/g, "ä")
        .replace(/&aring;/g, "å")
        .replace(/&aelig;/g, "æ")
        .replace(/&ccedil;/g, "ç")
        .replace(/&egrave;/g, "è")
        .replace(/&eacute;/g, "é")
        .replace(/&ecirc;/g, "ê")
        .replace(/&euml;/g, "ë")
        .replace(/&igrave;/g, "ì")
        .replace(/&iacute;/g, "í")
        .replace(/&icirc;/g, "î")
        .replace(/&iuml;/g, "ï")
        .replace(/&eth;/g, "ð")
        .replace(/&ntilde;/g, "ñ")
        .replace(/&ograve;/g, "ò")
        .replace(/&oacute;/g, "ó")
        .replace(/&ocirc;/g, "ô")
        .replace(/&otilde;/g, "õ")
        .replace(/&ouml;/g, "ö")
        .replace(/&oslash;/g, "ø")
        .replace(/&ugrave;/g, "ù")
        .replace(/&uacute;/g, "ú")
        .replace(/&ucirc;/g, "û")
        .replace(/&uuml;/g, "ü")
        .replace(/&yacute;/g, "ý")
        .replace(/&thorn;/g, "þ")
        .replace(/&yuml;/g, "ÿ")
        .replace(/&nbsp;/g, "")
        .replace(/&amp;/g, "")
        .replace(/&lt;/g, "")
        .replace(/&ge;/g, "")
        .replace(/&gt;/g, "")
        .replace(/;/g, ",")
        .replace(/&#x3D;/g, "")
        .replace(/&ndash;/g, "")
        .replace(/=/g, "")
        .replace(/<[^>]+>/gm, "")
        .replace(/=/g, "");

      var escapedFind = ";".replace(/([.*+?^=!;:${}()|\[\]\/\\])/g, "\\$1");
      valorhtml.replace(new RegExp(escapedFind, "g"), "");

      return valorhtml;
    }

    vm.dowload = dowload;

    function dowload() {
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
        UIkit.modal("#modalprogress", {
          bgclose: false,
          escclose: false,
          modal: false,
        }).show();
        var nIntervId;
        nIntervId = setInterval(vm.flasheaTexto, 200);

        reportadicional.reportRender(parameterReport).then(function (data) {
          UIkit.modal("#modalprogress", {
            bgclose: false,
            escclose: false,
            modal: false,
          }).hide();
          vm.porcent = 0;
          clearInterval(nIntervId);
        });

        vm.pruebareport = false;
      } else {
        UIkit.modal("#modalReportError").show();
        vm.pruebareport = false;
      }
    }

    function flasheaTexto() {
      vm.ind = vm.ind + 1;
      if (vm.ind === vm.total) {
        vm.total = vm.total + 10;
      }
      vm.porcent = Math.round((vm.ind * 100) / vm.total);
    }

    function changeTypeReport() {
      if (vm.typereport === 3) {
        vm.Resultfilter = -1;
        vm.Resultfilter = 0;
      } else if (vm.typereport === 1 || vm.typereport === 4) {
        vm.Resultfilter = -1;
      } else {
        vm.Resultfilter = 0;
      }
    }

    vm.changeReport = changeReport;
    function changeReport() {
      vm.modernBrowsers = [];
      vm.modernBrowsers.push(
        { id: 0, name: $filter("translate")("0767"), ticked: true }, //Ordenado
        { id: 1, name: $filter("translate")("0355"), ticked: true }, //Repetición
        { id: 2, name: $filter("translate")("0289"), ticked: true }, //Resultado
        { id: 3, name: $filter("translate")("0768"), ticked: true }, //Preliminar
        { id: 4, name: $filter("translate")("0312"), ticked: true }, //Validación
        { id: 5, name: $filter("translate")("0310"), ticked: true } //Impresión
      );

      /*if (vm.itemcomment === 3) {
        vm.modernBrowsers = [];
        vm.modernBrowsers.push({ id: 3, name: $filter('translate')('0289'), ticked: true });
      } else {
        vm.modernBrowsers = [];

        // if (vm.takesample === 'True') {
        //   vm.modernBrowsers.push({ id: 1, name: $filter('translate')('0165'), ticked: true });
        // }

        // if (vm.trazability === '2' || vm.trazability === '3') {
        //   vm.modernBrowsers.push({ id: 2, name: $filter('translate')('0208'), ticked: true });
        // }

        vm.modernBrowsers.push(
          { id: 0, name: $filter('translate')('0767'), ticked: true },//Ordenado
          { id: 1, name: $filter('translate')('0355'), ticked: true },//Repetición
          { id: 3, name: $filter('translate')('0289'), ticked: true },//Resultado
          //{ id: 3, name: $filter('translate')('0768'), ticked: true },//Preliminar
          { id: 4, name: $filter('translate')('0312'), ticked: true },//Validación
          { id: 5, name: $filter('translate')('0310'), ticked: true }//Impresión
        );
      }*/
    }

    function windowOpenReport() {
      var parameterReport = {};
      parameterReport.variables = vm.variables;
      parameterReport.pathreport = vm.pathreport;
      parameterReport.labelsreport = JSON.stringify(
        $translate.getTranslationTable()
      );
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set("parameterReport", parameterReport);
      localStorageService.set("dataReport", datareport);
      window.open("/viewreport/viewreport.html");
      vm.pruebareport = false;
    }

    function init() {
      vm.getOrderType();

      if ($filter("translate")("0000") === "esCo") {
        moment.locale("es");
      } else {
        moment.locale("en");
      }
      vm.modernBrowsers = [];

      if (vm.takesample === "True") {
        vm.modernBrowsers.push({
          id: 1,
          name: $filter("translate")("0165"),
          ticked: true,
        });
      }

      if (vm.trazability === "2" || vm.trazability === "3") {
        vm.modernBrowsers.push({
          id: 2,
          name: $filter("translate")("0208"),
          ticked: true,
        });
      }

      vm.modernBrowsers.push(
        { id: 3, name: $filter("translate")("0289"), ticked: true },
        { id: 4, name: $filter("translate")("0312"), ticked: true },
        { id: 5, name: $filter("translate")("0310"), ticked: true }
      );

      if (vm.isPricesCheckResults) {
        vm.listtype.push({ name: $filter("translate")("1283"), id: 4 });
      }
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
