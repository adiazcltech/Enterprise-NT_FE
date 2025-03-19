/* jshint ignore:start */
(function () {
    'use strict';
    angular.module('app', [
        'app.core',
        'app.widgets',
        'app.layout',
        'app.sidebar',
        'app.account',
        'app.indicators',
        'app.microbiology',
        'app.ordermanagement',
        'app.patientmanagement',
        'app.reportsandconsultations',
        'app.result',
        'app.samplesmanagement',
        'app.stadistics',
        'app.tools',
        'app.audit',
        'app.billing',
        'app.pathology',
        'app.transplants',
        'kendo.directives',
        'ngWebSocket',
        'ngBase64Download',
        'ngWebworker',
        'ui.tinymce',
        'btford.socket-io'
    ]).constant('variables', {
        header_main_height: 48,
        easing_swiftOut: [0.4, 0, 0.2, 1],
        bez_easing_swiftOut: $.bez([0.4, 0, 0.2, 1])
    });
})();
/* jshint ignore:end */
