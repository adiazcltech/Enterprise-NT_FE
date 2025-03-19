/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   id   @descripción

  AUTOR:        @autor
  FECHA:        2021-05-27
  IMPLEMENTADA EN:

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/
/* jshint ignore:start */
(function () {
	'use strict';

	angular
		.module('app.widgets')
		.directive('filterstudytype', filterstudytype);

	filterstudytype.$inject = ['$q', '$filter', 'testDS', 'studyTypeDS', 'localStorageService', 'worksheetsDS'];

	/* @ngInject */
	function filterstudytype($q, $filter, testDS, studyTypeDS, localStorageService, worksheetsDS) {
		var directive = {
			restrict: 'EA',

			templateUrl: 'app/widgets/pathology/study-filter.html',
      scope: {
				id: '=id',
				numfilter: '=numfilter',
				liststudies: '=liststudies',
				numlist: '=numlist',
				state: '=state',
			},
			controller: ['$scope', function ($scope) {
				var vm = this;

        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.studyTypes= studyTypes;
        vm.clickfilter = clickfilter;
        vm.validAddTag = validAddTag;
        vm.validRemoveTag = validRemoveTag;
        vm.loadDataFilter = loadDataFilter;
        vm.numFilter = 0;
				vm.all = '* ' + $filter('translate')('0353');
				vm.firstValue = false;
        vm.id = $scope.id === undefined ? '' : $scope.id;
        vm.listStudies = [];
        vm.filterApply = [];
        vm.filterStudie = [];

        $scope.$watch('numfilter', function () {
					if (document.getElementById('fAT_1' + vm.id) !== null)
						document.getElementById('fAT_1' + vm.id).checked = true;
				});

        vm.studyTypes();

        //Método que devuelve la lista de estudios
				function studyTypes() {
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.listStudyTypes = [];
					return studyTypeDS.getByStatus(auth.authToken).then(function (resp) {
						resp.data.forEach(function (value) {
							vm.listStudyTypes.push({ 'id': value.id, 'code': value.code, 'name': value.code + ' | ' + value.name, 'icon': 'title', 'v': '|' });
						});
					}, function (error) {
						vm.modalError();
					});
				}

        function clickfilter(filter) {
					vm.dataFilter = [];
          vm.numFilter = filter;
          vm.filterStudie = [];
          vm.listStudies = [];
					switch (filter) {
						case 1: vm.dataFilter = vm.listStudyTypes; break;
						default: vm.dataFilter = []; break;
					}
				}

        function loadDataFilter(tag) {
					return $filter('filter')(vm.dataFilter, { name: tag }, false);
				}

        function validAddTag(tag, list) {
					var datafilter = $filter('filter')(vm.dataFilter, { id: tag.id }, false);
					if (tag.v === '*' || tag.v === vm.all) {
						tag.v = vm.all;
						if (list[0].v !== vm.all) vm.filterStudie = [{ v: vm.all }];
						if (vm.numFilter === 1) {
							vm.dataFilter.forEach(function (value) {
								vm.listStudies.push(value.id);
							});
							$scope.numlist = vm.listStudies.length;
						}
					} else if (tag.v === '-*' || tag.v === '-+') {
						vm.listStudies = [];
						vm.filterStudie = [];
						$scope.numlist = 0;
					}
					vm.firstValue = list[0].v === vm.all || list[0].v.indexOf('*') !== -1;
					if (datafilter.length === 0 || (tag.id === undefined && list[0].v !== vm.all)) {
						var can = list.length - 1;
						list.splice(can, 1);
					}
					if (vm.firstValue) {
						if (vm.numFilter === 1) {
							var index = vm.listStudies.indexOf(tag.id);
							if (index > -1) vm.listStudies.splice(index, 1);
							$scope.numlist = vm.listStudies.length;
						}
					} else {
						if (vm.dataFilter.length <= vm.listStudies.length) {
							vm.listStudies = [];
							$scope.numlist = vm.listStudies.length;
						}
						if (vm.numFilter === 1) {
							vm.listStudies.push(tag.id);
							$scope.numlist = vm.listStudies.length;
						}
					}
					if ($scope.state === undefined) {
						$scope.liststudies = [];
						vm.listStudies.forEach(function (value) {
							$scope.liststudies.push(value);
						});
					}
				}

        function validRemoveTag(tag) {
					if (vm.firstValue) {
						if (vm.numFilter === 1) {
							vm.listStudies.push(tag.id);
							$scope.numlist = vm.listStudies.length;
						}
						if (tag.v === vm.all) {
							vm.listStudies = [];
							vm.filterStudie = [];
							vm.firstValue = false;
							$scope.numlist = 0;
						}
					} else {
						if (vm.numFilter === 1) {
							var index = vm.listStudies.indexOf(tag.id);
							if (index > -1) vm.listStudies.splice(index, 1);
							$scope.numlist = vm.listStudies.length;
						}
					}
					if ($scope.state === undefined) {
						$scope.liststudies = [];
						vm.listStudies.forEach(function (value) {
							$scope.liststudies.push(value);
						});
					}
				}

        $scope.$watch('state', function () {
					if ($scope.state === 2) {
						vm.numFilter = $scope.numfilter === undefined ? 0 : $scope.numfilter;
						if (vm.numFilter === 1) {
							vm.listStudies = [];
							$scope.liststudies.forEach(function (value) {
								vm.listStudies.push(value);
							});
							$scope.numlist = vm.listStudies.length;
							document.getElementById('fAT_2' + vm.id).checked = true;
						} else {
							vm.filterStudie = [];
							vm.listStudies = [];
							vm.listtests = [];
							vm.listWorkSheets = [];
							$scope.numlist = 1;
							document.getElementById('fAT_1' + vm.id).checked = true;
						}

						vm.clickfilterByAreaTest(vm.numFilter);
						vm.filterApply.forEach(function (value) {
							vm.filterStudie.push(value);
						});
						vm.dataFilter.forEach(function (value, key) {
							var tag = $filter('filter')(vm.dataFilter, { id: value.id }, true)[0];
							vm.validAddTag(tag, vm.dataFilter);
						});
					} else if ($scope.state === 1 || $scope.state === undefined) {
						$scope.liststudies = [];
						vm.listStudies.forEach(function (value) {
							$scope.liststudies.push(value);
						});
						$scope.numfilter = vm.numFilter;
						vm.filterApply = [];
						vm.filterStudie.forEach(function (value) {
							vm.filterApply.push(value);
						});
					} else if ($scope.state === 3) {
						vm.filterStudie = [];
						vm.listStudies = [];
						$scope.liststudies = [];
						vm.numFilter = 0;
						$scope.numfilter = 0;
						if (document.getElementById('fAT_1' + vm.id) !== null) {
							document.getElementById('fAT_1' + vm.id).checked = true;
						}
					}
					if ($scope.state !== undefined) $scope.state = 0;
				});

			}],
			controllerAs: 'filter'
		};
		return directive;
	}
})();
/* jshint ignore:end */


