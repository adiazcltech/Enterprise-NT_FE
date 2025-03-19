/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('pdkNextInputOnEnter', function() {
        
        var includeTags = ['INPUT', 'SELECT'];
        var count = 0;

        function link(scope, element, attrs) {
            element.on('keydown', function (e) {
                // Go to next form element on enter and only for included tags
                if ((e.keyCode == 13 || e.keyCode == 9) && includeTags.indexOf(e.target.tagName) != -1) {
                    console.log(e.keyCode)
                    if (count === 0) {
                        setTimeout(function(){ // Find all form elements that can receive focus
                            var focusable = element[0].querySelectorAll('textarea,input.orderentrytab:enabled')//element[0].querySelectorAll('input,select,button,textarea:not(:disabled)');

                            // Get the index of the currently focused element
                            var currentIndex = Array.prototype.indexOf.call(focusable, e.target)
                           
                            // Find the next items in the list
                            var nextIndex = currentIndex === -1 ? 0 : currentIndex == focusable.length - 1 ? currentIndex : currentIndex + 1;

                            // Focus the next element
                            if(nextIndex >= 0 && nextIndex < focusable.length)
                            {
                                if (currentIndex === -1 || focusable[currentIndex].value !== '') {
                                    focusable[nextIndex].focus();
                                }
                            }

                        }, 100);
                    }
                }

                else if(e.keyCode === 16){
                    count = 1;
                }
            });
            element.on('keyup', function (e) {
                if(e.keyCode === 16){
                    count = 0;
                }
            });
        }

        return {
            restrict: 'A',
            link: link
        };
    });
})();
/* jshint ignore:end */



