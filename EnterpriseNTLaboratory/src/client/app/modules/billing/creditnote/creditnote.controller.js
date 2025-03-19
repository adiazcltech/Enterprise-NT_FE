/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.creditnote')
    .config(function ($mdDateLocaleProvider) {
      var format;
      if (localStorage.getItem('ls.FormatoFecha') !== null) {
        var formatDate = ((localStorage.getItem('ls.FormatoFecha')).toUpperCase()).slice(1, 11);
        if (formatDate === 'DD/MM/YYYY') {
          format = 'DD/MM/YYYY';
        } else if (formatDate === 'DD-MM-YYYY') {
          format = 'DD-MM-YYYY';
        } else if (formatDate === 'DD.MM.YYYY') {
          format = 'DD.MM.YYYY';
        } else if (formatDate === 'MM/DD/YYYY') {
          format = 'MM/DD/YYYY';
        } else if (formatDate === 'MM-DD-YYYY') {
          format = 'MM-DD-YYYY';
        } else if (formatDate === 'MM.DD.YYYY') {
          format = 'MM.DD.YYYY';
        } else if (formatDate === 'YYYY/MM/DD') {
          format = 'YYYY/MM/DD';
        } else if (formatDate === 'YYYY-MM-DD') {
          format = 'YYYY-MM-DD';
        } else if (formatDate === 'YYYY.MM.DD') {
          format = 'YYYY.MM.DD';
        }
      } else {
        format = 'DD/MM/YYYY';
      }

      $mdDateLocaleProvider.formatDate = function (date) {
        return date ? moment(date).format(format) : '';
      };
      $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, format, true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };


    })
    .controller('creditnoteController', creditnoteController);
  creditnoteController.$inject = ['localStorageService', '$filter', '$state', 'moment', '$rootScope', 'cashboxDS', 'logger'];
  function creditnoteController(localStorageService, $filter, $state, moment, $rootScope, cashboxDS, logger) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'creditnote';
    $rootScope.menu = true;
    $rootScope.pageview = 3;
    $rootScope.NamePage = $filter('translate')('1576');
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    vm.simbolmoney = localStorageService.get('SimboloMonetario') === "" || localStorageService.get('SimboloMonetario') === null ? "$" : localStorageService.get('SimboloMonetario');
    vm.isPenny = localStorageService.get('ManejoCentavos') === 'True' ? 'n2' : 'n0';
    vm.decimal = localStorageService.get('ManejoCentavos') === 'True' ? 2 : 0;
    $rootScope.helpReference = '08.billing/creditnote.htm';
    vm.modalError = modalError;
    vm.dateToSearch = moment().format();
    vm.maxDate = new Date();
    vm.creditnote = creditnote;
    vm.formatDateHours = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
    vm.comment = '';
    vm.getinvoice = getinvoice;
    vm.searchByDate = searchByDate;
    vm.detail = [];
    vm.maxdinner = 0;
    vm.customMenu = {
      menubar: false,
      language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
      br_newline_selector: true,
      force_br_newlines: true,
      force_p_newlines: false,
      forced_root_block: false,
      convert_newlines_to_brs: true,
      plugins: [
        'link',
        'lists',
        'autolink',
        'anchor',
        'textcolor',
        'charmap'

      ],
      toolbar: [
        'undo redo | bold italic underline superscript | fontselect fontsizeselect forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent code '
      ],
      height: 170
    };
    function searchByDate() {
      if (vm.dateToSearch !== null) {
        vm.dateToSearch = new Date(vm.dateToSearch);
      } else {
        vm.dateToSearch = null;
      }
    }

    function creditnote() {
      var creditnote = {
        "invoiceNumber": vm.bill,
        "dateOfNote": new Date(moment(vm.dateToSearch).format()).getTime(),
        "cancellationReason": vm.comment,
        "value": vm.detail.length === 1 ? vm.notevalue : vm.maxdinner,
        "type": 1
      }
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return cashboxDS.createCreditNote(auth.authToken, creditnote).then(function (data) {
        logger.info($filter('translate')('1617') + ' ' + data.data);
        vm.getinvoice();
        if (data.status === 200) {
          logger.success($filter('translate')('0149'));
        }
      },
      function (error) {
        vm.loading = false;
        vm.dataerror = '';
        if (error.data !== null) {
          if (error.data.code === 2) {
            error.data.errorFields.forEach(function (value) {
              var item = value.split('|');
              if (item[0] === '1' && item[1] === 'The value of the credit note exceeds the value of the invoice.') {
                vm.dataerror = $filter('translate')('2013');
              }
              if (item[0] === '1' && item[1] === 'The value of the invice is 0') {
                vm.dataerror = $filter('translate')('2014');
              }
            });
            UIkit.modal("#modal-error").show();
          }
        }
        if (vm.dataerror === '') {
          vm.modalError(error);
        };
      });
    }

    function getinvoice($event) {
      var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      if (keyCode === 13) {
        if (vm.bill !== '' && vm.bill !== undefined) {
          vm.detail = [];
          vm.reserve = null;
          vm.notevalue = null;
          vm.maxdinner = 0;
          vm.comment = "";
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return cashboxDS.getinvoicedetail(auth.authToken, vm.bill).then(function (data) {
            if (data.status === 200) {
              vm.detail = data.data.invoiceHeader;
              vm.invoice = data.data;
              vm.maxdinner = data.data.total;
              data.data.dateOfInvoice = moment(data.data.dateOfInvoice).format(vm.formatDate);
              data.data.dueDate = moment(data.data.dueDate).format(vm.formatDate);
              data.data.formOfPay = vm.invoice.formOfPayment === 1 ? $filter('translate')('2006') : $filter('translate')('2007');
              var datebillin = data.data.billingPeriod.split(' - ')
              var init = datebillin[0];
              var end = datebillin[1];
              vm.invoice.billingPeriod = moment(init).format(vm.formatDate) + ' al ' + moment(end).format(vm.formatDate)
            } else {
              UIkit.modal('#nofoundfilter').show();
            }
          },
            function (error) {
              vm.modalError(error);
            });
        }
      }
    }
    function init() {
    }
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

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
