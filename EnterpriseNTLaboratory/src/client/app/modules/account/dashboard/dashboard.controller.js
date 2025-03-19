/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('dashboardController', dashboardController);


  dashboardController.$inject = ['localStorageService', 'logger',
    'widgetsDS', '$filter', 'moment', '$rootScope', 'shortcutsDS', 'moduleDS', '$state'
  ];

  function dashboardController(localStorageService,
    logger, widgetsDS, $filter, moment, $rootScope, shortcutsDS, moduleDS, $state) {

    var vm = this;
    vm.title = 'Dashboard';
    vm.isAuthenticate = isAuthenticate;
    vm.viewmenu = false;
    vm.init = init;
    $rootScope.NamePage = $filter('translate')('1134');
    $rootScope.menu = true;
    vm.changeviewmodule = changeviewmodule;
    vm.routerMicrobiology = routerMicrobiology;
    vm.getShortCuts = getShortCuts;
    vm.permissionmodule = permissionmodule;
    vm.getWidgets = getWidgets;
    vm.getnamedays = getnamedays;
    vm.moduleSelect = moduleSelect;
    vm.onEndAnimation = onEndAnimation;
    vm.resetPage = resetPage;
    vm.manageCashbox = parseInt(localStorageService.get('Facturacion')) > 0;
    $rootScope.pageview = 2;
    vm.PAT = false;
    vm.LIS = true;
    vm.FAC = localStorageService.get('FAC') && vm.manageCashbox;
    vm.userAdmin=localStorageService.get('Enterprise_NT.authorizationData').administrator;
    
    vm.MMB = true;

    vm.listAcces = [];

    var current = 0,
      isAnimating = false,
      endCurrPage = false,
      endNextPage = false,
      animEndEventNames = {
        'WebkitAnimation': 'webkitAnimationEnd',
        'OAnimation': 'oAnimationEnd',
        'msAnimation': 'MSAnimationEnd',
        'animation': 'animationend'
      },
      // animation end event name
      animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
      // support css animations
      support = Modernizr.cssanimations;

    vm.listviewmodule = {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false,
      '6': false,
      '7': false,
      '8': false,
      '9': false,
      '10': false,
      '11': false,
      '12': false,
      '13': false,
      '14': false,
      '19': false,
      '20': false
    };

    vm.datasample = [];
    vm.optionsSample = {
      animation: true,
      color: ['#80de66', '#DCDDDB'],
      tooltip: {},
      title: {
        text: $filter('translate')('0451'),
        x: 'center',
        y: -10,
        textStyle: {
          fontSize: 12,
          fontWeight: 'bolder',
          color: '#333'
        }
      }

    };

    vm.optionsTest = {
      title: {
        text: $filter('translate')('0013'),
        x: 'center',
        y: -10,
        textStyle: {
          fontSize: 12,
          fontWeight: 'bolder',
          color: '#333'
        }
      },
      grid: [{
        x: 5,
        y: 20,
        x2: 50,
        y2: 15,
        width: '50%'
      }],
      dataZoom: {
        show: false,
        start: 0,
        end: 1
      },
      tooltip: {
        formatter: function (params) {
          return params.value;
        }
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        y: 20,
        padding: 10,
        itemGap: 1,
        itemWidth: 8,
        itemHeight: 8,
        data: [$filter('translate')('0435'), $filter('translate')('0436'), $filter('translate')('0437')],
        textStyle: {
          fontSize: 10
        }
      },
      xAxis: [{
        type: 'category',
        data: [$filter('translate')('0435'), $filter('translate')('0436'), $filter('translate')('0437')],
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: true
        },
        splitLine: {
          show: true
        }
      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: true
        },
        splitLine: {
          show: true
        }
      }]
    };
    vm.datatest = [];

    vm.optionsDays = {
      title: {
        text: $filter('translate')('1135'),
        x: 'center',
        y: -10,
        textStyle: {
          fontSize: 12,
          fontWeight: 'bolder',
          color: '#333'
        }
      },
      tooltip: {},
      grid: [{
        x: 5,
        y: 20,
        x2: 50,
        y2: 15,
        width: '50%'
      }],
      dataZoom: {
        show: false,
        start: 0,
        end: 1
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        y: 7,
        itemHeight: 2,
        padding: 10,
        itemGap: 1,
        itemWidth: 8,
        data: [],
        textStyle: {
          fontSize: 10
        },
      },
      xAxis: [{
        type: 'category',
        data: [],
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: true
        },
        splitLine: {
          show: true
        }

      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: true
        },
        splitLine: {
          show: true
        }
      }]
    };
    vm.dataDays = [];

    vm.optionsWeeks = {
      title: {
        text: $filter('translate')('1136'),
        x: 'center',
        y: -10,
        textStyle: {
          fontSize: 12,
          fontWeight: 'bolder',
          color: '#333'
        }
      },
      calculable: true,
      tooltip: {},
      grid: [{
        x: 5,
        y: 20,
        x2: 50,
        y2: 15,
        width: '50%'
      }],
      dataZoom: {
        show: false,
        start: 0,
        end: 1
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        y: 10,
        itemHeight: 2,
        padding: 5,
        itemGap: 1,
        itemWidth: 10,
        data: [],
        textStyle: {
          fontSize: 10
        },
      },
      xAxis: [{
        type: 'category',
        data: [],
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: true
        },
        splitLine: {
          show: true
        }

      }],
      yAxis: [{
        type: 'value',
        position: 'left',
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: true
        },
        splitLine: {
          show: true
        }
      }]
    };
    vm.dataWeeks = [];

    function getShortCuts() {
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return shortcutsDS.getShortcutsList(auth.authToken, auth.id).then(function (data) {
        if (data.status === 200) {
          vm.listAcces = data.data;
        }
        vm.permissionmodule();
        vm.viewmenu = true;
      }, function (error) {
        if (error.data === null) {
          logger.error(error);
        }
      });
    }
    function permissionmodule() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth !== undefined) {
        return moduleDS.getModuleMasterUser(auth.authToken, auth.id).then(function (data) {
          if (data.status === 200) {
            vm.listpagepermission = data.data;
            vm.trazability = localStorageService.get("Trazabilidad");
            vm.phlebotomistake = localStorageService.get("Manejodepuntodetomamuestra")==='True';
            vm.growtmicrobiology = localStorageService.get("SiembraMicrobiologia");
            vm.usersNotification = localStorageService.get("notificacionUsuarios");
            vm.FAC = localStorageService.get('FAC') && parseInt(localStorageService.get('Facturacion')) > 0;
            vm.PAT = localStorageService.get('Patologia') === 'True';
            vm.TRASN = localStorageService.get('ActivarTransplantes') === 'True';
            vm.LIS = localStorageService.get('DisableLIS') === 'False' || localStorageService.get('DisableLIS') === null;
            vm.userAdmin=localStorageService.get('Enterprise_NT.authorizationData').administrator;
            var count = 0
            if (vm.LIS) {
              count = count + 1
            }
            if (vm.FAC) {
              count = count + 1
            }
            if (vm.MMB) {
              count = count + 1
            }
            if (vm.PAT) {
              count = count + 1
            }
            if (vm.TRASN) {
              count = count + 1
            }
            vm.count = count;
            if (vm.usersNotification !== '' && vm.usersNotification !== undefined && vm.usersNotification !== null) {
              UIkit.modal("#notificacionUsuarios").show();
            }
            vm.getWidgets();
          }
        }, function (error) {
          if (error.data === null) {
            logger.error(error);
          }
        });
      }
    }
    function getWidgets() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return widgetsDS.getWidgetMenu(auth.authToken, moment().format('YYYYMMDD')).then(function (data) {
        if (data.status === 200) {
          vm.datasample = [{
            data: [{
              value: data.data.sampleVerified === 0 ? '' : data.data.sampleVerified,
              name: $filter('translate')('1137'),
              tooltip: {
                formatter: function (params) {
                  return params.value;
                }
              }
            },
            {
              value: data.data.sampleEntry - data.data.sampleVerified,
              name: $filter('translate')('0629'),
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },

                }
              },
              tooltip: {
                formatter: function (params) {
                  return data.data.sampleEntry;
                }
              }
            }
            ],
            type: 'pie',
            radius: '55%',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'outer',
                  textStyle: {
                    fontSize: 10,
                    baseline: 'middle',
                    align: 'right'
                  },
                },
                labelLine: {
                  show: true,
                  length: 2
                },

              },
              emphasis: {
                label: {
                  show: true
                },
                labelLine: {
                  show: true,
                  length: 10
                }
              }
            }
          }];

          vm.datatest = [{
            name: $filter('translate')('0435'),
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#7eb6ff'
              }
            },
            data: [data.data.sampleByTestEntry]
          },
          {
            name: $filter('translate')('0436'),
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#66deb3'
              }
            },
            data: [data.data.sampleByTestValidated]
          },
          {
            name: $filter('translate')('0437'),
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#d2b4de'
              }
            },
            data: [data.data.sampleByTestPrinted]
          }
          ];

          /* GRAFICA DE TENDENCIA DEL DIA  */

          var day1 = moment().subtract(7, 'days').format('DD/MM');
          var day2 = moment().subtract(14, 'days').format('DD/MM');
          var day3 = moment().subtract(21, 'days').format('DD/MM');
          var day4 = moment().subtract(28, 'days').format('DD/MM');
          var day5 = moment().subtract(35, 'days').format('DD/MM');

          vm.optionsDays.legend.data[0] = day1;
          vm.optionsDays.legend.data[1] = day2;
          vm.optionsDays.legend.data[2] = day3;
          vm.optionsDays.legend.data[3] = day4;
          vm.optionsDays.legend.data[4] = day5;

          vm.optionsDays.xAxis[0].data[0] = day1;
          vm.optionsDays.xAxis[0].data[1] = day2;
          vm.optionsDays.xAxis[0].data[2] = day3;
          vm.optionsDays.xAxis[0].data[3] = day4;
          vm.optionsDays.xAxis[0].data[4] = day5;

          vm.dataDays = [{
            name: day1,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#f5b7b1'
              }
            },
            data: [data.data.ordersByWeeks[4]]
          },
          {
            name: day2,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#d2b4de'
              }
            },
            data: [data.data.ordersByWeeks[3]]
          },
          {
            name: day3,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#aed6f1'
              }
            },
            data: [data.data.ordersByWeeks[2]]
          },
          {
            name: day4,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#a2d9ce'
              }
            },
            data: [data.data.ordersByWeeks[1]]
          },
          {
            name: day5,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#abebc6'
              }
            },
            data: [data.data.ordersByWeeks[0]]
          }
          ];

          vm.optionsDays.tooltip = {
            formatter: function (params) {
              return params.value;
            }
          };


          /* GRAFICA DE TENDENCIA DE LA SEMANA  */

          var day1 = vm.getnamedays(1) + ' ' + moment().subtract(1, 'days').format('DD/MM');
          var day2 = vm.getnamedays(2) + ' ' + moment().subtract(2, 'days').format('DD/MM');
          var day3 = vm.getnamedays(3) + ' ' + moment().subtract(3, 'days').format('DD/MM');
          var day4 = vm.getnamedays(4) + ' ' + moment().subtract(4, 'days').format('DD/MM');
          var day5 = vm.getnamedays(5) + ' ' + moment().subtract(5, 'days').format('DD/MM');
          var day6 = vm.getnamedays(6) + ' ' + moment().subtract(6, 'days').format('DD/MM');
          var day7 = vm.getnamedays(7) + ' ' + moment().subtract(7, 'days').format('DD/MM');



          vm.optionsWeeks.legend.data[0] = day1;
          vm.optionsWeeks.legend.data[1] = day2;
          vm.optionsWeeks.legend.data[2] = day3;
          vm.optionsWeeks.legend.data[3] = day4;
          vm.optionsWeeks.legend.data[4] = day5;
          vm.optionsWeeks.legend.data[5] = day6;
          vm.optionsWeeks.legend.data[6] = day7;

          vm.optionsWeeks.xAxis[0].data[0] = day1;
          vm.optionsWeeks.xAxis[0].data[1] = day2;
          vm.optionsWeeks.xAxis[0].data[2] = day3;
          vm.optionsWeeks.xAxis[0].data[3] = day4;
          vm.optionsWeeks.xAxis[0].data[4] = day5;
          vm.optionsWeeks.xAxis[0].data[5] = day6;
          vm.optionsWeeks.xAxis[0].data[6] = day7;

          vm.optionsWeeks.tooltip = {
            formatter: function (params) {
              return params.value;
            }
          };

          vm.dataWeeks = [{
            name: day1,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#f5b7b1'
              }
            },
            data: [data.data.ordersByDays[6]]
          },
          {
            name: day2,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#d2b4de'
              }
            },
            data: [data.data.ordersByDays[5]]
          },
          {
            name: day3,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#aed6f1'
              }
            },
            data: [data.data.ordersByDays[4]]
          },
          {
            name: day4,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#a2d9ce'
              }
            },
            data: [data.data.ordersByDays[3]]
          },
          {
            name: day5,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#abebc6'
              }
            },
            data: [data.data.ordersByDays[2]]
          },
          {
            name: day6,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#f9e79f'
              }
            },
            data: [data.data.ordersByDays[1]]
          },
          {
            name: day7,
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#d98880'
              }
            },
            data: [data.data.ordersByDays[0]]
          }
          ];
        }
        vm.viewmenu = true;
        vm.loading = false;
        var permissionuser = localStorageService.get('user');
        if (permissionuser.transplantManagement === 1) {
          vm.module = 4;
        } else {
          vm.module = 0;
        }
        setTimeout(function () {
          vm.main = $('#pt-main');
          vm.pages = vm.main.children('div.pt-page');
          vm.permissionuser = localStorageService.get('user');
          vm.pages.each(function () {
            var page = $(this);
            page.data('originalClassList', page.attr('class'));
          });
          vm.pages.eq(current).addClass('pt-page-current');
          if (vm.permissionuser.transplantManagement === 1) {
            vm.moduleSelect(4);
          }
        }, 500);

      }, function (error) {
        if (error.data === null) {
          logger.error(error);
        }
      });
    }
    function getnamedays(day) {
      var day = day === undefined ? moment().day() : moment().subtract(day, 'days').day()
      switch (day) {
        case 1:
          return day = $filter('translate')('1126');
        case 2:
          return day = $filter('translate')('1127');
        case 3:
          return day = $filter('translate')('1128');
        case 4:
          return day = $filter('translate')('1129');
        case 5:
          return day = $filter('translate')('1130');
        case 6:
          return day = $filter('translate')('1131');
        default:
          return day = $filter('translate')('1132');
      }
    }
    function changeviewmodule(module, idpage, view) {
      if (view === 1) {
        vm.listviewmodule[module] = false;
      } else {
        if (_.filter(vm.listpagepermission, function (o) {
          return o.id === idpage;
        }).length > 0) {
          if (vm.permissionuser.printInReports === false && idpage === 205) {
            vm.listviewmodule[module] = false;
          } else {
            vm.listviewmodule[module] = true;
          }

        }
      }
    }
    function routerPathology(idpage, url) {
      if (_.filter(vm.listpagepermission, function (o) {
        return o.id === idpage;
      }).length > 0) {
        $state.go(url);
      }
    }
    function routerMicrobiology(idpage, url) {
      if (_.filter(vm.listpagepermission, function (o) {
        return o.id === idpage;
      }).length > 0) {
        $state.go(url);
      }
    }
    function moduleSelect(page) {
      vm.module = page;
      isAnimating = true;
      if (current !== page) {
        var currPage = vm.pages.eq(current);
        var nextPage = vm.pages.eq(page).addClass('pt-page-current'),
          outClass = '',
          inClass = '';

        outClass = 'pt-page-rotateSlideOut';
        inClass = 'pt-page-rotateSlideIn';

        currPage.addClass(outClass).on(animEndEventName, function () {
          currPage.off(animEndEventName);
          endCurrPage = true;
          if (endNextPage) {
            vm.onEndAnimation(currPage, nextPage);
          }
        });

        nextPage.addClass(inClass).on(animEndEventName, function () {
          nextPage.off(animEndEventName);
          endNextPage = true;
          if (endCurrPage) {
            vm.onEndAnimation(currPage, nextPage);
          }
        });

        if (!support) {
          vm.onEndAnimation(currPage, nextPage);
        }
        current = page;
      }

    }
    function onEndAnimation(outpage, inpage) {
      endCurrPage = false;
      endNextPage = false;
      vm.resetPage(outpage, inpage);
      isAnimating = false;
    }
    function resetPage(outpage, inpage) {
      outpage.attr('class', outpage.data('originalClassList'));
      inpage.attr('class', inpage.data('originalClassList') + ' pt-page-current');
    }
    function init() {
      vm.loading = true;
      vm.getShortCuts();
      vm.viewsocket = localStorageService.get("socket") === "True" || localStorageService.get("socket") === "";
    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
