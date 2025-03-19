(function() {
  'use strict';

  angular.module('app', [
    'app.core',
    'app.widgets',
    'app.layout',
    'app.account',   
    'app.configuration',
    'kendo.directives',
    'summernote'
  ]).constant('variables', {
      header_main_height: 48,
      easing_swiftOut: [ 0.4,0,0.2,1 ],
      bez_easing_swiftOut: $.bez([ 0.4,0,0.2,1 ])
  });

})();

