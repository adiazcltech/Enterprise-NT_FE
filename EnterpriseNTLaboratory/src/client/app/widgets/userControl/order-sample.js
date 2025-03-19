/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...  
  PARAMETROS: 	disabled 		@descripción
				order 			@descripción
				sample 			@descripción
				size 			@descripción
				classdanger 	@descripción
				functionexecute @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/simpleverification/simpleverification.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/takesample/takesample.html
  7.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/tuberack/tuberack.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
	 Comentario...

********************************************************************************/

(function () {
	'use strict';

	angular
		.module('app.widgets')
		.directive('ordersample', ordersample);

	ordersample.$inject = ['localStorageService'];

	/* @ngInject */
	function ordersample(localStorageService) {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/widgets/userControl/order-sample.html',
			scope: {
				id: '=?id',
				disabled: '=?disabled',
				order: '=?order',
				sample: '=sample',
				size: '=size',
				classdanger: '=classdanger',
				functionexecute: '=functionexecute'
			},

			controller: ['$scope', function ($scope) {

				var vm = this;
				vm.id = $scope.id === undefined ? 'verification' : $scope.id;
				vm.keyselect = keyselect;
				vm.digitsorder = localStorageService.get('DigitosOrden');
				vm.amountdigits = parseInt(vm.digitsorder);
				vm.amountdigitswrite = 4 + vm.amountdigits;
				vm.DigitYear = parseInt(localStorageService.get('DigitoAño'));
				vm.amountdigitsinsample = 4 + vm.amountdigits + vm.DigitYear;
				vm.numerorder = 8 + vm.amountdigits;
				vm.sampletab = localStorageService.get('SeparadorMuestra');

				vm.entry = '';
				angular.element('#' + vm.id).focus();
				vm.styleButton = $scope.size === undefined ? '' : $scope.size + 'px';

				$scope.$watch('disabled', function () {
					vm.disabled = $scope.disabled;
				});

				$scope.$watch('classdanger', function () {
					vm.classdanger = $scope.classdanger;
				});

				$scope.$watch('order', function () {
					if ($scope.order === '' || $scope.order === undefined) {
						vm.entry = '';
					}
					else if (vm.entry === '') {
						if ($scope.order !== '' && $scope.order !== undefined && $scope.sample !== '' && $scope.sample !== undefined) {
							vm.entry = (parseInt($scope.order)) + vm.sampletab + (parseInt($scope.sample));
							$scope.functionexecute();
						} else {
							vm.entry = (parseInt($scope.order)) + vm.sampletab;
						}
					}
				});

				function keyselect($event) {
					vm.menssageinformative = '';
					var keyCode = $event.which || $event.keyCode;
					if (keyCode === 13) {
						var validated = true;
						vm.variable = [];
						vm.ValorOrden = vm.entry;
						var year = moment().format('YYYY');
						if (vm.sampletab === "") {
							if (vm.ValorOrden.length === vm.amountdigitsinsample) {
								if (vm.DigitYear === 0) {
									vm.separavalorOrden = [year + vm.ValorOrden, '']
								}
								if (vm.DigitYear === 1) {
									vm.separavalorOrden = [year.slice(0, 3) + vm.ValorOrden, '']
								}
								if (vm.DigitYear === 2) {
									vm.separavalorOrden = [year.slice(0, 2) + vm.ValorOrden, '']
								}
								if (vm.DigitYear === 3) {
									vm.separavalorOrden = [year.slice(0, 1) + vm.ValorOrden, '']
								}
							} else if (vm.ValorOrden.length < vm.amountdigitsinsample) {
								vm.separavalorOrden = [vm.ValorOrden, '']
							} else {
								var valuesample = vm.ValorOrden.slice(vm.amountdigitsinsample, vm.ValorOrden.length);
								var orden = vm.ValorOrden.slice(0, vm.amountdigitsinsample);
								if (valuesample.length < 4) {
									if (vm.DigitYear === 0) {
										orden = year + orden
									}
									if (vm.DigitYear === 1) {
										orden = year.slice(0, 3) + orden
									}
									if (vm.DigitYear === 2) {
										orden = year.slice(0, 2) + orden
									}
									if (vm.DigitYear === 3) {
										orden = year.slice(0, 1) + orden
									}
								} else {
									validated = false;
								}
								vm.separavalorOrden = [orden, valuesample];
							}
						} else {
							vm.separavalorOrden = vm.ValorOrden.split(vm.sampletab);
						}
						if (validated) {
							vm.codeorder = vm.separavalorOrden[0];
							var repeticiones = parseInt(vm.digitsorder) - vm.codeorder.length;
							if (repeticiones > 0) {
								var ceros = '';
								for (var i = 0; i < repeticiones; i++) {
									ceros = ceros + 0;
								}
								vm.codeorder = ceros + vm.codeorder;
							}
							if (vm.codeorder.length === vm.amountdigits + 8) {
								vm.codeorder = vm.codeorder;
							} else if (vm.codeorder.length === vm.amountdigits + 1) {
								vm.codeorder = year + moment().format('MM') + '0' + vm.codeorder;
							} else if (vm.codeorder.length === vm.amountdigits + 2) {
								vm.codeorder = year + moment().format('MM') + vm.codeorder;
							} else if (vm.codeorder.length === vm.amountdigits + 3) {
								vm.codeorder = year + '0' + vm.codeorder;
							} else if (vm.codeorder.length === vm.amountdigits + 4) {
								vm.codeorder = year + vm.codeorder;
							} else if (vm.codeorder.length === vm.amountdigits + 5) {
								vm.codeorder = moment().format('YYYY').slice(0, 3) + vm.codeorder;
							} else if (vm.codeorder.length === vm.amountdigits + 6) {
								vm.codeorder = moment().format('YYYY').slice(0, 2) + vm.codeorder;
							} else if (vm.codeorder.length === vm.amountdigits + 7) {
								vm.codeorder = moment().format('YYYY').slice(0, 1) + vm.codeorder;
							} else if (vm.codeorder.length === vm.amountdigits) {
								vm.codeorder = year + moment().format('MM') + moment().format('DD') + vm.codeorder;
							}
							var order = vm.codeorder.slice(0, vm.numerorder)
							if (vm.separavalorOrden[1] === '' || vm.separavalorOrden[1] === undefined) {
								vm.entry = order + vm.sampletab;
								$scope.order = order;
								$scope.sample = '';
							}
							else {
								vm.entry = order + vm.sampletab + vm.separavalorOrden[1];
								$scope.order = order;
								$scope.sample = vm.separavalorOrden[1];
							}
							setTimeout(function () {
								$scope.functionexecute();
								if (vm.separavalorOrden[1] !== '' || vm.separavalorOrden[1] !== undefined) {
									angular.element('#' + vm.id).select();
								}
							}, 100);

						} else {
							vm.entry = vm.separavalorOrden[0] + vm.sampletab + vm.separavalorOrden[1];
							$scope.order = vm.separavalorOrden[0];
							$scope.sample = vm.separavalorOrden[1];
							setTimeout(function () {
								$scope.functionexecute();
								if (vm.separavalorOrden[1] !== '' || vm.separavalorOrden[1] !== undefined) {
									angular.element('#' + vm.id).select();
								}
							}, 100);
						}

					} else {
						vm.entry = vm.entry.replace('NaN.', '');

						var expreg = new RegExp('^\\d+[' + vm.sampletab + ']?\\d*$');
						if (!expreg.test(vm.entry + String.fromCharCode(keyCode))) {
							//detener toda accion en la caja de texto
							$event.preventDefault();
						}
					}

				}


			}],
			controllerAs: 'ordersample'
		};
		return directive;
	}
})();
/* jshint ignore:end */


