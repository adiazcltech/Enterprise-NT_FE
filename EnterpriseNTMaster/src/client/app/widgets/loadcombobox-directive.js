
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('loadcombobox', loadcombobox);

    loadcombobox.$inject = ['$filter', 'localStorageService', 'logger'];

    /* @ngInject */
    function loadcombobox($filter, localStorageService, logger) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/loadcombobox-directive.html',
            scope: {
                change: '&',
                listorigin:'=?listorigin',
                cleanselect:'=?cleanselect',
                placeholder:'=placeholder',
                ngModel:'=?ngModel',
                disabled:'=?disabled',
                fieldCode:'=?fieldCode',
                fieldName:'=?fieldName',
                viewfieldCode:'=viewfieldCode'

            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                
                vm.changelist = changelist;
                vm.OrderFilterFn = OrderFilterFn;
                vm.fetch = fetch;
                vm.list = [];
                vm.item = {}
                vm.iditem = 0;
                vm.viewfieldCode = $scope.viewfieldCode === true || $scope.viewfieldCode === undefined  ? true : false; 

                $scope.$watch('listorigin', function () {
                    
                    //vm.listorigin =  $scope.listorigin;
                    vm.listorigin =  $filter('orderBy')($scope.listorigin,'name',false) ;
                    vm.placeholder =  $filter('translate')($scope.placeholder); 
                    vm.fieldCode = $scope.fieldCode === undefined ? 'code' : $scope.fieldCode;
                    vm.fieldName = $scope.fieldName === undefined ? 'name' : $scope.fieldName;
                                      
                  
                    if ($scope.ngModel !== undefined && $scope.ngModel !== null) {
                        if ($scope.ngModel.selected !== undefined) {
                            $scope.ngModel.selected = $scope.ngModel  
                        }
                    }
                    
                });
                
           
               $scope.$watch('ngModel', function () {
                    if (vm.item !== undefined ) {
                        vm.item.selected = $scope.ngModel  
                    }
                });

                $scope.$watch('disabled', function () {
                    vm.disabled =  $scope.disabled;             
                });

            

                function changelist($item) {
                    $scope.ngModel = vm.item.selected;
                    setTimeout(function(){
                        
                        $scope.change({ item: $item }) 
                        if ($scope.cleanselect) {
                            vm.item = undefined;
                        }
                    }, 200);
                    
                }

                 function OrderFilterFn(groups) {
                   groups=groups.reverse();
                   var hola = _.filter(vm.list, { 'showbutton': true})
                   
                    for (var i = 0; i < hola.length; i++) {
                          hola[i].showbutton = false;
                    }                       
                   
                   if(groups.length!==0 && vm.list.length > 49){
                        groups[groups.length-1].items[groups[groups.length-1].items.length -1].showbutton=true;
                   }
                   
                   return groups;                    
                }

                function fetch($select, $event,id) {
                    if(vm.listorigin !== undefined){
                        if ($event) {
                            vm.limit = vm.limit + 50;
                            var listcopy =  _.clone(vm.listorigin);
                            vm.list = listcopy.splice(0, vm.limit);
                            $event.stopPropagation();
                            $event.preventDefault();

                        } else {

                            if ($select.search !== '') {
                                var listcopy =  _.clone(vm.listorigin);
                                 
                                if(vm.listorigin[0].code===undefined){
                                    vm.list = _.filter(vm.listorigin, function(o) { return o.name.toUpperCase().indexOf($select.search.toUpperCase()) > -1 });
                                
                                 }else{
                                    vm.list = _.filter(vm.listorigin, function(o) { return o.name.toUpperCase().indexOf($select.search.toUpperCase()) > -1 || o.code.toUpperCase().indexOf($select.search.toUpperCase()) > -1  });
                                }

                                if (vm.list.length > 50) {
                                    vm.limit = 50;
                                    vm.list = vm.list.splice(0, vm.limit);
                                }
                            }
                            else {
                                if (vm.listorigin.length > 50) {
                                   vm.list = [];
                                   vm.limit = 50;
                                   var listcopy =  _.clone(vm.listorigin);
                                   vm.list = vm.listorigin === undefined? [] : listcopy.splice(0, vm.limit);
                                }
                                else {
                                    vm.list = vm.listorigin;
                                }
                             
                            }
                        }
                     }   
                }
            }],
            controllerAs: 'loadcombobox'
        };
        return directive;
    }
})();
/* jshint ignore:end */

