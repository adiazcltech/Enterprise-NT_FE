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
		.directive('commentorder', commentorder);

	commentorder.$inject = ['localStorageService', 'commentsDS', '$filter', 'logger'];

	/* @ngInject */
	function commentorder(localStorageService, commentsDS, $filter, logger) {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/widgets/userControl/card-commentorder.html',
			scope: {
				orderhistory: '=orderhistory',
				state: '=state', // 1-ver 2-editar 3-nuevo 4-guardar 5-ver botones 6-Editar en lines
				size: '=size', //1-mini solo para la ingreso de oredenes 2-medium 3-normal
				idcontrol: '=?idcontrol',
				type: '=type', //1-comentario de la orden // 2-comenatrio diagnostico
				idpatient: '=idpatient',
				returncomment: '=?returncomment',
				commentsorder: '=?commentsorder',
				orderpatient: '=orderpatient',
			},

			controller: ['$scope', function ($scope) {
				var vm = this;
				vm.auth = localStorageService.get('Enterprise_NT.authorizationData');
				vm.formatDate = localStorageService.get('FormatoFecha') + ', HH:mm:ss';
				vm.user = localStorageService.get('Enterprise_NT.authorizationData');
				var viewcontrolHTML = localStorageService.get('verControlHTMLenLinea');
				vm.viewcontrolHTML = viewcontrolHTML === 'True' || viewcontrolHTML === '' ? true : false;
				vm.formatDateShort = 'DD/MM/YYYY';
				vm.formatTime = 'HH:mm:ss';
				vm.viewbutton = false;
				vm.openModalAdd = openModalAdd;
				vm.closedmodal = closedmodal;
				vm.checkboxAddClick = checkboxAddClick;
				vm.checklistitemadd = checklistitemadd;
				vm.checkboxAddKey = checkboxAddKey;
				vm.closechecklist = closechecklist;
				vm.saveComment = saveComment;
				vm.editcomment = editcomment;
				vm.deletcomment = deletcomment;
				vm.audit = audit;
				vm.size = $scope.size === undefined ? 3 : $scope.size;
				vm.closedaudit = closedaudit;
				vm.allcomment = allcomment;
				vm.getcomment = getcomment;
				vm.state = $scope.state === undefined || $scope.state === 2 ? true : false;
				vm.closedallcomment = closedallcomment;
				vm.notes = [];
				vm.idcontrol = $scope.idcontrol === undefined ? 'order' : $scope.idcontrol;
				vm.type = $scope.type === undefined ? 1 : $scope.type;
				vm.getcommentpatient = getcommentpatient;
				vm.saveCommentorder = saveCommentorder;
				vm.label = vm.type === 1 ? $filter('translate')('0465') : $filter('translate')('0464');
				vm.idpatient = '';
				vm.orderhistory = '';

				vm.tinymceOptions = {
					menubar: false,
					inline: true,
					language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
					plugins: [
						'link',
						'lists',
						'autolink',
						'anchor',
						'textcolor',
						'charmap',
						'tabfocus'

					],
					toolbar: [
						'undo redo | bold italic underline superscript | fontselect fontsizeselect',
						'forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
					]
				};
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
					]
				};
				vm.newitem = {
					'id': vm.notes.length + 1,
					'type': vm.type,
					'lastTransaction': vm.time,
					'permissionEdit': true,
					'state': 1,
					'before': '',
					'beforeprint': true,
					'commentArray': { 'checklist': [], 'content': '' },
					'print': false,
					'user': {
						'id': vm.user.id,
						'userName': vm.user.userName,
						'lastName': vm.user.lastName,
						'name': vm.user.name
					},
					'comment': ''
				};

				$scope.$watch('state', function () {
					if (vm.size === 1) {
						if ($scope.state === 1) {
							vm.pru = 1;
							vm.state = false;
						}
						if ($scope.state === 2) {
							vm.state = true;
							vm.pru = 2;
							if (vm.notes.length === 0) {
								vm.notes.push(vm.newitem);
								vm.notes[0].commentArray = { 'checklist': [], 'content': '' };
								vm.notes[0].comment = '';
							} else {
								vm.notes[0].state = 2;
								vm.additem = vm.notes[0];
							}
						}
						if ($scope.state === 6) {
							vm.state = true;
							vm.pru = 6;
							if (vm.notes.length === 0) {
								vm.notes.push(vm.newitem);
								vm.notes[0].commentArray = { 'checklist': [], 'content': '' };
								vm.notes[0].comment = '';
							} else {
								vm.notes[0].state = 2;
								vm.additem = vm.notes[0];
							}
						}
						if ($scope.state === 4) {
							if (vm.notes[0].idRecord === undefined && vm.notes[0].commentArray.content === '') {
								vm.pru = 4;
								vm.state = false;
							} else {
								vm.pru = 4;
								vm.state = false;
								vm.saveCommentorder();
							}
						}
						if ($scope.state === 5) {
							vm.viewbutton = true;
							vm.state = false;
							vm.pru = 5;
						}
						if ($scope.state === 3) {
							vm.pru = 3;
							vm.state = true;
							if (vm.notes.length === 0) {
								vm.time = new Date().getTime();
								vm.additem = {
									'id': vm.notes.length + 1,
									'type': vm.type,
									'lastTransaction': vm.time,
									'permissionEdit': true,
									'state': 1,
									'commentArray': { 'checklist': [], 'content': '' },
									'print': false,
									'before': '',
									'beforeprint': true,
									'user': {
										'id': vm.user.id,
										'userName': vm.user.userName,
										'lastName': vm.user.lastName,
										'name': vm.user.name
									},
									'comment': ''
								};
								vm.notes.push(vm.additem);
							} else {
								vm.notes[0].state = 2;
							}
						}
					}
				});

				$scope.$watch('returncomment', function () {
					if ($scope.returncomment) {
						$scope.commentsorder = new Array();
						$scope.commentsorder = vm.notes
					}
					$scope.returncomment = false;
				});

				$scope.$watch('orderhistory', function () {
					vm.notes = [];
					if ($scope.orderhistory !== undefined && $scope.orderhistory !== '') {
						vm.orderhistory = $scope.orderhistory;
						vm.getcomment();
					}
				});
				$scope.$watch('orderpatient', function () {
					if ($scope.orderpatient !== undefined && $scope.orderpatient !== '') {
						vm.orderpatient = $scope.orderpatient;
					}
				});



				$scope.$watch('idpatient', function () {
					vm.notes = [];
					if ($scope.idpatient !== undefined && $scope.idpatient !== '') {
						vm.idpatient = $scope.idpatient;
						vm.getcommentpatient();
					}
				});

				vm.htmlEntities = htmlEntities;
				function htmlEntities(str) {
					var valorhtml = String(str).replace(/&ntilde;/g, 'ñ')
						.replace(/\n/g, "  ")
						.replace(/<[^>]*>?/g, '')
						.replace(/&Ntilde;/g, 'Ñ')
						.replace(/&amp;/g, '&')
						.replace(/&Ntilde;/g, 'Ñ')
						.replace(/&ntilde;/g, 'ñ')
						.replace(/&Ntilde;/g, 'Ñ')
						.replace(/&Agrave;/g, 'À')
						.replace(/&Aacute;/g, 'Á')
						.replace(/&Acirc;/g, 'Â')
						.replace(/&Atilde;/g, 'Ã')
						.replace(/&Auml;/g, 'Ä')
						.replace(/&Aring;/g, 'Å')
						.replace(/&AElig;/g, 'Æ')
						.replace(/&Ccedil;/g, 'Ç')
						.replace(/&Egrave;/g, 'È')
						.replace(/&Eacute;/g, 'É')
						.replace(/&Ecirc;/g, 'Ê')
						.replace(/&Euml;/g, 'Ë')
						.replace(/&Igrave;/g, 'Ì')
						.replace(/&Iacute;/g, 'Í')
						.replace(/&Icirc;/g, 'Î')
						.replace(/&Iuml;/g, 'Ï')
						.replace(/&ETH;/g, 'Ð')
						.replace(/&Ntilde;/g, 'Ñ')
						.replace(/&Ograve;/g, 'Ò')
						.replace(/&Oacute;/g, 'Ó')
						.replace(/&Ocirc;/g, 'Ô')
						.replace(/&Otilde;/g, 'Õ')
						.replace(/&Ouml;/g, 'Ö')
						.replace(/&Oslash;/g, 'Ø')
						.replace(/&Ugrave;/g, 'Ù')
						.replace(/&Uacute;/g, 'Ú')
						.replace(/&Ucirc;/g, 'Û')
						.replace(/&Uuml;/g, 'Ü')
						.replace(/&Yacute;/g, 'Ý')
						.replace(/&THORN;/g, 'Þ')
						.replace(/&szlig;/g, 'ß')
						.replace(/&agrave;/g, 'à')
						.replace(/&aacute;/g, 'á')
						.replace(/&acirc;/g, 'â')
						.replace(/&atilde;/g, 'ã')
						.replace(/&auml;/g, 'ä')
						.replace(/&aring;/g, 'å')
						.replace(/&aelig;/g, 'æ')
						.replace(/&ccedil;/g, 'ç')
						.replace(/&egrave;/g, 'è')
						.replace(/&eacute;/g, 'é')
						.replace(/&ecirc;/g, 'ê')
						.replace(/&euml;/g, 'ë')
						.replace(/&igrave;/g, 'ì')
						.replace(/&iacute;/g, 'í')
						.replace(/&icirc;/g, 'î')
						.replace(/&iuml;/g, 'ï')
						.replace(/&eth;/g, 'ð')
						.replace(/&ntilde;/g, 'ñ')
						.replace(/&ograve;/g, 'ò')
						.replace(/&oacute;/g, 'ó')
						.replace(/&ocirc;/g, 'ô')
						.replace(/&otilde;/g, 'õ')
						.replace(/&ouml;/g, 'ö')
						.replace(/&oslash;/g, 'ø')
						.replace(/&ugrave;/g, 'ù')
						.replace(/&uacute;/g, 'ú')
						.replace(/&ucirc;/g, 'û')
						.replace(/&uuml;/g, 'ü')
						.replace(/&yacute;/g, 'ý')
						.replace(/&thorn;/g, 'þ')
						.replace(/&yuml;/g, 'ÿ')
						.replace(/&nbsp;/g, '')
						.replace(/<[^>]+>/gm, '')
					return valorhtml;
				}

				function getcomment() {
					vm.loading = true;
					vm.notes = [];
					commentsDS.getCommentsOrder(vm.auth.authToken, vm.orderhistory).then(function (data) {
						vm.loading = false;
						if (data.status === 200) {
							var notes = data.data.length === 0 ? [] : removenotes(data.data);
							vm.notes = _.orderBy(notes, ['lastTransaction', 'id'], ['desc', 'desc']);
							if (data.data.length !== 0) {
								if (!vm.viewcontrolHTML) {
									vm.notes[0].commentArray.content = vm.htmlEntities(vm.notes[0].commentArray.content);
								}
								vm.notes[0].before = vm.notes[0].commentArray.content;
								vm.notes[0].beforeprint = vm.notes[0].print;
							}
						} else {
							vm.notes = [];
							if (vm.pru === 6) {
								vm.notes.push(vm.newitem);
								vm.notes[0].commentArray = { 'checklist': [], 'content': '' };
								vm.notes[0].comment = '';
							}
						}
					},
						function () {
							vm.loading = false;
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
							if (data.data.length !== 0) {
								if (!vm.viewcontrolHTML) {
									vm.notes[0].commentArray.content = vm.htmlEntities(vm.notes[0].commentArray.content);
								}
								vm.notes[0].before = vm.notes[0].commentArray.content;
								vm.notes[0].beforeprint = vm.notes[0].print;
							}
						} else {
							vm.notes = [];
						}
					});
				}
				function removenotes(data) {
					data.forEach(function (value, key) {
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
						// data[key].permissionEdit = data[key].user.id === localStorageService.get('Enterprise_NT.authorizationData').id;
						data[key].permissionEdit = true;
						data[key].state = 0;
						data[key].print = value.print === undefined ? false : value.print;
					});
					return data;
				}
				function allcomment() {
					UIkit.modal('#modal_fullcomment' + vm.idcontrol, { modal: false }).show();
				}
				function closedaudit() {
					UIkit.modal('#modaltrace' + vm.idcontrol).hide();
				}
				function closedallcomment() {
					UIkit.modal('#modal_fullcomment' + vm.idcontrol).hide();
				}
				function audit() {
					vm.loading = true;
					vm.notesTracking = [];
					var consult = vm.type === 1 ? vm.orderhistory : vm.idpatient;
					if (consult === undefined || consult === '') {
						logger.warning($filter('translate')('1475'));
						vm.loading = false;
					} else {
						return commentsDS.getCommentsTracking(vm.auth.authToken, consult, vm.type).then(function (data) {
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
									value.title = value.state === 1 ? $filter('translate')('0610') : value.state === 2 ? $filter('translate')('0611') : $filter('translate')('0612');
									value.user.photo = value.user.id !== vm.user.id ? 'images/user1.png' : vm.user.photo === '' || vm.user.photo === undefined ? 'images/user1.png' : 'data:image/jpeg;base64,' + vm.user.photo;
									value.date = moment(value.lastTransaction).format(vm.formatDateShort);
									value.time = moment(value.lastTransaction).format(vm.formatTime);
								});
								vm.notesTracking = _.orderBy(data.data, ['id', 'lastTransaction'], ['asc', 'asc']);
								vm.loading = false;
								UIkit.modal('#modaltrace' + vm.idcontrol).show();
							} else {
								logger.warning($filter('translate')('1475'));
								vm.loading = false;
							}
						}, function (error) {
							vm.loading = false;
						});
					}
				}
				function editcomment(notes) {
					vm.loading = true;
					vm.time = new Date().getTime();
					vm.beforecomment = notes;
					vm.additem = notes;
					vm.additem.lastTransaction = vm.time;
					vm.additem.state = 2;
					vm.labelheck = '';
					vm.required = false;
					vm.action = 2;
					vm.commentrequired = false;
					UIkit.modal('#modalnotes' + vm.idcontrol).show();
					vm.loading = false;
				}
				function deletcomment(notes) {
					vm.loading = true;
					vm.time = new Date().getTime();
					vm.additem = notes;
					vm.additem.lastTransaction = vm.time;
					vm.additem.state = 3;
					vm.saveComment();
				}
				vm.confirmationcomment = confirmationcomment;
				function confirmationcomment() {
					if (vm.notes[0].before !== vm.notes[0].commentArray.content || vm.notes[0].beforeprint !== vm.notes[0].print) {
						UIkit.modal('#confirmation' + vm.idcontrol, { 'bg-close': false }).show();
					}
				}
				vm.confirmationprint = confirmationprint;
				function confirmationprint() {
					if (vm.pru === 6) {
						vm.saveCommentorder();
					}
				}
				vm.saveconfirmation = saveconfirmation;
				function saveconfirmation() {
					if ($scope.state !== 3) {
						vm.saveCommentorder();
						UIkit.modal('#confirmation' + vm.idcontrol).hide();
					}
				}
				vm.closedconfirmation = closedconfirmation;
				function closedconfirmation() {
					vm.notes[0].commentArray.content = vm.notes[0].before;
					UIkit.modal('#confirmation' + vm.idcontrol).hide();
				}
				function openModalAdd() {
					vm.time = new Date().getTime();
					vm.additem = {
						'id': vm.notes.length + 1,
						'type': vm.type,
						'idRecord': vm.type === 1 ? vm.orderhistory : vm.idpatient,
						'lastTransaction': vm.time,
						'permissionEdit': true,
						'state': 1,
						'commentArray': { 'checklist': [], 'content': '' },
						'print': false,
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
					vm.commentrequired = false;
					UIkit.modal('#modalnotesadd' + vm.idcontrol).show();
				}
				function closedmodal() {
					if (vm.additem.state === 1) {
						UIkit.modal('#modalnotesadd' + vm.idcontrol).hide();
					}
					if (vm.additem.state === 2) {
						if (vm.type === 1) {
							vm.getcomment();
						} else {
							vm.getcommentpatient();

						}
						UIkit.modal('#modalnotes' + vm.idcontrol).hide();
					}
				}
				function checkboxAddClick($event) {
					$event.preventDefault();
					vm.checklistitemadd();
				}
				function checklistitemadd() {
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
							if (vm.notes.length === 0) {
								vm.notes = [];
								vm.notes.push(vm.additem);
							} else if (vm.notes[0].commentArray.content === "") {
								vm.notes = [];
								vm.notes.push(vm.additem);
							} else {
								vm.notes.push(vm.additem);
							}
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
					return commentsDS.newCommentsOrder(vm.auth.authToken, JSON.stringify(vm.notes)).then(function (data) {
						if (data.status === 200) {
							if (vm.type === 1) {
								return commentsDS.getCommentsOrder(vm.auth.authToken, vm.orderhistory).then(function (data) {
									if (data.status === 200) {
										var notes = data.data.length === 0 ? [] : removenotes(data.data);
										vm.notes = _.orderBy(notes, ['lastTransaction', 'id'], ['desc', 'desc']);
										if (!vm.viewcontrolHTML) {
											vm.notes[0].commentArray.content = vm.htmlEntities(vm.notes[0].commentArray.content);
										}
										vm.notes[0].before = vm.notes[0].commentArray.content;
										vm.notes[0].beforeprint = vm.notes[0].print;

										if (vm.select === 1) {
											UIkit.modal('#modalnotesadd' + vm.idcontrol).hide();
										}
										if (vm.select === 2) {
											UIkit.modal('#modalnotes' + vm.idcontrol).hide();
										}
										logger.success($filter('translate')('0149'));
										vm.loading = false;

									} else {
										vm.notes = [];
										vm.loading = false;
									}
								}, function (error) {
									vm.loading = false;
									vm.modalError(error);
								});
							} else {
								return commentsDS.getCommentsPatient(vm.auth.authToken, vm.idpatient).then(function (data) {
									if (data.status === 200) {
										var notes = data.data.length === 0 ? [] : removenotes(data.data);
										vm.notes = _.orderBy(notes, ['lastTransaction', 'id'], ['desc', 'desc']);
										if (!vm.viewcontrolHTML && data.data.length !== 0) {
											vm.notes[0].commentArray.content = vm.htmlEntities(vm.notes[0].commentArray.content);
										}
										vm.notes[0].before = vm.notes[0].commentArray.content;
										vm.notes[0].beforeprint = vm.notes[0].print;

										if (vm.select === 1) {
											UIkit.modal('#modalnotesadd' + vm.idcontrol).hide();
										}
										if (vm.select === 2) {
											UIkit.modal('#modalnotes' + vm.idcontrol).hide();
										}
										logger.success($filter('translate')('0149'));
										vm.loading = false;

									} else {
										vm.notes = [];
										vm.loading = false;
									}
								}, function (error) {
									vm.loading = false;
									vm.modalError(error);
								});

							}
						}
						else {
							vm.notes = [];
						}
					}, function (error) {
						vm.loadingdata = false;
						vm.modalError(error);
					});
				}
				function saveCommentorder() {
					var orderhistory = $scope.orderhistory === '' || $scope.orderhistory === undefined ? vm.orderhistory : $scope.orderhistory;
					var idpatient = $scope.idpatient === '' || $scope.idpatient === undefined ? vm.idpatient : $scope.idpatient;
					vm.time = new Date().getTime();
					if (vm.notes[0].before !== vm.notes[0].commentArray.content || vm.notes[0].beforeprint !== vm.notes[0].print) {
						if (vm.notes.length === 1) {
							vm.notes[0].state = vm.notes[0].before === '' ? 1 : 2;
							vm.notes[0].idRecord = vm.type === 1 ? orderhistory : idpatient;
							vm.notes[0].user = vm.user;
							/* vm.notes[0].order = orderhistory; */
							vm.notes[0].lastTransaction = vm.time;
							var commetvalid = vm.notes[0].commentArray.content.replace(/&nbsp;/g, '');
							var firshC = commetvalid.substring(0, 1);
							var pos = firshC === '"' ? 1 : 0;
							commetvalid = commetvalid.substring(pos, commetvalid.length - pos);
							commetvalid = commetvalid.trim();

							var checklist = [];
							if (vm.notes[0].commentArray.checklist.hasOwnProperty("hidden")) {
								checklist = $filter('filter')(vm.notes[0].commentArray.checklist, { hidden: true })
							}

							var comment = {
								'content': '"' + commetvalid + '"',
								'checklist': checklist
							};
							vm.notes[0].comment = JSON.stringify(comment);

							if (vm.type === 2) {
								vm.notes.forEach(function (value, key) {
									value.order = vm.orderpatient;
								});
							}

							return commentsDS.newCommentsOrder(vm.auth.authToken, JSON.stringify(vm.notes)).then(function (data) {
								if (data.status === 200) {
									if (vm.type === 1) {
										var orderhistory = $scope.orderhistory === '' || $scope.orderhistory === undefined ? vm.orderhistory : $scope.orderhistory;
										return commentsDS.getCommentsOrder(vm.auth.authToken, orderhistory).then(function (data) {
											if (data.status === 200) {
												var notes = data.data.length === 0 ? [] : removenotes(data.data);
												vm.notes = _.orderBy(notes, ['lastTransaction', 'id'], ['desc', 'desc']);
												if (!vm.viewcontrolHTML) {
													vm.notes[0].commentArray.content = vm.htmlEntities(vm.notes[0].commentArray.content);
												}
												vm.notes[0].before = vm.notes[0].commentArray.content;
												vm.notes[0].beforeprint = vm.notes[0].print;
												vm.loading = false;
											} else {
												vm.notes = [];
												vm.loading = false;
											}
										}, function (error) {
											vm.loading = false;
											vm.modalError(error);
										});
									} else {
										var idpatient = $scope.idpatient === '' || $scope.idpatient === undefined ? vm.idpatient : $scope.idpatient;
										return commentsDS.getCommentsPatient(vm.auth.authToken, idpatient).then(function (data) {
											if (data.status === 200) {
												var notes = data.data.length === 0 ? [] : removenotes(data.data);
												vm.notes = _.orderBy(notes, ['lastTransaction', 'id'], ['desc', 'desc']);
												if (!vm.viewcontrolHTML && data.data.length !== 0) {
													vm.notes[0].commentArray.content = vm.htmlEntities(vm.notes[0].commentArray.content);
												}
												vm.notes[0].before = vm.notes[0].commentArray.content;
												vm.notes[0].beforeprint = vm.notes[0].print;
												vm.loading = false;
											} else {
												vm.notes = [];
												vm.loading = false;
											}
										}, function (error) {
											vm.loading = false;
											vm.modalError(error);
										});

									}
								}
								else {
									vm.notes = [];
								}
							}, function (error) {
								vm.loadingdata = false;
								vm.modalError(error);
							});

						} else {
							var commetvalid = vm.notes[0].commentArray.content.replace(/&nbsp;/g, '');
							var firshC = commetvalid.substring(0, 1);
							var pos = firshC === '"' ? 1 : 0;
							commetvalid = commetvalid.substring(pos, commetvalid.length - pos);
							commetvalid = commetvalid.trim();
							var comment = {
								'content': '"' + commetvalid + '"',
								'checklist': $filter('filter')(vm.notes[0].commentArray.checklist, { hidden: true })
							};
							vm.notes[0].idRecord = vm.type === 1 ? orderhistory : idpatient;
							/* vm.notes[0].order = orderhistory; */
							vm.notes[0].lastTransaction = vm.time;
							vm.notes[0].comment = JSON.stringify(comment);
							vm.notes[0].state = 2;
							vm.notes[0].user = vm.user;
							if (vm.type === 2) {
								vm.notes.forEach(function (value, key) {
									value.order = vm.orderpatient;
								});
							}
							return commentsDS.newCommentsOrder(vm.auth.authToken, JSON.stringify(vm.notes)).then(function (data) {
								if (data.status === 200) {
									if (vm.type === 1) {
										var orderhistory = $scope.orderhistory === '' || $scope.orderhistory === undefined ? vm.orderhistory : $scope.orderhistory;
										return commentsDS.getCommentsOrder(vm.auth.authToken, orderhistory).then(function (data) {
											if (data.status === 200) {
												var notes = data.data.length === 0 ? [] : removenotes(data.data);
												vm.notes = _.orderBy(notes, ['lastTransaction', 'id'], ['desc', 'desc']);
												if (!vm.viewcontrolHTML) {
													vm.notes[0].commentArray.content = vm.htmlEntities(vm.notes[0].commentArray.content);
												}
												vm.notes[0].before = vm.notes[0].commentArray.content;
												vm.notes[0].beforeprint = vm.notes[0].print;
												vm.loading = false;
											} else {
												vm.notes = [];
												vm.loading = false;
											}
										}, function (error) {
											vm.loading = false;
											vm.modalError(error);
										});
									} else {
										var idpatient = $scope.idpatient === '' || $scope.idpatient === undefined ? vm.idpatient : $scope.idpatient;
										return commentsDS.getCommentsPatient(vm.auth.authToken, idpatient).then(function (data) {
											if (data.status === 200) {
												var notes = data.data.length === 0 ? [] : removenotes(data.data);
												vm.notes = _.orderBy(notes, ['lastTransaction', 'id'], ['desc', 'desc']);
												if (!vm.viewcontrolHTML && data.data.length !== 0) {
													vm.notes[0].commentArray.content = vm.htmlEntities(vm.notes[0].commentArray.content);
												}
												vm.notes[0].before = vm.notes[0].commentArray.content;
												vm.notes[0].beforeprint = vm.notes[0].print;
												vm.loading = false;
											} else {
												vm.notes = [];
												vm.loading = false;
											}
										}, function (error) {
											vm.loading = false;
											vm.modalError(error);
										});

									}
								}
								else {
									vm.notes = [];
								}
							}, function (error) {
								vm.loadingdata = false;
								vm.modalError(error);
							});
						}
					}

				}
			}],
			controllerAs: 'commentorder'
		};
		return directive;
	}
})();
