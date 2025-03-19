/* jshint ignore:start */
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('calculator', calculator);

    calculator.$inject = ['$q', 'ModalService', 'testDS','configurationDS','localStorageService'];

    /* @ngInject */
    function calculator($q, ModalService,testDS,configurationDS,localStorageService) {
        var directive = {
            templateUrl: 'app/widgets/calculator.html',
            restrict: 'EA',
            scope: {
                disabled: '=?disabled',
                valueformula: '=valueformula',
                concurrences:'=?concurrences',
                textformula: '=textformula',
                idtest: '=idtest'
             
            },

            controller: ['$scope', function ($scope) {
                var vm = this;

                vm.output = '';
                vm.outputSend = '';
                vm.curIndex = 0;
                vm.result = 0;
                vm.manejoRaza = true;
                vm.manejoTalla = true;
                vm.manejoPeso = true;
                vm.disabled = $scope.disabled;
                vm.testadd = [];
                vm.getTest = getTest;
                vm.stateButton = stateButton;
                vm.getconcurrence = getconcurrence;
                vm.getConfigurationPeso = getConfigurationPeso;
                vm.getConfigurationTalla = getConfigurationTalla;
                vm.getConfigurationRace = getConfigurationRace;
                vm.press = press;
                vm.save = save;
                vm.cancel = cancel;
                vm.testRequeridid = [];
                vm.testRequeridabbr = [];
                vm.concurrences = [];
                vm.textRequerid = '';
                vm.cantOpen = 0;
                vm.cantClose = 0;

                $scope.$watch('valueformula', function () { 
                    vm.cantOpen = 0;
                    vm.cantClose = 0;
                    vm.testadd = [];
                    vm.output = '';
                    vm.outputSend = $scope.valueformula;
                    vm.testRequeridid = [];
                    vm.testRequeridabbr = [];
                    vm.textRequerid = '';
                    vm.message = false;
                    vm.idtest =  $scope.idtest;
                    //$scope.textformula = vm.output;

                    if (vm.outputSend !== undefined) {
                        var test = '';
                        var indexini = 0;
                        var chaterfinal = vm.outputSend[vm.outputSend.length - 1];
                        
                        if (chaterfinal === '|') {
                            vm.stateButton('test');
                        }
                        else if(chaterfinal === undefined) {
                            vm.stateButton('clean');   
                        }
                        else if (!isNaN(chaterfinal)) {
                            vm.stateButton('number');
                        }
                        else if (angular.equals(')', chaterfinal)) {
                            vm.stateButton('close');
                        }
                                         
                        for (var i = 0; i < vm.outputSend.length; i++) {
                            if (vm.outputSend[i] === '|' && indexini === 0) {
                                test = test + vm.outputSend[i + 2];
                                indexini = i + 2;
                               
                                i = i + 2;
                            }
                            else if(vm.outputSend[i] !== '|' &&  indexini > 0)
                            {
                                test = test + vm.outputSend[i];

                            }
                            else if (vm.outputSend[i] === '|' && indexini > 0) {
                                if (angular.equals('GENDER', test) ||
                                        angular.equals('RACE', test) ||
                                        angular.equals('WEIGHT', test) ||
                                        angular.equals('SIZE', test)) {
                                            vm.output = vm.output + '||' + test + '||' ;
                                }
                                else {
                                    for (var j = 0 ; j < vm.listTest.length; j++) {
                                        if (vm.listTest[j].id.toString() === test ) {
                                            vm.output = vm.output + '||' + vm.listTest[j].abbr + '||' ;
                                            if (vm.testRequeridid.indexOf(vm.listTest[j].id) === -1) {
                                                vm.testRequeridid.push(vm.listTest[j].id);
                                                vm.testRequeridabbr.push(vm.listTest[j].abbr);
                                                vm.textRequerid = vm.testRequeridabbr.toString();    
                                            }
                                            vm.testadd.push(vm.listTest[j].id);
                                            break;
                                        }
                                    }
                                }
                                                                                              
                                test = '';
                                indexini = 0;
                                i = i + 1;
                            }
                            else if (vm.outputSend[i] === '(') {
                                vm.cantOpen = vm.cantOpen + 1;
                                vm.output = vm.output + vm.outputSend[i];
                            }
                            else if (vm.outputSend[i] === ')') {
                                vm.cantClose = vm.cantClose + 1;
                                vm.output = vm.output + vm.outputSend[i];
                            }
                            else {
                                vm.output = vm.output + vm.outputSend[i];
                            }
                        }
                        vm.formulasentpast = vm.outputSend;
                        vm.formulapast = vm.output;
                      
                        vm.testRequerididpast = vm.testRequeridid;
                        vm.testRequeridabbrpast = vm.testRequeridabbr; 
                        vm.textRequeridpast = vm.textRequerid;
                        vm.cantOpenpast = vm.cantOpen;
                        vm.cantClosepast = vm.cantClose;
                        $scope.textformula = vm.output;
                        vm.getconcurrence();
                        vm.getTest();
                    }
                                   
                });

                $scope.$watch('disabled', function () {                  
                    vm.disabled = $scope.disabled;
                });

                $scope.$watch('idtest', function () {                  
                    vm.getTest();
                });
                         
                vm.getTest();
                vm.stateButton('clean');
                vm.getConfigurationRace();
                vm.getConfigurationTalla();
                vm.getConfigurationPeso();

                function getConfigurationRace() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return configurationDS.getConfigurationKey(auth.authToken, 'ManejoRaza').then(function (data) {
                       vm.manejoRaza = data.data.value === 'False' ? true : false;
                    }, function (error) {
                        vm.errorservice = vm.errorservice + 1;
                        if (vm.errorservice === 0) { vm.modalError(error); }
                    });
                }

                function getConfigurationTalla() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return configurationDS.getConfigurationKey(auth.authToken, 'ManejoTalla').then(function (data) {
                        vm.manejoTalla = data.data.value === 'False' ? true : false;
                    }, function (error) {
                        vm.errorservice = vm.errorservice + 1;
                        if (vm.errorservice === 0) { vm.modalError(error); }
                    });
                }

                function getConfigurationPeso() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return configurationDS.getConfigurationKey(auth.authToken, 'ManejoPeso').then(function (data) {
                        vm.manejoPeso = data.data.value === 'False' ? true : false;
                    }, function (error) {
                        vm.errorservice = vm.errorservice + 1;
                        if (vm.errorservice === 0) { vm.modalError(error); }
                    });
                }

                function save(e) {
       
                    var finalChater = vm.output[vm.output.length - 1]

                    if (vm.cantOpen !== vm.cantClose) {
                        vm.message = true;
                    }

                    else if (angular.equals('+', finalChater) ||
                        angular.equals('-', finalChater) ||
                        angular.equals('*', finalChater) ||
                        angular.equals('/', finalChater) ||
                        angular.equals('^', finalChater)||
                        angular.equals('(', finalChater)||
                        angular.equals('.', finalChater)) {
                        vm.message = true;
                    }
                    else {
                        $scope.textformula = vm.output.replace("undefined", "");
                        $scope.valueformula = vm.outputSend.replace("undefined", "");
                        angular.element('#modal').modal('hide');
                        vm.getconcurrence();
                    
                     }
                } 

                function getconcurrence(){
                    vm.concurrences = [];
                    for (var i = 0; i <= vm.testRequeridid.length; i++) {
                        var concurrence =  {
                          'idTest': null,
                          'concurrence': {
                            'id': vm.testRequeridid[i],
                          },
                          'formula': true,
                          'selected': true
                        }
                        if (vm.testRequeridid[i] !== undefined){
                          vm.concurrences.push(concurrence);                           
                        }

                    }

                    $scope.concurrences = vm.concurrences;
                }

                function cancel() {
                    vm.message = false;
                    vm.testRequeridid = vm.testRequerididpast;
                    vm.testRequeridabbr = vm.testRequeridabbrpast; 
                    vm.textRequerid = vm.textRequeridpast;
                    vm.outputSend  = vm.formulasentpast;
                    vm.output  = vm.formulapast;
                    vm.cantOpen = vm.cantOpenpast;
                    vm.cantClose = vm.cantClosepast;
                    var chaterfinal = vm.outputSend[vm.outputSend.length - 1];

                    if (chaterfinal === '|') {
                        vm.stateButton('test');
                    }
                    else if(chaterfinal === undefined) {
                        vm.stateButton('clean');   
                    }
                    else if (!isNaN(chaterfinal)) {
                        vm.stateButton('number');
                    }
                    else if (angular.equals(')', chaterfinal)) {
                        vm.stateButton('close');
                    }                  
                }   

                function getTest() {
                    
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return testDS.getTestTypeResult(auth.authToken, 1,1,0,0).then(function (data) {
                        if (data.status === 200) {
                            vm.listTest = data.data;

                            vm.changeTest = {
                                  onSelect: function (item) {
                                        vm.stateButton('test');
                                        vm.output = vm.output + '||' + item.abbr + '||';
                                        vm.outputSend =  vm.outputSend + '||' + item.id + '||';

                                        if (vm.testRequeridid.indexOf(item.id) === -1) {
                                            vm.testRequeridid.push(item.id);
                                            vm.testRequeridabbr.push(item.abbr);
                                            vm.textRequerid = vm.testRequeridabbr.toString();    
                                        }
                                      
                                            vm.testadd.push(item.id);    
                                        
                                        
                                        vm.test = -1;    
                                    }
                                };
                        }
                    }, function (error) {});         
                }

                function stateButton(state) {
                    if (state === 'clean') {
                        vm.stateNumber = false;
                        vm.stateDecimal = true;
                        vm.stateSign = true;
                        vm.stateSignNegative = false
                        vm.stateAll = true;
                        vm.stateChater = false;
                        vm.stateClose = true;
                        vm.stateOpen = false;
                        vm.stateSqrt = false;
                        vm.stateLog  = false;
                        vm.stateTest = false;
                    }
                    else if (state === 'number') {
                        vm.stateNumber = false;
                        vm.stateDecimal = false;
                        vm.stateSign = false;
                        vm.stateSignNegative = false
                        vm.stateAll = false;
                        vm.stateChater = false;
                        vm.stateClose = false;
                        vm.stateOpen = true;
                        vm.stateSqrt = true;
                        vm.stateLog  = true;
                        vm.stateTest = true;
                    }
                    else if (state === 'decimal') {
                        vm.stateNumber = false;
                        vm.stateDecimal = true;
                        vm.stateSign = true;
                        vm.stateSignNegative = false;
                        vm.stateAll = false;
                        vm.stateChater = false;
                        vm.stateClose = true;
                        vm.stateOpen = true;
                        vm.stateSqrt = true;
                        vm.stateLog  = true;
                        vm.stateTest = true;
                    }
                    else if (state === 'sign') {
                        vm.stateNumber = false;
                        vm.stateDecimal = true;
                        vm.stateSign = true;
                        vm.stateSignNegative = true;
                        vm.stateAll = false;
                        vm.stateChater = false;
                        vm.stateClose = true;
                        vm.stateOpen = false;
                        vm.stateSqrt = false;
                        vm.stateLog  = false;
                        vm.stateTest = false;
                    }
                    else if (state === 'signNegative') {
                        vm.stateNumber = false;
                        vm.stateDecimal = true;
                        vm.stateSign = true;
                        vm.stateSignNegative = true;
                        vm.stateAll = false;
                        vm.stateChater = false;
                        vm.stateClose = true;
                        vm.stateOpen = false;
                        vm.stateSqrt = false;
                        vm.stateLog  = false;
                        vm.stateTest = false;
                    }
                    else if (state === 'special') {
                        vm.stateNumber = false;
                        vm.stateDecimal = true;
                        vm.stateSign = true;
                        vm.stateSignNegative = false;
                        vm.stateAll = false;
                        vm.stateChater = false;
                        vm.stateClose = true;
                        vm.stateOpen = true;
                        vm.stateSqrt = true;
                        vm.stateLog  = true;
                        vm.stateTest = false;
                    }
                    else if (state === 'open') {
                        vm.stateNumber = false;
                        vm.stateDecimal = true;
                        vm.stateSign = true;
                        vm.stateSignNegative = false;
                        vm.stateAll = false;
                        vm.stateChater = false;
                        vm.stateClose = true;
                        vm.stateOpen = true;
                        vm.stateSqrt = false;
                        vm.stateLog  = false;
                        vm.stateTest = false;
                    }
                    else if (state === 'close') {
                        vm.stateNumber = true;
                        vm.stateDecimal = true;
                        vm.stateSign = false;
                        vm.stateSignNegative = false
                        vm.stateAll = false;
                        vm.stateChater = false;
                        vm.stateClose = false;
                        vm.stateOpen = true;
                        vm.stateSqrt = true;
                        vm.stateLog  = true;
                        vm.stateTest = true;
                    }
                    else if (state === 'test') {
                        vm.stateNumber = true;
                        vm.stateDecimal = true;
                        vm.stateSign = false;
                        vm.stateSignNegative = false;
                        vm.stateAll = false;
                        vm.stateChater = false;
                        vm.stateClose = false;
                        vm.stateOpen = true;
                        vm.stateSqrt = true;
                        vm.stateLog  = true;
                        vm.stateTest = true;
                    }    
                }

                function press(num) {
                    vm.message = false;
                    if (!isNaN(num)) {
                        vm.stateButton('number');
                        vm.output = vm.output + num;
                        vm.outputSend = vm.outputSend + num;
                        var cant = 0;
                        for (var i = vm.output.length - 1; i >= 0; i--) {
                            if (isNaN(vm.output[i]) && vm.output[i] === '.') {
                                cant = cant + 1; 
                                break;
                            }
                            else if (isNaN(vm.output[i]) && vm.output[i] !== '.') {
                                break;
                            }
                        }
                        if (cant > 0) {
                            vm.stateDecimal = true;
                        }
                    }
                    else if (angular.equals('.', num)) {
                        vm.stateButton('decimal');
                        vm.output = vm.output + num;
                        vm.outputSend = vm.outputSend + num;
                    }
                    else if (angular.equals('+', num) ||
                        angular.equals('*', num) ||
                        angular.equals('/', num) ||
                        angular.equals('^', num)) {
                        vm.stateButton('sign');
                        vm.output = vm.output + num;
                        vm.outputSend = vm.outputSend + num;
                    }
                    else if (angular.equals('-', num)) {
                        vm.output = vm.output + num;
                        vm.outputSend = vm.outputSend + num; 
                        vm.stateButton('signNegative');
                    }
                    else if (angular.equals('Sqrt(', num) || angular.equals('Log(', num)) {
                        vm.cantOpen = vm.cantOpen + 1;
                        vm.stateButton('special');
                        vm.output = vm.output + num;
                        vm.outputSend = vm.outputSend + num;
                    }

                    else if (angular.equals('(', num)) {
                        vm.stateButton('open');
                        vm.cantOpen = vm.cantOpen + 1;
                        vm.output = vm.output + num;
                        vm.outputSend = vm.outputSend + num;
                    }
                    else if (angular.equals(')', num)) {
                        
                        if (vm.cantOpen > vm.cantClose) {
                            vm.cantClose = vm.cantClose + 1 ;
                            vm.stateButton('close');
                            vm.output = vm.output + num;
                            vm.outputSend = vm.outputSend + num;
                        }
                    }
                    else if (angular.equals('||GENDER||', num) ||
                        angular.equals('||RACE||', num) ||
                        angular.equals('||WEIGHT||', num) ||
                        angular.equals('||SIZE||', num)) {
                        vm.stateButton('test');
                        vm.output = vm.output + num;
                        vm.outputSend = vm.outputSend + num;
                    }
                    else if (angular.equals('x', num)) {
                        
                        if (vm.output[vm.output.length - 1] === '(') {
                            vm.cantOpen = vm.cantOpen - 1;
                        }
                        else if (vm.output[vm.output.length - 1] === ')') {
                            vm.cantClose = vm.cantClose - 1;
                        }


                        var chatertest = vm.output[vm.output.length - 1] == '|' ? true : false;

                        vm.output = (vm.output.substring(0,  vm.output.length - 1));
                        vm.outputSend = (vm.outputSend.substring(0,  vm.outputSend.length - 1));

                        if (!isNaN(vm.output[vm.output.length - 1])) {
                            vm.stateButton('number');
                            
                            var cant = 0;
                            for (var i = vm.output.length - 1; i >= 0; i--) {
                                if (isNaN(vm.output[i]) && vm.output[i] === '.') {
                                    cant = cant + 1; 
                                    break;
                                }
                                else if (isNaN(vm.output[i]) && vm.output[i] !== '.') {
                                    break;
                                }
                            }
                            if (cant > 0) {
                                vm.stateDecimal = true;
                            }
                        }
                        else if (angular.equals('.', vm.output[vm.output.length - 1])) {
                            vm.stateButton('decimal');
                            
                        }
                        else if (angular.equals('+', vm.output[vm.output.length - 1]) ||
                            angular.equals('-', vm.output[vm.output.length - 1]) ||
                            angular.equals('*', vm.output[vm.output.length - 1]) ||
                            angular.equals('/', vm.output[vm.output.length - 1]) ||
                            angular.equals('^', vm.output[vm.output.length - 1])) {
                            vm.stateButton('sign');
                            
                        }
                        else if (vm.output.substring(vm.output.length - 4, vm.output.length) === 'Sqrt') {
                            vm.output = (vm.output.substring(0,  vm.output.length - 4));
                            vm.outputSend = (vm.outputSend.substring(0,  vm.outputSend.length - 4));  
                            vm.stateButton('sign');
                            vm.cantOpen = vm.cantOpen - 1;
                        }
                        else if (vm.output.substring(vm.output.length - 3, vm.output.length) === 'Log') {
                            vm.output = (vm.output.substring(0,  vm.output.length - 3));
                            vm.outputSend = (vm.outputSend.substring(0,  vm.outputSend.length - 3));
                            vm.stateButton('sign');
                            
                        }

                        else if (vm.output[vm.output.length - 1] === '|' && chatertest) {
                            var character = 4;
                            for (var i = vm.output.length - 3 ; i >= 0; i--) {
                                if (vm.output[i] !== '|') {
                                    character = character + 1;
                                }
                                else {
                                    break;
                                }
                            }

                            vm.output = (vm.output.substring(0,  vm.output.length - character));

                            character = 4;
                            for (var i = vm.outputSend.length - 3 ; i >= 0; i--) {
                                if (vm.outputSend[i] !== '|') {
                                    character = character + 1;
                                }
                                else {
                                    break;
                                }
                            }

                            var idTestDelete =  (vm.outputSend.substring(vm.outputSend.length - character + 2,  vm.outputSend.length - 1));
                            var cantest = 0;
                            
                            for (var i = 0; i < vm.testadd.length; i++) {
                                if (vm.testadd[i] === Number(idTestDelete)) {
                                  cantest = cantest  + 1
                                  if (cantest > 1) {
                                     vm.testadd.splice(i,1);
                                  }
                                }
                            }

                            for (var i = 0; i < vm.testRequeridid.length; i++) {
                                if (vm.testRequeridid[i] === Number(idTestDelete)) {
                                    if (cantest <= 1) {
                                        vm.testRequeridid.splice(i,1);
                                        vm.testRequeridabbr.splice(i,1);
                                        break;    
                                    }
                                    else {
                                        break;
                                    }
                                    
                                }
                            }

                            vm.textRequerid = vm.testRequeridabbr.toString(); 
                                     
                            vm.outputSend = (vm.outputSend.substring(0,  vm.outputSend.length - character));
                            vm.stateButton('sign');                       


                        }
                        else if (angular.equals('(', vm.output[vm.output.length - 1])) {
                            vm.stateButton('open');
                        }
                        else if (angular.equals(')', vm.output[vm.output.length - 1])) {
                            vm.stateButton('close');
                        }
                        else if (angular.equals('|', vm.output[vm.output.length - 1]) && !chatertest) {
                            vm.stateButton('test');
                        }
                        else {
                            vm.stateButton('clean');
                        }
                    }

                    else if (angular.equals('clean', num)) {
                        vm.output = ''; 
                        vm.outputSend = '';
                        vm.testRequeridid = [];
                        vm.testRequeridabbr = [];
                        vm.textRequerid = '';
                        vm.cantOpen = 0;
                        vm.cantClose = 0;
                        vm.stateButton('clean');
                    }
                }


            }],
            controllerAs: 'calculator'
        };
        return directive;
    }

})();
/* jshint ignore:end */
