/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('scrollToTop', function(){
            return {
                restrict: 'A',
                link: function postLink(scope, elem, attrs) {
                    scope.$watch(attrs.scrollToTop, function() {
                        setTimeout(function(){ elem[0].scrollTop = 3; }, 500);
                    });

                    attrs.$observe('movescroll', function(moveAttribute) {
                        if (moveAttribute !== '') {
                            setTimeout(function(){ elem[0].scrollTop = elem[0].scrollTop + parseInt(moveAttribute) }, 50);    
                        }
                        
                    })
                }
            };
        });
})();
/* jshint ignore:end */
