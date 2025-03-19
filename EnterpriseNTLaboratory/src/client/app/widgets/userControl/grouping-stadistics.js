/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS: 	numbergroups     @descripción
				typegroup        @descripción
				groupsvalue 	 @descripción
				controlvalid	 @descripción
				idcontrol		 @descripción
				cleanform		 @descripción
				enabledagegroups @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/generalstadistics/generalstadistics.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/specialstadistics/specialstadistics.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/statisticswithprices/statisticswithprices.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
	 Comentario...
********************************************************************************/
/* jshint ignore:start */
(function () {
	'use strict';

	angular
		.module('app.widgets')
		.directive('groupingstatistics', groupingstatistics);

	groupingstatistics.$inject = ['localStorageService', '$filter', 'listDS', 'agegroupsDS', 'demographicDS',
		'demographicsItemDS', 'areaDS', 'laboratoryDS', 'testDS', 'sampleDS', 'antibioticDS', 'microorganismDS'];

	/* @ngInject */
	function groupingstatistics(localStorageService, $filter, listDS, agegroupsDS, demographicDS,
		demographicsItemDS, areaDS, laboratoryDS, testDS, sampleDS, antibioticDS, microorganismDS) {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/widgets/userControl/grouping-stadistics.html',
			scope: {
				numbergroups: '=?numbergroups',
				typegroup: '=?typegroup',
				groupsvalue: '=?groupsvalue',
				controlvalid: '=?controlvalid',
				idcontrol: '=?idcontrol',
				cleanform: '=?cleanform',
				enabledagegroups: '=?enabledagegroups',
				enabledgroupfirt: '=?enabledgroupfirt',
				enabledtest: '=?enabledtest',
				removetest: '=?removetest'
			},

			controller: ['$scope', function ($scope) {

				var vm = this;
				vm.getDemographics = getDemographics;
				vm.getDemographicsItem = getDemographicsItem;
				vm.loadtest = loadtest;
				vm.loaditems = loaditems;
				vm.getAreas = getAreas;
				vm.getLevel = getLevel;
				vm.getLaboratory = getLaboratory;
				vm.getSample = getSample;
				vm.getagegroups = getagegroups;
				vm.getTest = getTest;
				vm.getAntibiotic = getAntibiotic;
				vm.getMicroorganism = getMicroorganism;
				vm.changegroup = changegroup;
				vm.filterlist = filterlist;
				vm.selectallcheck = selectallcheck;
				vm.init = init;
				vm.filter = [];
				$scope.groupsvalue = vm.listdata;
				$scope.controlvalid = false;
				vm.orderList = orderList;
				vm.additemslist = additemslist;
				vm.modalError = modalError;
				vm.enabledgroupfirt = false;
				vm.enabledtest = false;

				vm.enabledagegroups = $scope.enabledagegroups === undefined || $scope.enabledagegroups === false ? false : true;

				vm.init();

				$scope.$watch('numbergroups', function () {
					vm.listdata = [];
					vm.init();
				});

				$scope.$watch('cleanform', function () {
					if ($scope.cleanform) {
						vm.init();
						$scope.cleanform = false;
					}
				});

				$scope.$watch('enabledtest', function () {
					vm.enabledtest = false;
					if ($scope.enabledtest) {
						vm.getDemographics(0);
						vm.listdata[0].filter1 = vm.listdata[0].filter1 === null ? vm.listdata[0].filter1 : "1"
						vm.enabledtest = true;
					}
				});

				$scope.$watch('removetest', function () {
					vm.removetest = false;
					if ($scope.removetest) {
						vm.removetest = true;
					}
				});

				$scope.$watch('enabledgroupfirt', function () {
					vm.enabledgroupfirt = false;
					if ($scope.enabledgroupfirt) {
						vm.enabledgroupfirt = true;
						vm.loaditems(0);
					}
					if (!$scope.enabledgroupfirt) {
						vm.loaditems(0);
					}
				});


				function loaditems(id) {
					vm.listdata[id].allcheck = false;
					vm.listdata[id].listselect = [];

					if (Number.isInteger(Number(vm.listdata[id].filter2))) {
						if (vm.listdata[id].filter1 === '1') {
							if (vm.listdata[id].filter2 !== null) {
								vm.getDemographicsItem(id);
							}
						} else {
							if (vm.listdata[id].filter2 === 1) {
								vm.getAreas(id);
							}
							else if (vm.listdata[id].filter2 === 2) {
								vm.getLevel(id);
							}
							else if (vm.listdata[id].filter2 === 3) {
								vm.getLaboratory(id);
							}
							else if (vm.listdata[id].filter2 === 5) {
								vm.getagegroups(id);
							}
							else if (vm.listdata[id].filter2 === 6 && vm.typegroup === 2) {
								vm.getSample(id);
							}
							else if (vm.listdata[id].filter2 === 7 && vm.typegroup === 2) {
								vm.getTest(id);
							}
							else if (vm.listdata[id].filter2 === 8 && vm.typegroup === 2) {
								vm.getAntibiotic(id);
							}
							else if (vm.listdata[id].filter2 === 9 && vm.typegroup === 2) {
								vm.getMicroorganism(id);
							}
							else if (vm.listdata[id].filter2 === 4 && vm.typegroup !== 1) {
								vm.getTest(id);
							}
							else if (vm.listdata[id].filter2 === 4 && vm.typegroup === 1) {
								vm.getSample(id);
							}
						}
					}
					if(vm.listdata[id].filter2 != null){
						var filterdemografip = $filter('filter')(vm.listdata[id].listfilter, function (e) {
							return e.id === vm.listdata[id].filter2
						})[0];

						vm.listdata[id].filter1name = filterdemografip.name;
						if (vm.listdata[id].filter2 === -5) {
							vm.listdata[id].origin = "O";
						} else if (vm.listdata[id].filter2 === -4) {
							vm.listdata[id].origin = "O";
						} else if (vm.listdata[id].filter2 === -10) {
							vm.listdata[id].origin = "H";
						} else {
							vm.listdata[id].origin = filterdemografip.origin;
						}
						vm.changegroup(id);
					}
				}

				vm.changueradiobutton = changueradiobutton;
				function changueradiobutton(groupid, filter) {
					if (vm.enabledtest) {
						vm.listdata[groupid].filter1 = vm.listdata[groupid].filter1 === null ? vm.listdata[groupid].filter1 : "1"
					} else {
						if (filter === "1") {
							vm.getDemographics(groupid);
						} else {
							vm.loadtest(groupid)
						}
					}

				}
				function loadtest(id) {
					if (vm.typegroup == 1) {
						vm.listdata[id].listfilter = [{ 'id': 4, 'name': $filter('translate')('0451') }];
						vm.listdata[id].filter2 = 4;
						vm.loaditems(id);
					} else if (vm.typegroup === 2) {
						vm.listdata[id].listfilter = [{ 'id': 6, 'name': $filter('translate')('0451') },
						{ 'id': 7, 'name': $filter('translate')('0013') },
						{ 'id': 8, 'name': $filter('translate')('0557') },
						{ 'id': 9, 'name': $filter('translate')('0608') }];
						vm.listdata[id].filter2 = null;
					} else {
						if (vm.removetest) {
							vm.listdata[id].listfilter = [{ 'id': 1, 'name': $filter('translate')('0408') },
							{ 'id': 2, 'name': $filter('translate')('0442') },
							{ 'id': 3, 'name': $filter('translate')('0429') }
								/* ,{ 'id': 5, 'name': $filter('translate')('0513') } */
							];
						}
						else if (vm.enabledagegroups) {
							vm.listdata[id].listfilter = [{ 'id': 1, 'name': $filter('translate')('0408') },
							{ 'id': 2, 'name': $filter('translate')('0442') },
							{ 'id': 3, 'name': $filter('translate')('0429') },
							{ 'id': 4, 'name': $filter('translate')('0013') },
								/* ,{ 'id': 5, 'name': $filter('translate')('0513') } */
							];
						} else {
							vm.listdata[id].listfilter = [{ 'id': 1, 'name': $filter('translate')('0408') },
							{ 'id': 2, 'name': $filter('translate')('0442') },
							{ 'id': 3, 'name': $filter('translate')('0429') },
							{ 'id': 4, 'name': $filter('translate')('0013') }];
						}
						vm.listdata[id].filter2 = null;
					}
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listselect = [];
					vm.listdata[id].listvalues = [];
					vm.listdata[id].allcheck = false;
					vm.changegroup(id);
					vm.filterlist(id);
				}

				function getDemographics(id) {
					vm.listdata[id].filter2 = null;
					vm.listdata[id].listfilter = [];
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listvalues = [];
					vm.listdata[id].listselect = [];
					vm.listdata[id].allcheck = false;
					vm.changegroup(id);
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					return demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
						vm.listdata[id].listfilter = $filter('filter')(data.data, function (e) {
							return e.id !== -4 && e.encoded === true
						});
						vm.filterlist(id);
					},
						function (error) {
							vm.modalError();
						});
				}

				function getDemographicsItem(id) {
					switch (vm.listdata[id].filter2) {
						case -1:
							vm.listdata[id].field = 'account';
							vm.listdata[id].fieldname = 'accountName';
							vm.listdata[id].fieldcode = 'accountCode';
							break;
						case -2:
							vm.listdata[id].field = 'physician';
							vm.listdata[id].fieldname = 'physicianName';
							vm.listdata[id].fieldcode = 'physicianCode';
							break;
						case -3:
							vm.listdata[id].field = 'rate';
							vm.listdata[id].fieldname = 'rateName';
							vm.listdata[id].fieldcode = 'rateCode';
							break;
						case -5:
							vm.listdata[id].field = 'branch';
							vm.listdata[id].fieldname = 'branchName';
							vm.listdata[id].fieldcode = 'branchCode';
							break;
						case -6:
							vm.listdata[id].field = 'service';
							vm.listdata[id].fieldname = 'serviceName';
							vm.listdata[id].fieldcode = 'serviceCode';
							break;
						case -7:
							vm.listdata[id].field = 'race';
							vm.listdata[id].fieldname = 'raceName';
							vm.listdata[id].fieldcode = 'raceCode';
							break;
						case -10:
							vm.listdata[id].field = 'documentType';
							vm.listdata[id].fieldname = 'documentTypeName';
							vm.listdata[id].fieldcode = 'documentTypeCode';
							break;
						default:
							vm.listdata[id].field = 'codifiedId';
							vm.listdata[id].fieldname = 'codifiedName';
							vm.listdata[id].fieldcode = 'codifiedCode';
					}
					vm.listdata[id].listorigin = [];
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					return demographicsItemDS.getDemographicsItemsAll(auth.authToken, 0, vm.listdata[id].filter2).then(function (data) {
						if (data.data.length > 0) {
							data.data.forEach(function (value, key) {
								var object = { id: value.demographicItem.id, name: value.demographicItem.name, code: value.demographicItem.code };
								vm.listdata[id].listorigin.push(object);
							});
							vm.listdata[id].listorigin.sort(vm.orderList);
						}
					});
				}

				function getAreas(id) {
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listvalues = [];
					vm.listdata[id].field = 'sectionId';
					vm.listdata[id].fieldname = 'sectionName';
					vm.listdata[id].fieldcode = 'sectionCode';
					vm.listdata[id].filter1name = $filter('filter')(vm.listdata[id].listfilter, function (e) {
						return e.id === 1
					})[0].name;
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					return areaDS.getAreasActive(auth.authToken).then(function (data) {
						if (data.data.length > 0) {
							data.data.forEach(function (value, key) {
								if (value.id !== 1) {
									var object = { id: value.id, name: value.name, code: value.ordering };
									vm.listdata[id].listorigin.push(object);
								}
							});
							vm.listdata[id].listorigin.sort(vm.orderList);
						}
					});
				}

				function getLevel(id) {
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listvalues = [];
					vm.listdata[id].field = 'levelComplex';
					vm.listdata[id].fieldcode = 'levelComplexCode';
					vm.listdata[id].fieldname = 'levelComplexName';
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					return listDS.getList(auth.authToken, 32).then(function (data) {
						data.data.forEach(function (value, key) {
							if (value.id !== 1) {
								var object = { id: value.id, name: $filter('translate')('0000') === 'enUsa' ? value.enUsa : value.esCo, code: key + 1 };
								vm.listdata[id].listorigin.push(object);
							}
						});
						vm.listdata[id].listorigin.sort(vm.orderList);

					}, function (error) {
						vm.modalError(error);
					});
				}

				function getLaboratory(id) {
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.listdata[id].field = 'laboratoryId';
					vm.listdata[id].fieldcode = 'laboratoryCode';
					vm.listdata[id].fieldname = 'laboratoryName';
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listvalues = [];
					return laboratoryDS.getLaboratoryActive(auth.authToken).then(function (data) {
						vm.listdata[id].listorigin = data.data;
						vm.listdata[id].listorigin.sort(vm.orderList);
					});
				}

				function getSample(id) {
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.listdata[id].field = 'SampleId';
					vm.listdata[id].fieldcode = 'SampleCode';
					vm.listdata[id].fieldname = 'SampleName';
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listvalues = [];
					return sampleDS.getSampleActive(auth.authToken).then(function (data) {
						vm.listdata[id].listorigin = data.data.length === 0 ? data.data : removeData(data);
						vm.listdata[id].listorigin.sort(vm.orderList);
					});
				}

				function removeData(data) {
					data.data.forEach(function (value, key) {
						value.code = value.codesample;
					});
					return data.data;
				}

				function getAntibiotic(id) {
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.listdata[id].field = 'AntibioticId';
					vm.listdata[id].fieldcode = 'AntibioticCode';
					vm.listdata[id].fieldname = 'AntibioticName';
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listvalues = [];
					return antibioticDS.getState(auth.authToken).then(function (data) {
						vm.listdata[id].listorigin = data.data;
						vm.listdata[id].listorigin.sort(vm.orderList);
					}, function (error) {
						vm.modalError(error);
					});
				}

				function getMicroorganism(id) {
					vm.listdata[id].field = 'MicroorganismId';
					vm.listdata[id].fieldcode = 'MicroorganismCode';
					vm.listdata[id].fieldname = 'MicroorganismName';
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listvalues = [];
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					return microorganismDS.getState(auth.authToken).then(function (data) {
						vm.listdata[id].listorigin = data.data;
						vm.listdata[id].listorigin.sort(vm.orderList);
					}, function (error) {
						vm.modalError(error);
					});
				}

				function getTest(id) {
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.listdata[id].field = 'id';
					vm.listdata[id].fieldcode = 'code';
					vm.listdata[id].fieldname = 'name';
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listvalues = [];
					return testDS.getTestArea(auth.authToken, 5, 1, 0).then(function (data) {
						vm.listdata[id].listorigin = data.data;
						vm.listdata[id].listorigin.sort(vm.orderList);
					});
				}

				function getagegroups(id) {
					var auth = localStorageService.get('Enterprise_NT.authorizationData');
					vm.listdata[id].field = 'ageGroup';
					vm.listdata[id].fieldcode = 'ageGroupCode';
					vm.listdata[id].fieldname = 'ageGroupName';
					vm.listdata[id].listorigin = [];
					vm.listdata[id].listvalues = [];
					return agegroupsDS.getagegroupsActive(auth.authToken).then(function (data) {
						vm.listdata[id].listorigin = data.data;
						vm.listdata[id].listorigin.sort(vm.orderList);
						vm.limit = 0;
					});
				}

				function changegroup(id) {
					vm.limit = 0;
					if (vm.listdata[id].listselect.length === 0 && !vm.listdata[id].allcheck) {
						for (var i = id + 1; i < vm.listdata.length; i++) {
							vm.listdata[i].filter1 = null;
							vm.listdata[i].filter1name = null;
							vm.listdata[i].filter2 = null;
							vm.listdata[i].listfilter = [];
							vm.listdata[i].list = [];
							vm.listdata[i].listselect = [];
							vm.listdata[i].state = [true, true, true];
							vm.listdata[i].allcheck = false;
							vm.listdata[i].field = null;
							vm.listdata[i].fieldname = null;
							vm.listdata[i].fieldcode = null;
						}
					}
					else {
						if (vm.listdata[id].filter1 === '1') {
							if (vm.listdata[id + 1] !== undefined) {
								vm.listdata[id + 1].state = [false, false, false];
								vm.listdata[id + 1].filter1 = '1';
								vm.listdata[id + 1].listselect = [];
								vm.listdata[id + 1].field = null;
								vm.listdata[id + 1].fieldname = null;
								vm.listdata[id + 1].fieldcode = null;
								vm.getDemographics(id + 1);
							}
						} else {
							if ((vm.listdata[id].filter2 === 4 || vm.listdata[id].filter2 === 6 || vm.listdata[id].filter2 === 7
								|| vm.listdata[id].filter2 === 8 || vm.listdata[id].filter2 === 9) && ((id + 1) <= 3)) {
								vm.listdata[id + 1].filter1 = null;
								vm.listdata[id + 1].filter1name = null;
								vm.listdata[id + 1].filter2 = null;
								vm.listdata[id + 1].listfilter = [];
								vm.listdata[id + 1].list = [];
								vm.listdata[id + 1].listselect = [];
								vm.listdata[id + 1].state = [true, true, true];
								vm.listdata[id + 1].allcheck = false;
								vm.listdata[id + 1].field = null;
								vm.listdata[id + 1].fieldname = null;
								vm.listdata[id + 1].fieldcode = null;

							}
							else if (vm.listdata[id].filter1 === '2' && vm.listdata[id + 1] !== undefined) {
								vm.listdata[id + 1].state = [true, false, false];
								vm.listdata[id + 1].filter1 = '2';
								vm.listdata[id + 1].listselect = [];
								vm.listdata[id + 1].field = null;
								vm.listdata[id + 1].fieldname = null;
								vm.listdata[id + 1].fieldcode = null;
								vm.loadtest(id + 1);
							}
							else if (vm.listdata[id + 1] !== undefined) {
								vm.listdata[id + 1].state = [false, false, false];
								vm.listdata[id + 1].filter1 = '1';
								vm.listdata[id + 1].listselect = [];
								vm.listdata[id + 1].field = null;
								vm.listdata[id + 1].fieldname = null;
								vm.listdata[id + 1].fieldcode = null;
								vm.getDemographics(id + 1);
							}
						}
					}
					$scope.controlvalid = true;
					for (var i = 0; i < vm.listdata.length; i++) {
						if (vm.listdata[i].listvalues.length === 0) {
							$scope.controlvalid = false;
							break;
						}
						else if (vm.listdata[i].filter1 === '2' || vm.listdata[i].filter1 === '6') {
							$scope.controlvalid = true;
							break;
						}
						else if ((vm.listdata[i + 1] !== undefined && vm.listdata[i + 1].filter1 !== null && vm.listdata[i + 1].filter2 === null)) {
							$scope.controlvalid = true;
							break;
						}
					}
				}

				function filterlist(id) {
					if (id > 0 && vm.listdata[id].filter1 === vm.listdata[id - 1].filter1) {
						for (var i = id; i > 0; i--) {
							vm.listdata[id].listfilter = $filter('filter')(vm.listdata[id].listfilter, function (e) {
								return e.id !== vm.listdata[i - 1].filter2
							});
						}
					}
					if (vm.listdata[id].filter1 === '2' && id > 0 && vm.listdata[id].filter1 === vm.listdata[id - 1].filter1) {
						vm.listdata[id].listfilter = $filter('filter')(vm.listdata[id].listfilter, function (e) {
							return e.id !== -4
						});
					}
					$scope.groupsvalue = vm.listdata;
				}

				function selectallcheck(id) {
					vm.listdata[id].allcheck = !vm.listdata[id].allcheck;
					if (vm.listdata[id].listselect.length === vm.listdata[id].listorigin.length && vm.listdata[id].allcheck) {
						var element = vm.listdata[id].listselect[vm.listdata[id].listselect.length - 1];
						var elementlist = $filter('filter')(vm.listdata[id].listorigin, function (e) {
							return e.id === element.id
						})
						elementlist[0].code = elementlist[0].code.substring(1, elementlist[0].code.length);
						vm.listdata[id].listselect = vm.listdata[id].listselect.splice(0, vm.listdata[id].listselect.length - 1);
					}
					if (vm.listdata[id].allcheck) {
						vm.listdata[id].listvalues = vm.listdata[id].listorigin;
						if (vm.listdata[id].listselect.length > 0) {
							vm.listdata[id].listselect.forEach(function (value, key) {
								vm.listdata[id].listvalues = $filter('filter')(vm.listdata[id].listvalues, function (e) {
									return e.id !== value.id
								});
							});
						}
					}
					else {
						vm.listdata[id].listvalues = vm.listdata[id].listselect;
					}
					if (vm.listdata[id].allcheck && vm.enabledgroupfirt) {
						$scope.controlvalid = true;
					}
					if (vm.listdata[id].listselect.length === 0 && !vm.enabledgroupfirt) {
						vm.changegroup(id);
					}
				}

				function orderList(a, b) {
					if (a.code !== undefined) {
						return a.code.toString().length - b.code.toString().length || a.code.toString().localeCompare(b.code.toString());
					}
					else {
						return a.name.toString().localeCompare(b.name.toString());
					}

				}

				function additemslist(item, id) {
					var list = $filter('filter')(vm.listdata[id].listselect, function (e) {
						return e.id === item.id
					});
					var elementlistorigin = $filter('filter')(vm.listdata[id].listorigin, function (e) {
						return e.id === item.id
					});
					if (list.length === 0) {
						if (vm.listdata[id].listselect.length + 1 === vm.listdata[id].listorigin.length && vm.listdata[id].allcheck) {
							UIkit.modal('#modalinformative').show();
						}
						else {
							var element = {
								'id': item.id,
								'name': item.name,
								'code': item.code
							};
							vm.listdata[id].listselect.push(element);
							vm.listdata[id].listvalues = vm.listdata[id].listorigin;

							if (item.code !== undefined) {
								elementlistorigin[0].code = '-' + elementlistorigin[0].code;
							}
							else {
								elementlistorigin[0].name = '-' + elementlistorigin[0].name;
							}
						}
					}
					else {
						if (item.code !== undefined) {
							elementlistorigin[0].code = elementlistorigin[0].code.substring(1, elementlistorigin[0].code.length);
						}
						else {
							elementlistorigin[0].name = elementlistorigin[0].name.substring(1, elementlistorigin[0].name.length);
						}

						vm.listdata[id].listselect = $filter('filter')(vm.listdata[id].listselect, function (e) {
							return e.id !== item.id
						})
					}

					//asignar el valor de los items de la lista
					if (vm.listdata[id].allcheck) {
						vm.listdata[id].listvalues = vm.listdata[id].listorigin;
						if (vm.listdata[id].listselect.length > 0) {
							vm.listdata[id].listselect.forEach(function (value, key) {
								vm.listdata[id].listvalues = $filter('filter')(vm.listdata[id].listvalues, function (e) {
									return e.id !== value.id
								})
							});
						}
					} else {
						vm.listdata[id].listvalues = vm.listdata[id].listselect;
					}
					if (!vm.enabledgroupfirt) {
						vm.changegroup(id);
					} else {
						$scope.controlvalid = true;
					}

				}

				function modalError(error) {
					vm.Error = error;
					vm.ShowPopupError = true;
				}

				function init() {
					// 1 - si el tipo de grupo es por muestra
					vm.numbergroups = $scope.numbergroups;
					vm.idcontrol = $scope.idcontrol;
					vm.typegroup = $scope.typegroup;

					vm.listdata = [
						{
							name: $filter('translate')('0440'),
							filter1: '1',
							filter1name: null,
							filter2: null,
							field: null,
							fieldname: null,
							fieldcode: null,
							listfilter: [],
							list: [],
							listorigin: [],
							allcheck: false,
							state: [false, false, false],
							listselect: [],
							listvalues: []
						}
					];

					if (vm.numbergroups >= 2) {
						vm.listdata.push({
							name: $filter('translate')('0452'),
							filter1: null,
							filter1name: null,
							filter2: null,
							field: null,
							fieldname: null,
							fieldcode: null,
							listfilter: [],
							list: [],
							listorigin: [],
							allcheck: false,
							state: [true, true, true],
							listselect: [],
							listvalues: []
						});
					}
					if (vm.numbergroups >= 3) {
						vm.listdata.push({
							name: $filter('translate')('0453'),
							filter1: null,
							filter1name: null,
							filter2: null,
							field: null,
							fieldname: null,
							fieldcode: null,
							listfilter: [],
							list: [],
							listorigin: [],
							allcheck: false,
							state: [true, true, true],
							listselect: [],
							listvalues: []
						});
					}
					if (vm.numbergroups >= 4) {
						vm.listdata.push({
							name: $filter('translate')('0454'),
							filter1: null,
							filter1name: null,
							filter2: null,
							field: null,
							fieldname: null,
							fieldcode: null,
							listfilter: [],
							list: [],
							listorigin: [],
							allcheck: false,
							state: [true, true, true],
							listselect: [],
							listvalues: []
						});
					}
					vm.getDemographics(0);
				}

			}],
			controllerAs: 'groupingstatistics'
		};
		return directive;
	}
})();
/* jshint ignore:end */


