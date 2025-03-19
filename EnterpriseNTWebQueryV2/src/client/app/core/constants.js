/* global toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('toastr', toastr)
    .constant('productVersion', { webconsultation: '1.2.14' })
    .constant('moment', moment);
})();
