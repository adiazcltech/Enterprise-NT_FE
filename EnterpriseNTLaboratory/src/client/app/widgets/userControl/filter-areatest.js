/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   id   				@descripción
				disabled			@descripción
				confidential		@descripción
				numfilterareatest	@descripción
				listareas			@descripción
				listtests			@descripción
				numlist				@descripción
				state				@descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/indicators/indicators.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/histogram/histogram.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/reports/reports.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/patientconsultation/patientconsultation.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/listed/listed.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/reviewofresults/reviewofresults.html
  7./02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
	 Comentario...

********************************************************************************/
/* jshint ignore:start */
(function () {
	'use strict';

	angular
		.module('app.widgets')
		.directive('filterareatest', filterareatest);

	filterareatest.$inject = ['$q', '$filter', 'testDS', 'areaDS', 'localStorageService', 'worksheetsDS'];

	/* @ngInject */
	function filterareatest($q, $filter, testDS, areaDS, localStorageService, worksheetsDS) {
		var directive = {
			restrict: 'EA',

			templateUrl: 'app/widgets/userControl/filter-areatest.html',

			scope: {
				id: '=id',
				disabled: '=?disabled',
				confidential: '=?confidential',
				numfilterareatest: '=numfilterareatest',
				listareas: '=listareas',
				listworksheets: '=listworksheets',
				listtests: '=listtests', 
				numlist: '=numlist',
				state: '=state', // 1. or undefined: Se aplican los filtros,  2: Se cancelan cambios en los filtros,  3: Se limpian los fitros
				resultsentry: '=?resultsentry',
				inviewarea: '=inviewarea',
				onlyareas: '=onlyareas'
			},

			controller: ['$scope', function ($scope) {
				var vm = this;

				vm.getArea = getArea;
				vm.getTest = getTest;
				vm.groups = groups;
				vm.onlyareas = $scope.inviewarea === true ? true : false;
				vm.getTestConfidential = getTestConfidential;
				vm.clickfilterByAreaTest = clickfilterByAreaTest;
				vm.loadDataAreaTest = loadDataAreaTest;
				vm.validAddTag = validAddTag;
				vm.validRemoveTag = validRemoveTag;
				vm.dataAreaTest = [];
				vm.filterAreaTests = [];
				vm.filterAreaTestsApply = [];
				$scope.numfilterareatest = 0;
				vm.numFilterAreaTest = 0; // $scope.numfilterareatest === undefined ? 0 : $scope.numfilterareatest;
				vm.inviewarea = $scope.inviewarea === undefined ? true : $scope.inviewarea;
				$scope.listareas = [];
				$scope.listtests = [];
				$scope.listworksheets = [];
				$scope.numlist = 1;
				vm.listareas = [];
				vm.listtests = [];
				vm.listWorkSheets = [];
				vm.id = $scope.id === undefined ? '' : $scope.id;
				vm.all = '* ' + $filter('translate')('0353');
				vm.firstValue = false;

				vm.resultsentry = $scope.resultsentry === undefined ? false : true;
				vm.getWorkSheets = getWorkSheets;

				var auth = localStorageService.get('Enterprise_NT.authorizationData');
				vm.confidential = !auth.confidential;
				$scope.confidential = !auth.confidential;

				$scope.$watch('disabled', function () {
					vm.disabled = $scope.disabled;
				});

				$scope.$watch('numfilterareatest', function () {
					if (document.getElementById('fAT_1' + vm.id) !== null)
						document.getElementById('fAT_1' + vm.id).checked = true;
					//vm.numFilterAreaTest = $scope.numfilterareatest === undefined ? 0 : $scope.numfilterareatest;
				});

				vm.getArea();
				vm.getTest();
				vm.groups();
				vm.getTestConfidential();
				vm.getWorkSheets();

				//Método que devuelve la lista de áreas activas  
				function getArea() {
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.ListAreas = [];
					//vm.ListAreas = [{'id': 0, 'code': '*',  'name': vm.all, 'icon': 'brightness_5', 'v':'|'}];
					return areaDS.getAreas(auth.authToken).then(function (dataArea) {
						dataArea.data.splice(0, 1);
						dataArea.data.forEach(function (value) {
							vm.ListAreas.push({ 'id': value.id, 'code': value.ordering, 'name': value.ordering + ' | ' + value.name, 'icon': 'font_download', 'v': '|' });
						});
						//$rootScope.blockView = false;
					}, function (error) {
						vm.modalError();
					});
				}

				function getTest() {
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.ListTest = [];
					return testDS.getTestArea(auth.authToken, 5, 1, 0).then(function (dataTest) {
						dataTest.data.forEach(function (value) {
							if (!value.confidential) {
								vm.ListTest.push({ 'id': value.id, 'code': value.code, 'name': value.code + ' | ' + value.name, 'icon': 'assignment', 'v': '|' });
							}
						});
						//$rootScope.blockView = false;
					}, function (error) {
						vm.modalError(error);
					});
				}

				function groups() {
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.Listgroups = [];
					return testDS.getgroups(auth.authToken).then(function (dataTest) {
						if (dataTest.status === 200) {
							dataTest.data = _.groupBy(dataTest.data, 'id');
							for (var propiedad in dataTest.data) {
								var test = _.map(dataTest.data[propiedad], 'idTest');
								vm.Listgroups.push({
									'id': dataTest.data[propiedad][0].id,
									'code': dataTest.data[propiedad][0].code,
									'name': dataTest.data[propiedad][0].code + ' | ' + dataTest.data[propiedad][0].name,
									'icon': 'assignment',
									'v': '|',
									'test': test
								});
							}
						}
					}, function (error) {
						vm.modalError(error);
					});
				}

				function getWorkSheets() {
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.ListWorkSheets = [];

					return worksheetsDS.getWorkSheet(auth.authToken).then(function (data) {
						data.data.forEach(function (value) {
							vm.ListWorkSheets.push({ 'id': value.id, 'name': value.name, 'icon': 'assignment', 'v': '|' });
						});
					}, function (error) {
						vm.modalError(error);
					});
				}

				function getTestConfidential() {
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.ListTestConfidential = [];
					return testDS.getTestConfidential(auth.authToken).then(function (dataTestConf) {
						dataTestConf.data.forEach(function (value) {
							vm.ListTestConfidential.push({ 'id': value.id, 'code': value.code, 'name': value.code + ' | ' + value.name, 'icon': 'remove_circle', 'v': '|' });
						});
					}, function (error) {
						vm.modalError();
					});
				}

				function clickfilterByAreaTest(filter) {
					if (vm.confidential && filter === 3) {
						return true;
					}
					vm.numFilterAreaTest = filter;
					if ($scope.resultsentry === true && $scope.numfilterareatest === 0) {
						$scope.numfilterareatest = filter;
					} else if (!$scope.resultsentry || $scope.resultsentry === undefined) {
						$scope.numfilterareatest = filter;
					}

					$scope.numlist = filter === 0 ? 1 : 0;
					$scope.listtests = [];
					vm.dataAreaTest = [];
					vm.filterAreaTests = [];
					vm.listareas = [];
					vm.listtests = [];
					vm.listWorkSheets = [];
					switch (filter) {
						case 1: vm.dataAreaTest = vm.ListAreas; break;
						case 2: vm.dataAreaTest = vm.ListTest; break;
						case 3: vm.dataAreaTest = vm.ListTestConfidential; break;
						case 4: vm.dataAreaTest = vm.ListWorkSheets; break;
						case 5: vm.dataAreaTest = vm.Listgroups; $scope.numfilterareatest = 2; break;
						default: vm.dataAreaTest = []; break;
					}
				}


				function loadDataAreaTest(tag) {
					return $filter('filter')(vm.dataAreaTest, { name: tag }, false);
				}

				function validAddTag(tag, list) {
					var datafilter = $filter('filter')(vm.dataAreaTest, { id: tag.id }, false);
					var oh = vm.filterAreaTests;

					if (tag.v === '*' || tag.v === vm.all) {

						vm.listtests = [];
						vm.listareas = [];
						vm.listWorkSheets = [];
						tag.v = vm.all;

						if (list[0].v !== vm.all) vm.filterAreaTests = [{ v: vm.all }];
						if (vm.numFilterAreaTest === 1) {
							vm.dataAreaTest.forEach(function (value) {
								vm.listareas.push(value.id);
							});
							$scope.numlist = vm.listareas.length;
							vm.listtests = [];
							vm.listWorkSheets = [];
						}
						else if (vm.numFilterAreaTest === 4) {
							vm.dataAreaTest.forEach(function (value) {
								vm.listWorkSheets.push(value.id);
							});
							$scope.numlist = vm.listWorkSheets.length;
							vm.listtests = [];
							vm.listareas = [];
						} else if (vm.numFilterAreaTest === 5) {
							vm.alltest = _.clone(vm.Listgroups) 
							vm.dataAreaTest.forEach(function (value) {
								vm.listtests = _.uniq(_.concat(vm.listtests, value.test))
							});
							$scope.numlist = vm.listtests.length;
							vm.listareas = [];
							vm.listWorkSheets = [];
						} else {
							vm.dataAreaTest.forEach(function (value) {
								if (value.id !== undefined) {
									vm.listtests.push(value.id);
								}
							});
							$scope.numlist = vm.listtests.length;
							vm.listareas = [];
							vm.listWorkSheets = [];
						}
					} else if (tag.v === '-*' || tag.v === '-+') {
						vm.listtests = [];
						vm.listareas = [];
						vm.listWorkSheets = [];
						vm.filterAreaTests = [];
						$scope.numlist = 0;
					}

					vm.firstValue = list[0].v === vm.all || list[0].v.indexOf('*') !== -1;
					if (datafilter.length === 0 || (tag.id === undefined && list[0].v !== vm.all)) {
						var can = list.length - 1;
						list.splice(can, 1);
					}
					if (vm.firstValue) {
						if (vm.numFilterAreaTest === 1) {
							var index = vm.listareas.indexOf(tag.id);
							if (index > -1) vm.listareas.splice(index, 1);
							$scope.numlist = vm.listareas.length;
							vm.listtests = [];
							vm.listWorkSheets = [];
						}
						else if (vm.numFilterAreaTest === 4) {
							var index = vm.listWorkSheets.indexOf(tag.id);
							if (index > -1) vm.listWorkSheets.splice(index, 1);
							$scope.numlist = vm.listWorkSheets.length;
							vm.listtests = [];
							vm.listareas = [];
						} else if (vm.numFilterAreaTest === 5) {
							vm.listtests = [];
							vm.alltest = _.remove(vm.alltest, function (n) {
								return n.id != tag.id;
							})
							vm.alltest.forEach(function (value) {
								vm.listtests = _.uniq(_.concat(vm.listtests, value.test))
							});
							$scope.numlist = vm.alltest.length;
							vm.listareas = [];
							vm.listWorkSheets = [];
						} else {
							var index = vm.listtests.indexOf(tag.id);
							if (index > -1) vm.listtests.splice(index, 1);
							$scope.numlist = vm.listtests.length;
							vm.listareas = [];
							vm.listWorkSheets = [];
						}
					} else {
						if (vm.dataAreaTest.length <= vm.listareas.length) {
							vm.listareas = [];
							$scope.numlist = vm.listareas.length;
						}
						if (vm.dataAreaTest.length <= vm.listtests.length) {
							vm.listtests = [];
							$scope.numlist = vm.listtests.length;
						}
						if (vm.dataAreaTest.length <= vm.listWorkSheets.length) {
							vm.listWorkSheets = [];
							$scope.numlist = vm.listWorkSheets.length;
						}
						if (vm.numFilterAreaTest === 1) {
							vm.listareas.push(tag.id);
							$scope.numlist = vm.listareas.length;
							vm.listtests = [];
							vm.listWorkSheets = [];
						} else if (vm.numFilterAreaTest === 4) {
							vm.listWorkSheets.push(tag.id);
							$scope.numlist = vm.listWorkSheets.length;
							vm.listtests = [];
							vm.listareas = [];
						} else if (vm.numFilterAreaTest === 5) {
							vm.listtests = [];
							vm.filterAreaTests.forEach(function (value) {
								vm.listtests = _.uniq(_.concat(vm.listtests, value.test))
							});
							$scope.numlist = vm.filterAreaTests.length;
							vm.listareas = [];
							vm.listWorkSheets = [];
						} else {
							vm.listtests.push(tag.id);
							$scope.numlist = vm.listtests.length;
							vm.listareas = [];
							vm.listWorkSheets = [];
						}
					}
					if ($scope.state === undefined) {
						$scope.listareas = [];
						vm.listareas.forEach(function (value) {
							$scope.listareas.push(value);
						});
						$scope.listworksheets = [];
						vm.listWorkSheets.forEach(function (value) {
							$scope.listworksheets.push(value);
						});
						$scope.listtests = [];
						vm.listtests.forEach(function (value) {
							if (value !== undefined) {
								$scope.listtests.push(value);
							}
						});
					}
				}

				function validRemoveTag(tag) {
					if (vm.firstValue) {
						if (vm.numFilterAreaTest === 1) {
							vm.listareas.push(tag.id);
							$scope.numlist = vm.listareas.length;
							vm.listtests = [];
							vm.listWorkSheets = [];
						} else if (vm.numFilterAreaTest === 4) {
							vm.listWorkSheets.push(tag.id);
							$scope.numlist = vm.listWorkSheets.length;
							vm.listtests = [];
							vm.listareas = [];
						} if (vm.numFilterAreaTest === 5) {
							vm.alltest.push(tag);
							vm.listtests = _.uniq(_.concat(vm.listtests, tag.test));
							$scope.numlist = vm.filterAreaTests.length;
							vm.listareas = [];
							vm.listWorkSheets = [];
						} else {
							vm.listtests.push(tag.id);
							$scope.numlist = vm.listtests.length;
							vm.listareas = [];
							vm.listWorkSheets = [];
						}
						if (tag.v === vm.all) {
							vm.listtests = [];
							vm.listareas = [];
							vm.listWorkSheets = [];
							vm.filterAreaTests = [];
							vm.firstValue = false;
							$scope.numlist = 0;
						}
					} else {
						if (vm.numFilterAreaTest === 1) {
							var index = vm.listareas.indexOf(tag.id);
							if (index > -1) vm.listareas.splice(index, 1);
							$scope.numlist = vm.listareas.length;
						}
						else if (vm.numFilterAreaTest === 4) {
							var index = vm.listWorkSheets.indexOf(tag.id);
							if (index > -1) vm.listWorkSheets.splice(index, 1);
							$scope.numlist = vm.listWorkSheets.length;
						} else if (vm.numFilterAreaTest === 5) {
							vm.listtests = [];
							vm.filterAreaTests.forEach(function (value) {
								vm.listtests = _.uniq(_.concat(vm.listtests, value.test))
							});
							$scope.numlist = vm.filterAreaTests.length;
						} else {
							var index = vm.listtests.indexOf(tag.id);
							if (index > -1) vm.listtests.splice(index, 1);
							$scope.numlist = vm.listtests.length;
						}
					}
					if ($scope.state === undefined) {
						$scope.listareas = [];
						vm.listareas.forEach(function (value) {
							$scope.listareas.push(value);
						});
						$scope.listworksheets = [];
						vm.listWorkSheets.forEach(function (value) {
							$scope.listworksheets.push(value);
						});
						$scope.listtests = [];
						vm.listtests.forEach(function (value) {
							if (value !== undefined) {
								$scope.listtests.push(value);
							}
						});
					}
				}

				$scope.$watch('state', function () {
					if ($scope.state === 2) {
						vm.numFilterAreaTest = $scope.numfilterareatest === undefined ? 0 : $scope.numfilterareatest;
						if (vm.numFilterAreaTest === 1) {
							vm.listareas = [];
							$scope.listareas.forEach(function (value) {
								vm.listareas.push(value);
							});
							$scope.numlist = vm.listareas.length;
							vm.listtests = [];
							vm.listWorkSheets = [];
							document.getElementById('fAT_2' + vm.id).checked = true;
						} else if (vm.numFilterAreaTest === 2 || vm.numFilterAreaTest === 3) {
							vm.listtests = [];
							$scope.listtests.forEach(function (value) {
								if (value !== undefined) {
									$scope.listtests.push(value);
								}
							});
							$scope.numlist = vm.listtests.length;
							vm.listareas = [];
							vm.listWorkSheets = [];
							var fat = vm.numFilterAreaTest === 2 ? 'fAT_3' : 'fAT_4';
							document.getElementById(fat + vm.id).checked = true;
						} else if (vm.numFilterAreaTest === 4) {
							vm.listWorkSheets = [];
							$scope.listworksheets.forEach(function (value) {
								vm.listWorkSheets.push(value);
							});
							$scope.numlist = vm.listWorkSheets.length;
							vm.listtests = [];
							vm.listareas = [];
							document.getElementById('fAT_5' + vm.id).checked = true;
						} else {
							vm.filterAreaTests = [];
							vm.listareas = [];
							vm.listtests = [];
							vm.listWorkSheets = [];
							$scope.numlist = 1;
							document.getElementById('fAT_1' + vm.id).checked = true;
						}

						vm.clickfilterByAreaTest(vm.numFilterAreaTest);
						vm.filterAreaTestsApply.forEach(function (value) {
							vm.filterAreaTests.push(value);
						});
						vm.dataAreaTest.forEach(function (value, key) {
							var tag = $filter('filter')(vm.dataAreaTest, { id: value.id }, true)[0];
							vm.validAddTag(tag, vm.dataAreaTest);
						});


					} else if ($scope.state === 1 || $scope.state === undefined) {
						$scope.listareas = [];
						vm.listareas.forEach(function (value) {
							$scope.listareas.push(value);
						});
						$scope.listworksheets = [];
						vm.listWorkSheets.forEach(function (value) {
							$scope.listworksheets.push(value);
						});
						$scope.listtests = [];
						vm.listtests.forEach(function (value) {
							if (value !== undefined) {
								$scope.listtests.push(value);
							}
						});
						$scope.numfilterareatest = vm.numFilterAreaTest;
						vm.filterAreaTestsApply = [];
						vm.filterAreaTests.forEach(function (value) {
							vm.filterAreaTestsApply.push(value);
						});
					} else if ($scope.state === 3) {
						vm.filterAreaTests = [];
						vm.listareas = [];
						vm.listtests = [];
						vm.listWorkSheets = [];
						$scope.listareas = [];
						$scope.listtests = [];
						$scope.listworksheets = [];
						vm.numFilterAreaTest = 0;
						$scope.numfilterareatest = 0;
						if (document.getElementById('fAT_1' + vm.id) !== null) {
							document.getElementById('fAT_1' + vm.id).checked = true;
						}
					}
					if ($scope.state !== undefined) $scope.state = 0;
				});

			}],
			controllerAs: 'filterareatest'
		};
		return directive;
	}
})();
/* jshint ignore:end */


