
/* jshint ignore:start */
(function() {
  'use strict';
	
	angular
	  .module('app.widgets')
	  .directive('scroll', scroll);

	   scroll.$inject = ['$window', '$q'];

	    function scroll($window, $q) {
		   	var directive = {
	   		    templateUrl: 'app/widgets/event-scroll.html',
		        restrict: 'A',
		        scope: {
			        disable:'=?disable',
			        height: '=height'
		        },
		        controller: ['$scope', function($scope) {
                	var vm = this;

				    return function(element) {
				      
				        angular.element($window).bind("scroll", function() {
				            if (this.pageYOffset >= 100) {
				                 $scope.height = this.pageYOffset;
				                 console.log('Scrolled below header.');
				             } else {
				                 $scope.height = this.pageYOffset;
				                 console.log('Header is in view.');
				             }
				        });
				    };                	

                }],
                controllerAs: 'scroll'
			};
			return directive;
        }


})();

