/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   Id 				@descripción
				readonly		@descripción 
		
  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE\EnterpriseNTLaboratory\src\client\app\modules\analytical\resultsentry\resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historypatient/historypatient.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
  	 Comentario...
  	 
********************************************************************************/



(function () {
	'use strict';

	angular
		.module('app.widgets')
		.filter('trust', ['$sce', function ($sce) {
			return function (htmlCode) {
				return $sce.trustAsHtml(htmlCode);
			};
		}])
		.directive('commentordermodal', commentordermodal);

	commentordermodal.$inject = ['localStorageService', 'commentsDS', '$filter'];

	/* @ngInject */
	function commentordermodal(localStorageService, commentsDS, $filter) {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/widgets/userControl/card-commentordermodal.html',
			scope: {
				type: '=type', //1-comentario de la orden // 2-comenatrio diagnostico//3 comentario microbiologia
				orderhistory: '=orderhistory', //orden
				idpatient: '=idpatient', // paciente
				viewdirectic: '=viewdirectic',
				idtest: '=idtest'
			},

			controller: ['$scope', function ($scope) {
				var vm = this;
				vm.auth = localStorageService.get('Enterprise_NT.authorizationData');
				vm.formatDate = localStorageService.get('FormatoFecha') + ', HH:mm:ss';
				vm.user = localStorageService.get('Enterprise_NT.authorizationData');
				vm.formatDateShort = 'DD/MM/YYYY';
				vm.formatTime = 'HH:mm:ss';
				vm.getcomment = getcomment;
				vm.notes = [];
				vm.type = $scope.type === undefined ? 1 : $scope.type;
				vm.getcommentpatient = getcommentpatient;
				vm.label = vm.type === 1 ? $filter('translate')('0465') : vm.type === 2 ? $filter('translate')('0464') : $filter('translate')('0466');
				vm.getcommentMicrobiology = getcommentMicrobiology;

				$scope.$watch('viewdirectic', function () {
					if ($scope.viewdirectic === true) {
						if (vm.type === 1) {
							vm.orderhistory = $scope.orderhistory;
							vm.getcomment();
						} else if (vm.type === 2) {
							vm.idpatient = $scope.idpatient;
							vm.getcommentpatient();
						} else {
							vm.orderhistory = $scope.orderhistory;
							vm.idtest = $scope.idtest;
							vm.getcommentMicrobiology();
						}
					}
					$scope.viewdirectic = false;
				});

				function getcommentMicrobiology() {
					vm.loading = true;
					commentsDS.getCommentsMicrobiologyTest(vm.auth.authToken, vm.orderhistory, vm.idtest).then(function (data) {
						vm.loading = false;
						if (data.status === 200) {
							var notes = data.data.length === 0 ? [] : removenotes(data.data);
							vm.notes = _.orderBy(notes, ['lastTransaction'], ['desc']);
						} else {
							vm.notes = [];
						}
					});
				}


				function getcomment() {
					vm.loading = true;
					vm.notes = [];
					commentsDS.getCommentsOrder(vm.auth.authToken, vm.orderhistory).then(function (data) {
						vm.loading = false;
						if (data.status === 200) {
							var notes = data.data.length === 0 ? [] : removenotes(data.data);
							vm.notes = _.orderBy(notes, ['lastTransaction'], ['desc']);
						} else {
							vm.notes = [];
						}
					});
				}
				function getcommentpatient() {
					vm.loading = true;
					vm.notes = [];
					commentsDS.getCommentsPatient(vm.auth.authToken, vm.idpatient).then(function (data) {
						vm.loading = false;
						if (data.status === 200) {
							var notes = data.data.length === 0 ? [] : removenotes(data.data);
							vm.notes = _.orderBy(notes, ['lastTransaction'], ['desc']);
						} else {
							vm.notes = [];
						}
					});
				}
				function removenotes(data) {
					data.forEach(function (value, key) {
						var firshC = JSON.parse(data[key].comment).content.substring(0, 1);
						var pos = firshC === '"' ? 1 : 0;
						var content = JSON.parse(data[key].comment).content;
						data[key].commentArray = JSON.parse(data[key].comment);
						data[key].commentArray.content = content.substring(pos, content.length - pos);
						data[key].permissionEdit = data[key].user.id === localStorageService.get('Enterprise_NT.authorizationData').id;
						data[key].print = value.print === undefined ? false : value.print;
					});
					return data;
				}
			}],
			controllerAs: 'commentordermodal'
		};
		return directive;
	}
})();
