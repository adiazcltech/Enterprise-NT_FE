/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   id  			  @descripción
				disabled 		  @descripción
				demographic		  @descripción
				excludetypeorder  @descripción
				maxdemographics	  @descripción
				state			  @descripción
				includenotencoded @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/specialstadistics/specialstadistics.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/indicators/indicators.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/histogram/histogram.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/reports/reports.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/controldeliveryreports/controldeliveryreports.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/listed/listed.html
  7.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/reviewofresults/reviewofresults.html
  8.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
	 Comentario...

********************************************************************************/
/* jshint ignore:start */
(function () {
	'use strict';

	angular
		.module('app.widgets')
		.directive('filterdemographic', filterdemographic);

	filterdemographic.$inject = ['$filter', 'demographicDS', 'demographicsItemDS', 'localStorageService', 'listDS', 'common'];

	/* @ngInject */
	function filterdemographic($filter, demographicDS, demographicsItemDS, localStorageService, listDS, common) {
		var directive = {
			restrict: 'EA',

			templateUrl: 'app/widgets/userControl/filter-demographic.html',

			scope: {
				id: '=id',
				disabled: '=?disabled',
				demographic: '=demographic',
				excludetypeorder: '=?excludetypeorder',
				maxdemographics: '=maxdemographics',
				state: '=state', // 1. or undefined: Se aplican los filtros,  2: Se cancelan cambios en los filtros,  3: Se limpian los fitros
				includenotencoded: '=?includenotencoded',
				demosmask: '=?demosmask',
				type: '=?type',
			},

			controller: ['$scope', function ($scope) {
				var vm = this;
				vm.modalError = modalError;
				vm.getDemographicsALL = getDemographicsALL;
				vm.changeDemographicsItems = changeDemographicsItems;
				vm.listdemographicAll = [];
				vm.listdemographicAllApply = [];
				vm.filterDemographic = [];
				vm.filterDemographicApply = [];
				vm.demotext = [];
				vm.demotextApply = [];
				vm.loadDemographicItems = loadDemographicItems;
				vm.clickfilterDemographic = clickfilterDemographic;
				vm.activeDemographic = [];
				vm.listdemographicItems = [];
				vm.listdemographicItemsApply = [];
				vm.addFilterDemographic = addFilterDemographic;
				vm.removeFilterDemographic = removeFilterDemographic;
				vm.numFilterDemographics = [];
				vm.numFilterDemographicsApply = [];
				vm.validAddTag = validAddTag;
				vm.addRemoveTag = addRemoveTag;
				vm.getChangeDemotext = getChangeDemotext;
				vm.selected = [];
				vm.selectedApply = [];
				vm.isAdd = true;
				vm.numDemog = 0;
				vm.demographic = [];
				$scope.demographic = [];
				vm.id = $scope.id === undefined ? '' : $scope.id;
				vm.excludeTypeOrder = $scope.excludetypeorder === undefined ? false : $scope.excludetypeorder;
				vm.includeNotEncoded = $scope.includenotencoded === undefined ? false : $scope.includenotencoded;
				vm.all = [];
				vm.firstValue = [];
				vm.allApply = [];
				vm.activeDemographicApply = [];
				vm.firstValueApply = [];
				vm.labelMaxDemo = $scope.maxdemographics === undefined || $scope.maxdemographics === 0 ? '' : '(' + $filter('translate')('0526') + ' ' + $scope.maxdemographics.toString() + ')';
				vm.maxDemographics = $scope.maxdemographics === undefined || $scope.maxdemographics === 0 ? 0 : $scope.maxdemographics;
				vm.encoded = [];
				vm.encodedApply = [];
				vm.modalRepeat = UIkit.modal('#modalRepeat', { modal: false, keyboard: false, bgclose: false, center: true });
				vm.permissionuser = localStorageService.get('user');
				var auth;
				vm.max = 200;
				vm.demostatic = false;
				vm.twoNames = localStorageService.get('DosNombresPaciente') === 'True';
				vm.twosurnames = localStorageService.get('DosApellidosPaciente') === 'True';
				if (vm.permissionuser.demographicQuery !== 0 && vm.permissionuser.demographicQuery !== null && vm.permissionuser.demographicQuery !== undefined) {
					vm.demostatic = true;
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
						data.data.forEach(function (value, key) {
							switch (value.id) {
								case -1: data.data[key].name = ($filter('translate')('0085')).toUpperCase(); value.origin = "O"; break; //Cliente
								case -2: data.data[key].name = ($filter('translate')('0086')).toUpperCase(); value.origin = "O"; break; //Médico
								case -3: data.data[key].name = ($filter('translate')('0087')).toUpperCase(); value.origin = "O"; break; //Tarifa
								case -4: data.data[key].name = ($filter('translate')('0088')).toUpperCase(); value.origin = "O"; break; //Tipo de orden
								case -5: data.data[key].name = ($filter('translate')('0003')).toUpperCase(); value.origin = "O"; break; //Sede
								case -6: data.data[key].name = ($filter('translate')('0090')).toUpperCase(); value.origin = "O"; break; //Servicio
								case -7: data.data[key].name = ($filter('translate')('0091')).toUpperCase(); value.origin = "H"; break; //Raza
								case -10: data.data[key].name = ($filter('translate')('0233')).toUpperCase(); value.origin = "H"; break; //Tipo de documento
								case -111: data.data[key].name = "ORDEN HIS"; value.origin = "O"; break; //ORDEN HIS
								case -106: data.data[key].name = "EMAIL"; value.origin = "H"; break; //EMAIL
								default: data.data[key].name = (data.data[key].name).toUpperCase();
							}
						});
						vm.listdemographicAll[0] = data.data;
						demographicsItemDS.getDemographicsItemsAll(auth.authToken, 0, vm.permissionuser.demographicQuery).then(function (data) {
							var demo = $filter("filter")(vm.listdemographicAll[0], function (e) {
								return e.id === vm.permissionuser.demographicQuery;
							})
							demo[0].disabled = true;
							$scope.demographic = [{
								'demographic': demo[0].id,
								'demographicname': demo[0].name,
								'demographicItems': [vm.permissionuser.demographicItemQuery],
								'value': '',
								'encoded': demo[0].encoded,
								'origin': demo[0].origin
							}];
							vm.numFilterDemographics.push({ 'id': 0, 'demographics': demo[0] });
							vm.activeDemographic.push(true);
							vm.filterDemographic.push(0);
							vm.demotext.push(0);
							if (data.data.length > 0) {
								vm.demoItem = $filter("filter")(data.data, function (e) {
									return e.demographicItem.id === vm.permissionuser.demographicItemQuery;
								})[0];
							}
						});

					}, function (error) {
						vm.modalError(error);
					});
				}
				$scope.$watch('disabled', function () {
					vm.disabled = $scope.disabled;
				});
				vm.listoperator = [
					{
						"id": "2",
						"name": $filter('translate')('3232')
					},
					{
						"id": "3",
						"name": $filter('translate')('3233')
					}
				]
				vm.listunit = [
					{
						"id": "1",
						"name": "Año"
					},
					{
						"id": "2",
						"name": "Mes"
					},
					{
						"id": "3",
						"name": "Día"
					}
				]
				vm.changueunit = changueunit;
				function changueunit(compare) {
					if (compare === "1") {
						vm.max = 200;
					} else if (compare === "2") {
						vm.max = 12;
					} else if (compare === "3") {
						vm.max = 31;
					}
					vm.addRemoveTag();
				}
				//Método que devuelve la lista de demográficos activos
				function getDemographicsALL(index) {
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
						vm.listdemographicAll[index] = [];
						vm.numDemog = 0;
						if ($scope.type === 'H') {
							data.data = _.filter(data.data, function (v) { return v.origin === 'H' });
						}
						vm.demosmask = $scope.demosmask === undefined ? '' : $scope.demosmask;
						if (vm.demosmask.search('-104') === -1) {
							var demo1 = {
								"canCreateItemInOrder": false,
								"coded": false,
								"encoded": true,
								"id": -104,
								"items": [],
								"lastOrder": false,
								"modify": false,
								"name": ($filter('translate')('0124')).toUpperCase(), //SEXO
								"origin": "H",
								"state": false,
								"statistics": false
							}
							data.data.push(demo1);
						}
						if (vm.demosmask.search('-110') === -1) {
							var demo1 = {
								"canCreateItemInOrder": false,
								"coded": false,
								"encoded": false,
								"format": "00.00.00",
								"id": -110,
								"items": [],
								"lastOrder": false,
								"modify": true,
								"name": ($filter('translate')('0102')).toUpperCase(), //Edad
								"origin": "H",
								"state": false,
								"statistics": false
							}
							data.data.push(demo1);
						}
						if (vm.demosmask.search('-100') === -1) {
							var demo1 = {
								"canCreateItemInOrder": false,
								"coded": false,
								"encoded": false,
								"id": -100,
								"items": [],
								"lastOrder": false,
								"modify": true,
								"name": ($filter('translate')('0117')).toUpperCase(), // historia
								"origin": "H",
								"state": false,
								"statistics": false
							}
							data.data.push(demo1);
						}
						if (vm.twosurnames) {
							if (vm.demosmask.search('-101') === -1) {
								var demo1 = {
									"canCreateItemInOrder": false,
									"coded": false,
									"encoded": false,
									"id": -101,
									"items": [],
									"lastOrder": false,
									"modify": true,
									"name": ($filter('translate')('0234')).toUpperCase(), // primer apellido
									"origin": "H",
									"state": false,
									"statistics": false
								}
								data.data.push(demo1);
							}
							if (vm.demosmask.search('-102') === -1) {
								var demo1 = {
									"canCreateItemInOrder": false,
									"coded": false,
									"encoded": false,
									"id": -102,
									"items": [],
									"lastOrder": false,
									"modify": true,
									"name": ($filter('translate')('0235')).toUpperCase(), // segundo apellido
									"origin": "H",
									"state": false,
									"statistics": false
								}
								data.data.push(demo1);
							}
						} 
						if (vm.twoNames) {
							if (vm.demosmask.search('-103') === -1) {
								var demo1 = {
									"canCreateItemInOrder": false,
									"coded": false,
									"encoded": false,
									"id": -103,
									"items": [],
									"lastOrder": false,
									"modify": true,
									"name": ($filter('translate')('0236')).toUpperCase(), // primer nombre
									"origin": "H",
									"state": false,
									"statistics": false
								}
								data.data.push(demo1);
							}
							if (vm.demosmask.search('-109') === -1) {
								var demo1 = {
									"canCreateItemInOrder": false,
									"coded": false,
									"encoded": false,
									"id": -109,
									"items": [],
									"lastOrder": false,
									"modify": true,
									"name": ($filter('translate')('0237')).toUpperCase(), // segundo nombre
									"origin": "H",
									"state": false,
									"statistics": false
								}
								data.data.push(demo1);
							}
						} 
						data.data.forEach(function (value, key) {
							var typeOrder = vm.excludeTypeOrder && value.id === -4;
							if (!typeOrder) {
								switch (value.id) {
									case -1: data.data[key].name = ($filter('translate')('0085')).toUpperCase(); value.origin = "O"; break; //Cliente
									case -2: data.data[key].name = ($filter('translate')('0086')).toUpperCase(); value.origin = "O"; break; //Médico
									case -3: data.data[key].name = ($filter('translate')('0087')).toUpperCase(); value.origin = "O"; break; //Tarifa
									case -4: data.data[key].name = ($filter('translate')('0088')).toUpperCase(); value.origin = "O"; break; //Tipo de orden
									case -5: data.data[key].name = ($filter('translate')('0003')).toUpperCase(); value.origin = "O"; break; //Sede
									case -6: data.data[key].name = ($filter('translate')('0090')).toUpperCase(); value.origin = "O"; break; //Servicio
									case -7: data.data[key].name = ($filter('translate')('0091')).toUpperCase(); value.origin = "H"; break; //Raza
									case -10: data.data[key].name = ($filter('translate')('0233')).toUpperCase(); value.origin = "H"; break; //Tipo de documento
									case -111: data.data[key].name = "ORDEN HIS"; value.origin = "O"; break; //ORDEN HIS
									case -106: data.data[key].name = "EMAIL"; value.origin = "H"; break; //EMAIL
									default: data.data[key].name = (data.data[key].name).toUpperCase();
								}
								if (value.id === -104 || value.id === -110 || value.id === -100 || value.id === -101 || value.id === -102 || value.id === -103 || value.id === -109) {
									if (value.id === -110) {
										vm.listdemographicAll[index].push(
											{
												'id': value.id,
												'name': value.name,
												'encoded': value.encoded,
												'origin': value.origin,
												'operator': '2',
												'unidAge': '1'
											});
									} else {
										vm.listdemographicAll[index].push({ 'id': value.id, 'name': value.name, 'encoded': value.encoded, 'origin': value.origin });
										/* document.getElementById(value.id).focus(); */
									}
									vm.numDemog++;
								} else {
									var id = value.id < 0 ? value.id * -100 : value.id;
									var notEncodedAndEncoded = vm.includeNotEncoded ? true : value.encoded;
									if (notEncodedAndEncoded) { //vm.selected.indexOf(id) === -1 &&
										if (value.encoded) {
											demographicsItemDS.getDemographicsItemsAll(auth.authToken, 0, value.id).then(function (data) {
												if (data.data.length > 0) {
													vm.listdemographicAll[index].push({ 'id': value.id, 'name': value.name, 'encoded': value.encoded, 'origin': value.origin });
												}
											});
										} else {
											vm.listdemographicAll[index].push({ 'id': value.id, 'name': value.name, 'encoded': value.encoded, 'origin': value.origin });
										}
									}
									if (value.encoded) {
										vm.numDemog++;
									}
								}


							}
						});


					}, function (error) {
						vm.modalError();
					});
				}
				function changeDemographicsItems(obj, index) {
					if (obj === null || obj === -100) return;
					var icon = '';
					switch (obj.id) {
						case -1: icon = 'copyright'; break;
						case -2: icon = 'assignment_ind'; break;
						case -3: icon = 'monetization_on'; break;
						case -4: icon = 'format_list_numbered'; break;
						case -5: icon = 'home'; break;
						case -6: icon = 'verified_user'; break;
						case -7: icon = 'hdr_strong'; break;
						case -104: icon = 'face'; break;
						default: icon = 'filter_non';
					}
					//var idvar = id < 0 ? id * -100 : id;
					vm.selected[index] = obj; // $filter('filter')(vm.listdemographicAll[index], {'id': id}, true)[0];

					vm.isAdd = true;
					vm.encoded[index] = obj.encoded; // $filter('filter')(vm.listdemographicAll[index], {'id': id}, true)[0].encoded;
					auth = localStorageService.get('Enterprise_NT.authorizationData');
					if (vm.encoded[index]) {
						if (obj.id === -104) {
							return listDS.getList(auth.authToken, 6).then(function (data) {
								vm.listdemographicItems[index] = [];
								vm.filterDemographic[index] = [];
								vm.demotext[index] = '';
								vm.addRemoveTag();
								//var cod = _.filter(vm.numFilterDemographics, function (v) {return v.demographics === obj }).length;
								//var name = _.filter(vm.tests, function (v) {return v.id === parseInt(value.split('|')[2]) })[0].name;
								var numRegister = _.filter(vm.numFilterDemographics, function (v) { return v.demographics == obj }).length;
								if (numRegister > 1) {
									vm.modalRepeat.show();
									vm.clickfilterDemographic(index, undefined);
									return;
								}
								if (data === undefined) data.data = '';
								if (data.data.length > 0) {
									data.data.forEach(function (value, key) {
										if ((value.esCo).toUpperCase() !== 'AMBOS') {
											vm.listdemographicItems[index].push({ 'id': value.id, 'name': $filter('translate')('0000') === 'esCo' ? value.esCo : value.enUsa, 'icon': icon, 'v': '|' });
										}
									})
								}
							}, function (error) {
								vm.modalError();
							});
						} else {
							return demographicsItemDS.getDemographicsItemsAll(auth.authToken, 0, obj.id).then(function (data) {
								vm.listdemographicItems[index] = [];
								vm.filterDemographic[index] = [];
								vm.demotext[index] = '';
								vm.addRemoveTag();
								//var cod = _.filter(vm.numFilterDemographics, function (v) {return v.demographics === obj }).length;
								//var name = _.filter(vm.tests, function (v) {return v.id === parseInt(value.split('|')[2]) })[0].name;
								var numRegister = _.filter(vm.numFilterDemographics, function (v) { return v.demographics == obj }).length;
								if (numRegister > 1) {
									vm.modalRepeat.show();
									vm.clickfilterDemographic(index, undefined);
									return;
								}
								if (data === undefined) data.data = '';
								if (data.data.length > 0) {
									data.data.forEach(function (value, key) {
										vm.listdemographicItems[index].push({ 'id': value.demographicItem.id, 'name': value.demographicItem.code + ' | ' + value.demographicItem.name, 'icon': icon, 'v': '|' });
									})
								}

							}, function (error) {
								vm.modalError();
							});
						}
					} else {
						vm.listdemographicItems[index] = [];
						vm.filterDemographic[index] = [];
						vm.demotext[index] = '';
						var numRegister = _.filter(vm.numFilterDemographics, function (v) { return v.demographics == obj }).length;
						if (numRegister > 1) {
							//if ( $filter('filter')(vm.numFilterDemographics, {demographics: obj}, true).length > 1) {
							vm.modalRepeat.show();
							vm.clickfilterDemographic(index, undefined);
							return;
						}
					}
				}
				function loadDemographicItems(tag, index) {
					return $filter('filter')(vm.listdemographicItems[index], { name: tag }, false);
				}
				//** Método para sacar el popup de error**//
				function modalError(error) {
					vm.Error = error;
					vm.ShowPopupError = true;
				}
				function clickfilterDemographic(index, id) {
					try {
						vm.filterDemographic[index] = [];
						vm.demotext[index] = '';
						vm.listdemographicItems[index] = [];
						vm.numFilterDemographics[index].demographics.id = id === undefined ? 0 : id;
						vm.addRemoveTag();
					} catch (e) {

					}

				}
				function addFilterDemographic() {
					if (vm.demographic.length !== 0) {
						if (vm.demographic.length === vm.numFilterDemographics.length) {
							if (!vm.demographic[vm.demographic.length - 1].encoded && vm.demographic[vm.demographic.length - 1].value !== '' ||
								vm.demographic[vm.demographic.length - 1].encoded && vm.demographic[vm.demographic.length - 1].demographicItems.length !== 0) {
								var add = vm.numFilterDemographics.length;
								if (vm.isAdd && (add < vm.numDemog || vm.numDemog === 0)) {
									if (add < vm.maxDemographics || vm.maxDemographics === 0) {
										vm.getDemographicsALL(add);
										vm.numFilterDemographics[vm.numFilterDemographics.length - 1].demographics.disabled = true;
										vm.numFilterDemographics.push({ 'id': add, 'demographics': vm.listdemographicAll[add] });
										vm.activeDemographic.push(true);
										vm.filterDemographic.push(add);
										vm.demotext.push(add);
										vm.listdemographicItems.push(add);
										vm.listdemographicItems[add] = [];
										vm.all.push('* ' + $filter('translate')('0353'))
										vm.firstValue.push(false);
										vm.encoded.push(true);
										vm.selected.push(add);
									}
								}
								vm.isAdd = false;
							}
						}
					} else if (vm.numFilterDemographics.length === 0) {
						var add = vm.numFilterDemographics.length;
						if (vm.isAdd && (add < vm.numDemog || vm.numDemog === 0)) {
							if (add < vm.maxDemographics || vm.maxDemographics === 0) {
								vm.getDemographicsALL(add);
								vm.numFilterDemographics.push({ 'id': add, 'demographics': vm.listdemographicAll[add] });
								vm.activeDemographic.push(true);
								vm.filterDemographic.push(add);
								vm.demotext.push(add);
								vm.listdemographicItems.push(add);
								vm.listdemographicItems[add] = [];
								vm.all.push('* ' + $filter('translate')('0353'))
								vm.firstValue.push(false);
								vm.encoded.push(true);
								vm.selected.push(add);
							}
						}
						vm.isAdd = false;
					}
				}
				function removeFilterDemographic(index) {
					var remove = index === undefined ? vm.numFilterDemographics.length - 1 : index;
					var idvar = vm.numFilterDemographics[remove].id;
					vm.numFilterDemographics.splice(remove, 1);
					vm.listdemographicAll.splice(remove, 1);
					vm.activeDemographic.splice(remove, 1);
					vm.filterDemographic.splice(remove, 1);
					vm.demotext.splice(remove, 1);
					vm.listdemographicItems.splice(remove, 1);
					vm.firstValue.splice(remove, 1);
					vm.all.splice(remove, 1);
					vm.demographic.splice(remove, 1);
					vm.encoded.splice(remove, 1);
					vm.isAdd = true;
					vm.selected.splice(remove, 1);
					// if (index !== undefined){
					// 	vm.numFilterDemographics.forEach(function(value, key){
					//               	value = key;
					//               	vm.listdemographicItems[key] = [];
					//               });
					// }

					if ($scope.state === undefined) {
						$scope.demographic = [];
						vm.demographic.forEach(function (value) {
							$scope.demographic.push(value);

						});
					}

				}
				function validAddTag(tag, list, index) {
					try {
						var datafilter = $filter('filter')(vm.listdemographicItems[index], { id: tag.id }, false);
						vm.firstValue[index] = false;
						if (tag.v === '*' || tag.v === vm.all[index]) {
							tag.v = vm.all[index];
							if (list[0].v !== vm.all[index]) vm.filterDemographic[index] = [{ v: vm.all[index] }];
						} else if (tag.v === '-*' || tag.v === '-+') {
							vm.demographic = [];
							vm.filterDemographic[index] = [];
						}
						if (list.length > 0) {
							vm.firstValue[index] = list[0].v === vm.all[index];
						} else {
							vm.firstValue[index] = tag.v === vm.all[index];
						}
						if (datafilter.length === 0 || (tag.id === undefined && vm.firstValue[index] === false)) {
							var can = list.length - 1;
							list.splice(can, 1);
						}
						vm.addRemoveTag();
					} catch (e) {

					}
				}
				function getChangeDemotext(index) {
					vm.addRemoveTag()
				}
				function addRemoveTag() {
					vm.demographic = [];
					vm.filterDemographic.forEach(function (value, key) {
						//if (value.length > 0) {
						var idItems = [];
						var all = _.find(value, function (o) { return o.v === '* ' + $filter('translate')('0353') });
						if (all) {
							idItems = _.map(vm.listdemographicItems[key], 'id');
						}
						var valueItem = '';
						for (var i = 0; i < value.length; i++) {
							if (value[i].hasOwnProperty('id') && value[i].id > 0) {
								if (all) {
									var index = idItems.indexOf(value[i].id);
									idItems.splice(index, 1);
								} else {
									idItems.push(value[i].id);
								}
							}
						}
						if (idItems.length == 0) {
							valueItem = vm.demotext[key];
						}
						if (vm.numFilterDemographics[key] !== undefined) {
							if (vm.numFilterDemographics[key].demographics !== null) {
								if (vm.numFilterDemographics[key].demographics.id !== 0) {
									if ((!vm.numFilterDemographics[key].demographics.encoded && vm.demotext[key] !== '' && !vm.numFilterDemographics[key].demographics.encoded && vm.demotext[key] !== null) || (idItems.length !== 0 && vm.numFilterDemographics[key].demographics.encoded)) {
										if (vm.numFilterDemographics[key].demographics.id === -110) {
											var date = moment().subtract(valueItem.toString(), 'years').format('YYYY')
											vm.demographic.push({
												'demographic': vm.numFilterDemographics[key].demographics.id,
												'demographicname': vm.numFilterDemographics[key].demographics.name,
												'demographicItems': idItems,
												'value': date,
												'encoded': vm.numFilterDemographics[key].demographics.encoded,
												'origin': vm.numFilterDemographics[key].demographics.origin,
												'operator': vm.numFilterDemographics[key].demographics.operator,
												'unidAge': vm.numFilterDemographics[key].demographics.unidAge
											});
										} else {
											vm.demographic.push({
												'demographic': vm.numFilterDemographics[key].demographics.id,
												'demographicname': vm.numFilterDemographics[key].demographics.name,
												'demographicItems': idItems,
												'value': valueItem.trim(),
												'encoded': vm.numFilterDemographics[key].demographics.encoded,
												'origin': vm.numFilterDemographics[key].demographics.origin
											})
										}
									}
								}
							}
						}
						//}

					});
					if ($scope.state === undefined) {
						$scope.demographic = [];
						vm.demographic.forEach(function (value) {
							$scope.demographic.push(value);

						});
					}
				}

				$scope.$watch('state', function () {
					if ($scope.state === 2) {
						vm.demographic = [];
						$scope.demographic.forEach(function (value) {
							vm.demographic.push(value)
						});
						vm.filterDemographic = [];
						vm.demotext = [];
						vm.listdemographicItems = [];
						vm.all = [];
						vm.activeDemographic = [];
						vm.firstValue = [];
						vm.numFilterDemographics = [];
						vm.encoded = [];
						//vm.listdemographicAll = [];
						vm.numFilterDemographicsApply.forEach(function (value) {
							var index = value.id;
							vm.listdemographicItems.push(index);
							vm.filterDemographic.push(index);
							vm.filterDemographic[index] = [];
							vm.listdemographicItems[index] = [];
							vm.numFilterDemographics.push(value);
							vm.encoded.push(vm.encodedApply[index]);
							vm.numFilterDemographics[index].demographics = vm.selectedApply[index]; // value.demographics;
							vm.selected[index] = vm.selectedApply[index];
							vm.activeDemographic.push(vm.activeDemographicApply[index]);
							var id = value.demographics !== undefined ? vm.selectedApply[index].id : 0;
							vm.clickfilterDemographic(index, id);
							vm.demotext.push(index);
							vm.demotext[index] = vm.demotextApply[index];
							vm.all.push(vm.allApply[index]);
							vm.firstValue.push(vm.firstValueApply[index]);
							//vm.filterDemographic.push(vm.filterDemographicApply[index]);
							vm.filterDemographicApply[index].forEach(function (value2) {
								vm.filterDemographic[index].push(value2);
							});
							//vm.listdemographicItems[index].push(vm.listdemographicItemsApply[index]);
							vm.listdemographicItemsApply[index].forEach(function (value3) {
								vm.listdemographicItems[index].push(value3);
								//var tag = $filter('filter')(vm.listdemographicItemsApply[index], {id : value3.id}, true)[0];
								var tag = _.filter(vm.listdemographicItemsApply[index], function (v) { return v.id == value3.id })[0];
								vm.validAddTag(tag, vm.listdemographicItemsApply[index], value3.id);
							});

						});

					} else if ($scope.state === 1) {
						$scope.demographic = [];
						vm.demographic.forEach(function (value) {
							$scope.demographic.push(value);

						});

						vm.filterDemographicApply = [];
						vm.demotextApply = [];
						vm.listdemographicItemsApply = [];
						vm.numFilterDemographicsApply = [];
						vm.allApply = [];
						vm.activeDemographicApply = [];
						vm.firstValueApply = [];
						//vm.listdemographicAllApply = [];
						vm.encodedApply = [];
						vm.selectedApply = [];
						vm.numFilterDemographics.forEach(function (value) {
							try {
								vm.numFilterDemographicsApply.push(value);
								var index = value.id;
								vm.filterDemographicApply.push(index);
								vm.listdemographicItemsApply.push(index);
								vm.filterDemographicApply[index] = [];
								vm.listdemographicItemsApply[index] = [];
								vm.encodedApply.push(vm.encoded[index]);
								vm.selectedApply[index] = vm.selected[index];
								vm.demotextApply[index] = vm.demotext[index];
								vm.allApply.push(vm.all[index]);
								vm.firstValueApply.push(vm.firstValue[index]);
								vm.activeDemographicApply.push(vm.activeDemographic[index]);
								vm.filterDemographic[index].forEach(function (value2) {
									vm.filterDemographicApply[index].push(value2);
								});
								vm.listdemographicItems[index].forEach(function (value3) {
									vm.listdemographicItemsApply[index].push(value3);
								});
							} catch (e) {

							}
						});


					} else if ($scope.state === 3) {
						vm.filterDemographic = [];
						vm.demotext = [];
						vm.listdemographicItems = [];
						vm.all = [];
						vm.activeDemographic = [];
						vm.firstValue = [];
						vm.numFilterDemographics = [];
						vm.encoded = [];
						vm.demographic = [];
						$scope.demographic = [];
					}
					if ($scope.state !== undefined) $scope.state = 0;
				});

			}],
			controllerAs: 'filterdemographic'
		};
		return directive;
	}
})();
/* jshint ignore:end */


