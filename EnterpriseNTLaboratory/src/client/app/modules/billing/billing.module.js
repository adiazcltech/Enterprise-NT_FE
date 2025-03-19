(function () {
  'use strict';

  angular.module('app.billing', [
   'app.laterpayment',
   'app.generateinvoice',
   'app.creditnote',
   'app.recalculated',
   'app.cashreport',
   'app.printinvoice',
   'app.consultrips',
   'app.changeprices'
  ]);
})();
