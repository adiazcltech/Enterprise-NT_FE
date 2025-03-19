/* jshint ignore:start */
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('csvpricetest', csvpricetest);

    csvpricetest.$inject = ['$q','ModalService','localStorageService','configurationDS'];

    /* @ngInject */
    function csvpricetest($q,ModalService,localStorageService,configurationDS) {
        var directive = {
            templateUrl: 'app/widgets/csvpricetest.html',
            restrict: 'EA',
            scope: {
                disabled: '=?disabled',
                json: '=?',
                quantitydata:'=',
                importdata:"&",
                errorarray:'=?'

                
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.disabled = $scope.disable;
                vm.CSV2JSON = CSV2JSON;
                vm.CSVToArray = CSVToArray;
                vm.getConfigurationSeparadorLista = getConfigurationSeparadorLista;
                vm.correctImport = true; 
                vm.arraydata = [];
                vm.filename = '';
               
                vm.getConfigurationSeparadorLista();
                $scope.$watch('disabled', function () {                  
                    vm.disabled = $scope.disabled;

                });

                $scope.$watch('json', function () {
                    if ($scope.json != null || $scope.json != undefined) {
                        $scope.importdata();    
                    }
                })

                // $scope.$watch('filename', function () { 
                //     vm.filename = $scope.filename                  
                // })

                $scope.$watch('errorarray', function () {  
                    vm.errorarray = $scope.errorarray; 
                    if (vm.errorarray !== undefined) {
                        ModalService.showModal({
                            templateUrl: 'validationFormat.html',
                            controller: 'validationFormatController',
                            inputs: {
                                    correctImport: vm.correctImport,
                                    quantityOrigin: vm.quantityOrigin,
                                    quantitydata: vm.quantitydata,
                                    errorarray:  vm.errorarray,
                                    arraydata:  vm.arraydata
                            }
                        }).then(function (modal) {
                            modal.element.modal();
                        });
                    }              
                });

                $scope.$watch('quantitydata', function () {    
                    vm.correctImport = true; 
                    vm.quantitydata = $scope.quantitydata;
                    vm.errorarray = [];
                    if (vm.quantitydata > -1) {
                        $scope.quantitydata = -1;
                        ModalService.showModal({
                            templateUrl: 'validationFormat.html',
                            controller: 'validationFormatController',
                            inputs: {
                                    correctImport: vm.correctImport,
                                    quantityOrigin: vm.quantityOrigin,
                                    quantitydata: vm.quantitydata,
                                    errorarray:vm.errorarray,
                                    arraydata:  vm.arraydata
                            }
                            }).then(function (modal) {
                                modal.element.modal();
                            });    
                    }              
                    
                });

                function getConfigurationSeparadorLista() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return configurationDS.getConfigurationKey(auth.authToken, 'SeparadorLista').then(function (data) {
                        if (data.status === 200) {
                            vm.SeparadorLista = data.data.value;
                        }
                    }, function (error) {
                        if (vm.errorservice === 0) {
                            vm.modalError(error);
                            vm.errorservice = vm.errorservice + 1;
                        }
                    });
                }

                $scope.filecsv = function() {
                    var files = event.target.files;
                    if (files[0].type === "application/vnd.ms-excel"  || files[0].type === "text/csv") {
                        vm.filename = files[0].name;
                        var r = new FileReader();
                        r.onload = function(e) {
                            var contents = e.target.result;
                            $scope.$apply(function () {
                                $scope.json = vm.CSV2JSON(contents);                                  
                            });
                        };
                        r.readAsText(files[0]);
                    }
                    else {
                        vm.filename = '';
                        vm.correctImport = false;
                        vm.errorarray = [];
                        vm.quantitydata = null;
                        ModalService.showModal({
                        templateUrl: 'validationFormat.html',
                        controller: 'validationFormatController',
                        inputs: {
                                correctImport: vm.correctImport,
                                quantityOrigin: vm.quantityOrigin,
                                quantitydata: vm.quantitydata,
                                errorarray:  vm.errorarray,
                                arraydata:  vm.arraydata
                        }
                        }).then(function (modal) {
                            modal.element.modal();
                        });
                    }

                    files[0].value = '';

                }

                function CSV2JSON(csv) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var array = CSVToArray(csv);
                    var objArray = [];
                    for (var i = 1; i < array.length; i++) {
                        objArray[i - 1] = {};
                        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                            var key = array[0][k];
                            var anidkey = key.split('/');
                            if (anidkey.length > 1) {
                                var key1 = anidkey[0];
                                var key2 = anidkey[1];
                                
                                var objArray1 = {};
                                objArray1[key2] = array[i][k];
                                objArray[i - 1][key1] = objArray1;    
                            }
                            else {
                                objArray[i - 1][key] = array[i][k];    
                            }

                            
                            if (k == array[0].length - 1) {
                                var key = "id";
                                objArray[i - 1][key] = auth.id;
                            }
                        }
                    }
                    vm.quantityOrigin =  objArray.length;
                    vm.arraydata = objArray;
                    var json = JSON.stringify(objArray);
                    var str = json.replace(/},/g, "},\r\n");

                    return str;
                }

                function CSVToArray(strData) {
                    // Check to see if the delimiter is defined. If not,
                    // then default to comma.
                    var strDelimiter = ( vm.SeparadorLista || ";");
                    // Create a regular expression to parse the CSV values.
                    var objPattern = new RegExp((
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
                    // Create an array to hold our data. Give the array
                    // a default empty first row.
                    var arrData = [[]];
                    // Create an array to hold our individual pattern
                    // matching groups.
                    var arrMatches = null;
                    // Keep looping over the regular expression matches
                    // until we can no longer find a match.
                    while (arrMatches = objPattern.exec(strData)) {
                        // Get the delimiter that was found.
                        var strMatchedDelimiter = arrMatches[1];
                        // Check to see if the given delimiter has a length
                        // (is not the start of string) and if it matches
                        // field delimiter. If id does not, then we know
                        // that this delimiter is a row delimiter.
                        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                            // Since we have reached a new row of data,
                            // add an empty row to our data array.
                            arrData.push([]);
                        }
                        // Now that we have our delimiter out of the way,
                        // let's check to see which kind of value we
                        // captured (quoted or unquoted).
                        if (arrMatches[2]) {
                            // We found a quoted value. When we capture
                            // this value, unescape any double quotes.
                            var strMatchedValue = arrMatches[2].replace(
                            new RegExp("\"\"", "g"), "\"");
                        } else {
                            // We found a non-quoted value.
                            var strMatchedValue = arrMatches[3];
                        }
                        // Now that we have our value string, let's add
                        // it to the data array.
                        arrData[arrData.length - 1].push(strMatchedValue);
                    }
                    // Return the parsed data.
                    return (arrData);
                }
            }],
            controllerAs: 'csvpricetest'
        };
        return directive;
    }
    angular 
    .module('app.widgets')
    .controller('validationFormatController', validationFormatController);
    validationFormatController.$inject = ['$scope','close','correctImport', 'quantityOrigin', 'quantitydata', 'errorarray', 'arraydata','$filter'];

    function validationFormatController($scope, close, correctImport, quantityOrigin, quantitydata, errorarray, arraydata,$filter) {
        $scope.correctImport = correctImport;
        $scope.quantityOrigin = quantityOrigin;
        $scope.quantitydata = quantitydata;
        $scope.listdata = [];
        $scope.showdatainvalid = false;
        $scope.errorFile = false;
        if (errorarray !== null) {
            if (errorarray.length > 0) {
                $scope.showdatainvalid = true;

                errorarray.forEach(function (value) {
                    var item = value.split('|');
                    var data = arraydata[item[2] - 1][item[1]].id === undefined ? arraydata[item[2] - 1][item[1]] : arraydata[item[2] - 1][item[1]].id 
                    //var data = "";
                    var error = item[0] === '1' ? $filter('translate')('0096') : item[0] === '2' ? $filter('translate')('0483') : $filter('translate')('0584') 
                    var item = value.split('|'); 
                    var object = {
                        'name': item[1],
                        'value': item[2],
                        'data': data,
                        'error': error
                    }

                    $scope.listdata.push(object);
                });    
            }
        }

        if (quantitydata === undefined && quantitydata !== null) {
            $scope.errorFile = true;
        }
        


        
        $scope.close = function (result) {
            close(result, 500);
        };
    }

})();
/* jshint ignore:end */
