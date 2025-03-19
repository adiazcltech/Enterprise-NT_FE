/* Se encontro directiva en:
	listed.html:
*/
/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   id
				disabled		 @descripción
				listlaboratories @descripción
				datalaboratory	 @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/listed/listed.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/
/* jshint ignore:start */
(function () {
	'use strict';

	angular
		.module('app.widgets')
		.directive('filterlaboratory', filterlaboratory);

	filterlaboratory.$inject = ['$filter', 'laboratoryDS', 'localStorageService'];

	/* @ngInject */
	function filterlaboratory($filter, laboratoryDS, localStorageService) {
		var directive = {
			restrict: 'EA',

			templateUrl: 'app/widgets/userControl/filter-laboratory.html',

			scope: {
				id: '=id',
				disabled: '=?disabled',
				listlaboratories: '=listlaboratories',
				datalaboratory: '=datalaboratory'
			},

			controller: ['$scope', function ($scope) {
				var vm = this;

				vm.getLaboratory = getLaboratory;
				vm.clickfilterByLaboratory = clickfilterByLaboratory;
				vm.loadDataLaboratory = loadDataLaboratory;
				vm.validAddTag = validAddTag;
				vm.validRemoveTag = validRemoveTag;
				vm.dataLaboratory = [];
				vm.filterLaboratories = [];
				vm.activeFilterLaboratory = true;
				$scope.listlaboratories = [];

				vm.id = $scope.id === undefined ? '' : $scope.id;

				var auth = localStorageService.get('Enterprise_NT.authorizationData');


				$scope.$watch('disabled', function () {
					vm.disabled = $scope.disabled;
				});

				vm.getLaboratory();

				//** Método que obtiene la lista para llenar la grilla**//
				function getLaboratory() {
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.ListLaboratories = [];
					return laboratoryDS.getLaboratory(auth.authToken).then(function (data) {
						data.data.forEach(function (value) {
							vm.ListLaboratories.push({ 'id': value.id, 'code': value.code, 'name': value.code + ' | ' + value.name, 'icon': 'group_work', 'v': '|' });
						});
						vm.dataLaboratory = vm.activeFilterLaboratory ? vm.ListLaboratories : [];
						$scope.datalaboratory = vm.dataLaboratory;
					}, function (error) {
						vm.modalError();
					});
				}


				function clickfilterByLaboratory() {
					vm.dataLaboratory = !vm.activeFilterLaboratory ? vm.ListLaboratories : [];
					vm.filterLaboratories = [];
					$scope.listlaboratories = [];
				}


				function loadDataLaboratory(tag) {
					return $filter('filter')(vm.dataLaboratory, { name: tag }, false);
				}

				function validAddTag(tag, list) {
					var datafilter = $filter('filter')(vm.dataLaboratory, { name: tag.name }, false);
					if (datafilter.length === 0) {
						var can = list.length - 1;
						list.splice(can, 1);
					}
					if (!vm.activeFilterLaboratory) {
						$scope.listlaboratories = [];
					} else {
						$scope.listlaboratories.push(tag.id);
					}

				}

				function validRemoveTag(tag, list) {
					var index = $scope.listlaboratories.indexOf(tag.id);
					if (index > -1) $scope.listlaboratories.splice(index, 1);
				}
			}],
			controllerAs: 'filterlaboratory'
		};
		return directive;
	}
})();
/* jshint ignore:end */


