(function() {
    'use strict';

    angular.module('app', [
        'AxelSoft',
        'app.core',
        'app.widgets',
        'app.layout',
        'app.menuMaster',
        'app.account',
        'app.configuration',
        'btford.socket-io'
    ]);
})();