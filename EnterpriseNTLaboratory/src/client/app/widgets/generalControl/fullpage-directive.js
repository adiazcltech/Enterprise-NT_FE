/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('fullpage', function(){
            return {
                restrict: 'A',
                link: function ( scope, element, attrs ) {
                    // unwrap $(element)
                    element.pagepiling( scope.$eval( attrs.fullpage ) );
        
                }
            };
        });
})();
/* jshint ignore:end */


