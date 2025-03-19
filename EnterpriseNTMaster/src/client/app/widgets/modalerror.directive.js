/* jshint ignore:start */
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('modalerror', modalerror);

    modalerror.$inject = ['ModalService', '$filter','localStorageService'];

    /* @ngInject */
    function modalerror(ModalService, $filter, localStorageService) {
        var directive = {
            templateUrl: 'app/widgets/modal-error.html',
            restrict: 'EA',
            scope: {
                openerrormodal: '=',
                detailerror: '='

            },
            controller: ['$scope', function ($scope) {
                var vm = this;

                $scope.$watch('openerrormodal', function () {
                    vm.ShowPopupError = $scope.openerrormodal;
                    var data = {};

                    if ($scope.openerrormodal) {
                        if($scope.detailerror.status===401 && $scope.detailerror.session === undefined){
                         data = {
                                'code':$scope.detailerror.status,
                                'message': $scope.detailerror.statusText,
                                'url': $scope.detailerror.config.url,
                            };
                        }
                        else if(($scope.detailerror.data === undefined || $scope.detailerror.data === null) && $scope.detailerror.session === undefined) {
                             data = {
                                'code': '404',
                                'message': $filter('translate')('0093'),
                                'url': $scope.detailerror.config.url,
                        };
                        
                        }else if($scope.detailerror.session === undefined){

                            if ($scope.detailerror.data.code === 0) {
                                data = $scope.detailerror.data;
                            }

                            if ($scope.detailerror.data.code === 1) {
                                data = $scope.detailerror.data;
                            }

                            if ($scope.detailerror.data.code === 2) {

                                $scope.detailerror.data.errorFields.forEach(function (value) {
                                    var item = value.split('|');
                                    if (item[0] === '0') {
                                        $scope.detailerror.data.message = 
                                        $scope.detailerror.data.message + 
                                        $filter('translate')('0094') + ': ' + item[1] + ' ';
                                    }
                                    if (item[0] === '2') {
                                        $scope.detailerror.data.message = 
                                        $scope.detailerror.data.message + 
                                        $filter('translate')('0095') + ': ' + item[1] + ' ';
                                    }
                                    if (item[0] === '3') {
                                        $scope.detailerror.data.message = 
                                        $scope.detailerror.data.message + 
                                        $filter('translate')('0096') + ': ' + item[1] + ' ';
                                    }
                                    if (item[0] === '4') {
                                        $scope.detailerror.data.message = 
                                        $scope.detailerror.data.message + 
                                        $filter('translate')('0097') + ': ' + item[1] + ' ';
                                    }
                                    if (item[0] === '5') {
                                        $scope.detailerror.data.message = 
                                        $scope.detailerror.data.message + 
                                        $filter('translate')('0098') + ': ' + item[1] + ' ';
                                    }
                                    if (item[0] === '6') {
                                        $scope.detailerror.data.message = 
                                        $scope.detailerror.data.message + 
                                        $filter('translate')('0099') + ': ' + item[1] + ' ';
                                    }

                                });
                            }
                        }

                        if (data.host === undefined) { data.host = ''; }

                        if($scope.detailerror.status===401 ){
                              ModalService.showModal({
                                templateUrl: 'seccioncaducado.html',
                                controller: 'ErrorController',
                                inputs: {
                                    code: data.code,
                                    message: data.message,
                                    url: data.host + ' ' + data.url,
                                    detail: data.detail,
                                    detailmodal: true

                                }
                            }).then(function (modal) {
                                modal.element.modal();
                                modal.close.then(function (result) {

                                });
                            });

                        } 

                        if($scope.detailerror.status===0 || $scope.detailerror.session === true){
                              ModalService.showModal({
                                templateUrl: 'seccioncaducadoinactividad.html',
                                controller: 'ErrorController',
                                inputs: {
                                    code: data.code,
                                    message: data.message,
                                    url: data.host + ' ' + data.url,
                                    detail: data.detail,
                                    detailmodal: true

                                }
                            }).then(function (modal) {
                                modal.element.modal();
                                modal.close.then(function (result) {

                                });
                            });

                        }  

                        else if($scope.detailerror.data === null && $scope.detailerror.session === undefined) {
                            ModalService.showModal({
                                templateUrl: 'ErrorBoton.html',
                                controller: 'ErrorController',
                                inputs: {
                                    code: data.code,
                                    message: data.message,
                                    url: data.host + ' ' + data.url,
                                    detail: data.detail,
                                    detailmodal: true

                                }
                            }).then(function (modal) {
                                modal.element.modal();
                                modal.close.then(function (result) {

                                });
                            });
                        } else if($scope.detailerror.session === undefined) {
                            ModalService.showModal({
                                templateUrl: 'Error.html',
                                controller: 'ErrorController',
                                inputs: {
                                    code: $scope.detailerror.data.code,
                                    message: $scope.detailerror.data.message,
                                    url: $scope.detailerror.data.host + ' ' + $scope.detailerror.data.url,
                                    detail: $scope.detailerror.data.detail
                                }
                            }).then(function (modal) {
                                modal.element.modal();
                                modal.close.then(function (result) {

                                });
                            });
                        }
                    }

                    $scope.openerrormodal = false;
                });
                vm.ShowPopupError = $scope.ShowPopupError;

            }],
            controllerAs: 'PopupState'
        };
        return directive;


    }

    angular
       .module('app.widgets')
       .controller('ErrorController', ErrorController);

    ErrorController.$inject = ['$scope', '$element', 'code', 'message', 'url', 'detail', 'close'];

    function ErrorController($scope, $element, code, message, url, detail, close) {
        $scope.code = code;
        $scope.message = message;
        $scope.url = url;
        $scope.detail = detail;

        $scope.close = function (result) {
            close(result, 500);
        };
    }
})();
/* jshint ignore:end */