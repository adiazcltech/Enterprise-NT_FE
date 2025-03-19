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
		.directive('commentmicrobiology', commentmicrobiology);

	commentmicrobiology.$inject = ['localStorageService', 'commentsDS', '$filter', 'logger'];

	/* @ngInject */
	function commentmicrobiology(localStorageService, commentsDS, $filter, logger) {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/widgets/userControl/card-commentmicrobiology.html',
			scope: {
				setnotes: '=setnotes',
				orderhistory: '=orderhistory',
				idsample: '=idsample',
				idtest: '=idtest',
				state: '=state' // 1-ver 2-editar
			},

			controller: ['$scope', function ($scope) {
				var vm = this;
				vm.auth = localStorageService.get('Enterprise_NT.authorizationData');
				vm.formatDate = localStorageService.get('FormatoFecha') + ', HH:mm:ss';
				vm.user = localStorageService.get('Enterprise_NT.authorizationData');
				vm.formatDateShort = 'DD/MM/YYYY';
				vm.formatTime = 'HH:mm:ss';
				vm.openModalAdd = openModalAdd;
				vm.closedmodal = closedmodal;
				vm.checkboxAddClick = checkboxAddClick;
				vm.checklist_item_add = checklist_item_add;
				vm.checkboxAddKey = checkboxAddKey;
				vm.closechecklist = closechecklist;
				vm.saveComment = saveComment;
				vm.editcomment = editcomment;
				vm.deletcomment = deletcomment;
				vm.audit = audit;
				vm.closedaudit = closedaudit;
				vm.allcomment = allcomment;
				vm.getcomment = getcomment;
				vm.orderhistory = '';
				vm.idsample = '';
				vm.idtest = '';
				vm.state = $scope.state === undefined || $scope.state === 2 ? true : false;
				vm.closedallcomment = closedallcomment;
				vm.loaddata = false;
				vm.customMenu = {
					menubar: false,
					language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
					plugins: [
						'link',
						'lists',
						'autolink',
						'anchor',
						'textcolor',
						'charmap'

					],
					toolbar: [
						'undo redo | bold italic underline superscript | fontselect fontsizeselect forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
					],
					powerpaste_word_import: 'clean',
					powerpaste_html_import: 'clean'
				};
				$scope.$watch('idtest', function () {
					vm.notes = [];
					$scope.setnotes = vm.notes;
					vm.commentMicrobiology = '';
					if ($scope.idtest !== undefined && $scope.idtest !== '') {
						vm.orderhistory = $scope.orderhistory;
						vm.idsample = $scope.idsample;
						vm.idtest = $scope.idtest;
						vm.getcomment();
					} else {
						vm.idtest = '';
					}
				});


				$scope.$watch('orderhistory', function () {
					vm.notes = [];
					$scope.setnotes = vm.notes;
					vm.commentMicrobiology = '';
					if ($scope.orderhistory !== undefined && $scope.orderhistory !== '') {
						vm.orderhistory = $scope.orderhistory;
						vm.idsample = $scope.idsample;
						vm.idtest = $scope.idtest;
						vm.getcomment();
					} else {
						vm.idtest = '';
					}
				});

				function getcomment() {
					vm.loading = true;
					commentsDS.getCommentsMicrobiologyTest(vm.auth.authToken, vm.orderhistory, vm.idtest).then(function (data) {
						vm.loading = false;
						if (data.status === 200) {
							var notes = data.data.length === 0 ? [] : removenotes(data.data);
							vm.notes = _.orderBy(notes, ['lastTransaction'], ['desc']);
							$scope.setnotes = vm.notes;
						} else {
							vm.notes = [];
							$scope.setnotes = vm.notes;
						}
					});
				}
				function removenotes(data) {
					var dataadd = [];
					data.forEach(function (value, key) {
						if (data[key].idTest === vm.idtest) {
							if (data[key].comment === '') {
								data[key].comment = "{'content':'<p></p>','checklist':[]}";
								data[key].commentArray = { content: '<p></p>', checklist: {} };
								data[key].commentArray.content = "<p></p>";

							} if (data[key].comment[0] === '{' || data[key].comment[1] === '{') {
								var firshC = JSON.parse(data[key].comment).content.substring(0, 1);
								var pos = firshC === '"' ? 1 : 0;
								var content = JSON.parse(data[key].comment).content;
								data[key].commentArray = JSON.parse(data[key].comment);
								data[key].commentArray.content = content.substring(pos, content.length - pos);
							} else {
								data[key].commentArray = { content: '<p>' + data[key].comment + '</p>', checklist: {} };
								data[key].commentArray.content = '<p>' + data[key].comment + '</p>';
								data[key].comment = "{'content':" + data[key].commentArray.content + ",'checklist':[]}";
							}
							data[key].permissionEdit = data[key].user.id === localStorageService.get('Enterprise_NT.authorizationData').id;
							data[key].state = 0;
							dataadd.push(data[key]);
						}
					});
					return dataadd;
				}
				function allcomment() {
					if (vm.idtest === '') {
						logger.warning('Debe seleccionar primero el exámen');
					} else {
						UIkit.modal('#full_microbiology', { modal: false }).show();
					}
				}
				function closedaudit() {
					UIkit.modal('#audit').hide();
				}
				function closedallcomment() {
					UIkit.modal('#full_microbiology').hide();
				}
				function audit() {
					if (vm.idtest === '') {
						logger.warning('Debe seleccionar un examen');
					} else {
						vm.loading = true;
						vm.notesTracking = [];
						return commentsDS.getCommentsTrackingmicrobiology(vm.auth.authToken, vm.orderhistory, vm.idtest).then(function (data) {
							if (data.status === 200) {
								data.data.forEach(function (value) {
									if (value.comment === '') {
										value.comment = "{'content':'<p></p>','checklist':[]}";
										value.commentArray = { content: '<p></p>', checklist: {} };
										value.commentArray.content = "<p></p>";

									} if (value.comment[0] === '{' || value.comment[1] === '{') {
										var firshC = JSON.parse(value.comment).content.substring(0, 1);
										var pos = firshC === '"' ? 1 : 0;
										var content = JSON.parse(value.comment).content;
										value.commentArray = JSON.parse(value.comment);
										value.commentArray.content = content.substring(pos, content.length - pos);
									} else {
										value.commentArray = { content: '<p>' + value.comment + '</p>', checklist: {} };
										value.commentArray.content = '<p>' + value.comment + '</p>';
										value.comment = "{'content':" + value.commentArray.content + ",'checklist':[]}";
									}

									value.user.photo = value.user.id !== vm.user.id ? 'images/user1.png' : vm.user.photo === '' || vm.user.photo === undefined ? 'images/user1.png' : 'data:image/jpeg;base64,' + vm.user.photo;
									value.title = value.state === 1 ? 'Nota ingresada' : value.state === 2 ? 'Nota modificada' : 'Nota eliminada';
									value.date = moment(value.lastTransaction).format(vm.formatDateShort);
									value.time = moment(value.lastTransaction).format(vm.formatTime);
								});
								vm.notesTracking = _.orderBy(data.data, ['id', 'lastTransaction'], ['asc', 'asc']);
								vm.loading = false;
								UIkit.modal('#audit').show();
							} else {
								logger.info('No existen datos de trazabilidad');
								vm.loading = false;
							}
						});
					}
				}
				function editcomment(notes) {
					if (vm.idtest === '') {
						logger.warning('Debe seleccionar un examen');
					} else {
						vm.loading = true;
						vm.time = new Date().getTime();
						vm.additem = notes;
						vm.additem.lastTransaction = vm.time;
						vm.additem.state = 2;
						vm.labelheck = '';
						vm.required = false;
						vm.action = 2;
						vm.commentrequired = false;
						UIkit.modal('#edit_microbiology').show();
						vm.loading = false;
					}
				}
				function deletcomment(notes) {
					if (vm.idtest === '') {
						logger.warning('Debe seleccionar un examen');
					} else {
						vm.loading = true;
						vm.time = new Date().getTime();
						vm.additem = notes;
						vm.additem.lastTransaction = vm.time;
						vm.additem.state = 3;
						vm.saveComment();
					}

				}
				function openModalAdd() {
					if (vm.idtest === '') {
						logger.warning('Debe seleccionar un examen');
					} else {
						vm.time = new Date().getTime();
						vm.user;
						vm.additem = {
							'id': vm.notes.length + 1,
							'idSample': vm.idsample,
							'idTest': vm.idtest,
							'order': vm.orderhistory,
							'lastTransaction': vm.time,
							'permissionEdit': true,
							'state': 1,
							'commentArray': { 'checklist': [], 'content': '' },
							'user': {
								'id': vm.user.id,
								'userName': vm.user.userName,
								'lastName': vm.user.lastName,
								'name': vm.user.name
							},
							'comment': ''
						};
						vm.labelheck = '';
						vm.required = false;
						vm.action = 1;
						vm.printReported = false;
						vm.commentrequired = false;
						vm.loaddata = false;
						UIkit.modal('#add_microbilogy').show();
					}
				}
				function closedmodal() {
					if (vm.additem.state === 1) {
						UIkit.modal('#add_microbilogy').hide();
					}
					if (vm.additem.state === 2) {
						vm.getcomment();
						UIkit.modal('#edit_microbiology').hide();
					}
				}
				function checkboxAddClick($event) {
					$event.preventDefault();
					vm.checklist_item_add();
				}
				function checklist_item_add() {
					vm.required = false;
					if (vm.labelheck !== '') {
						vm.additem.commentArray.checklist.push({
							title: vm.labelheck,
							hidden: true
						});
						vm.labelheck = '';
						vm.required = false;
					} else {
						vm.required = true;
					}
				}
				function checkboxAddKey($event) {
					vm.required = false;
					var keyCode = $event.which || $event.keyCode;
					if (keyCode === 13) {
						if (vm.labelheck !== '') {
							vm.additem.commentArray.checklist.push({
								title: vm.labelheck,
								hidden: true
							});
							vm.labelheck = '';
							vm.required = false;
						} else {
							vm.required = true;
						}
						$event.preventDefault();
					}
				}
				function closechecklist(index) {
					vm.additem.commentArray.checklist[index].hidden = false;
				}
				function saveComment() {
					vm.loaddata = true;
					vm.select = vm.additem.state;
					if (vm.additem.state === 1) {
						if (vm.additem.commentArray.content !== '') {
							var commetvalid = vm.additem.commentArray.content.replace(/&nbsp;/g, '');
							var firshC = commetvalid.substring(0, 1);
							var pos = firshC === '"' ? 1 : 0;
							commetvalid = commetvalid.substring(pos, commetvalid.length - pos);
							commetvalid = commetvalid.trim();
							var comment = {
								'content': '"' + commetvalid + '"',
								'checklist': $filter('filter')(vm.additem.commentArray.checklist, { hidden: true })
							};
							vm.additem.comment = JSON.stringify(comment);
							vm.notes.push(vm.additem);
							$scope.setnotes = vm.notes;

						}
					}
					if (vm.additem.state === 2) {
						var commetvalid = vm.additem.commentArray.content.replace(/&nbsp;/g, '');
						var firshC = commetvalid.substring(0, 1);
						var pos = firshC === '"' ? 1 : 0;
						commetvalid = commetvalid.substring(pos, commetvalid.length - pos);
						commetvalid = commetvalid.trim();
						var comment = {
							'content': '"' + commetvalid + '"',
							'checklist': $filter('filter')(vm.additem.commentArray.checklist, { hidden: true })
						};
						vm.additem.comment = JSON.stringify(comment);
					}
					return commentsDS.newCommentsMicrobiology(vm.auth.authToken, JSON.stringify(vm.notes)).then(function (data) {
						if (data.status === 200) {
							return commentsDS.getCommentsMicrobiologySample(vm.auth.authToken, vm.orderhistory, vm.idsample).then(function (data) {
								if (data.status === 200) {
									var notes = removenotes(data.data);
									vm.notes = _.orderBy(notes, ['lastTransaction'], ['desc']);
									$scope.setnotes = vm.notes;
									if (vm.select === 1) {
										vm.loaddata = false;
										UIkit.modal('#add_microbilogy').hide();
									}
									if (vm.select === 2) {
										vm.loaddata = false;
										UIkit.modal('#edit_microbiology').hide();
									}
									logger.success($filter('translate')('0149'));
									vm.loading = false;

								} else {
									vm.notes = [];
									$scope.setnotes = vm.notes;
									vm.loading = false;
								}
							}, function (error) {
								vm.loading = false;
								vm.modalError(error);
							});
						}
						else {
							vm.notes = [];
							$scope.setnotes = vm.notes;
						}
					}, function (error) {
						vm.loadingdata = false;
						vm.modalError(error);
					});
				}
			}],
			controllerAs: 'commentmicrobiology'
		};
		return directive;
	}
})();
