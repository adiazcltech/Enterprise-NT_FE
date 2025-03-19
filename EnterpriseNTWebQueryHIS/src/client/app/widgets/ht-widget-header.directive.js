/* jshint ignore:start */
(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('echart', function ($window) {
      return {
          restrict: 'E',
          template: '<div></div>',
          replace: true,
          scope: {
              options: '=',
              data: '='
          },
          link: function (scope, element) {

              if (!scope.data) {
                  console.log('no data provided!');
                  return;
              }

              var options = scope.options,
                  elem0 = element[0];

             var chart = echarts.init(elem0);

              if (options && typeof options === 'object') {
                  options.series = scope.data;
                  chart.setOption(options, true);
              }

              scope.$watch('data', function (newData, oldData) {

                  if (oldData !== newData) {
                      chart.setOption(scope.options, true);
                      chart.setOption({
                          series: newData
                      });
                  }
              });
              scope.$watch('options', function (newData, oldData) {
                chart.setOption(scope.options, true);
                chart.hideLoading();
              });
              angular.element(window).on('resize', chart.resize);
              scope.$on('$destroy', function () {
                  angular.element(window).off('resize', chart.resize);
                  chart.dispose();
                  chart = null;
              });

          }
      };
    })
    .directive('htWidgetHeader', htWidgetHeader);

  /* @ngInject */
  function htWidgetHeader() {
    //Usage:
    //<div ht-widget-header title="vm.map.title"></div>
    // Creates:
    // <div ht-widget-header=""
    //      title="Movie"
    //      allow-collapse="true" </div>
    var directive = {
      scope: {
        'title': '@',
        'subtitle': '@',
        'rightText': '@',
        'allowCollapse': '@'
      },
      templateUrl: 'app/widgets/widget-header.html',
      restrict: 'EA',
      link: link
    };
    return directive;

    function link(scope, element, attr) {
      scope.toggleContent = function() {
        if (scope.allowCollapse === 'true') {
          var content = angular.element(element).siblings('.widget-content');
          content.toggle();
        }
      };
    }
  }
})();
/* jshint ignore:end */
