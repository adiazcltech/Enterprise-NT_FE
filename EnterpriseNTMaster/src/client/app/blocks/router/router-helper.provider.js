/* Help configure the state-base ui.router */
(function () {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routerHelper', routerHelperProvider);

    routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
    /* @ngInject */
    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
        /* jshint validthis:true */
        var config = {
            docTitle: undefined,
            resolveAlways: {}
        };

        if (!(window.history && window.history.pushState)) {
            window.location.hash = '/';
        }

        $locationProvider.html5Mode(true);

        this.configure = function (cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;
        RouterHelper.$inject = ['$location', '$rootScope', '$state', 'logger', 'localStorageService', 'moduleDS', '$filter'];
        /* @ngInject */
        function RouterHelper($location, $rootScope, $state, logger, localStorageService, moduleDS, $filter) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                stateCounts: stateCounts,
                getModuleMaster: getModuleMaster
            };


            init();

            return service;

            ///////////////

            function configureStates(states, otherwisePath) {
                states.forEach(function (state) {
                    state.config.resolve =
                        angular.extend(state.config.resolve || {}, config.resolveAlways);

                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }

            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError',
                    function (event, toState, toParams, fromState, fromParams, error) {
                        if (handlingStateChangeError) {
                            return;
                        }
                        stateCounts.errors++;
                        handlingStateChangeError = true;
                        var destination = (toState &&
                            (toState.title || toState.name || toState.loadedTemplateUrl)) ||
                            'unknown target';
                        var msg = 'Error routing to ' + destination + '. ' +
                            (error.data || '') + '. <br/>' + (error.statusText || '') +
                            ': ' + (error.status || '');
                        logger.warning(msg, [toState]);
                        $location.path('/');
                    }
                );
            }

            function init() {
                handleRoutingErrors();
                updateDocTitle();
            }

            function getStates() { return $state.get(); }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        var title = config.docTitle + ' ' + (toState.title || '');
                        $rootScope.title = title; // data bind to <title>

                        getModuleMaster(toState.idpage);


                    }
                );
            }

            function getModuleMaster(idpage) {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                if (auth !== null && auth.configureinit === 0) {
                    if (idpage !== undefined) {
                        return moduleDS.getModuleMasterUser(auth.authToken, auth.id).then(function (data) {

                            var pageValid = 0;

                            if (data.data.length > 0) {
                                var pageValid = $filter('filter')(data.data, { id: idpage }, true)
                               
                                if (pageValid.length === 0) {
                                    $state.go('menuMaster');
                                }
                            }
                            else {
                                $state.go('menuMaster');
                            }

                            $rootScope.module = data.data;
                        }, function (error) {
                            if (error.data === null) {
                                logger.error(error);
                            }
                        });

                    }
                }
                else if (auth !== null && auth.configureinit === 1) {
                    $state.go('configureinitial');

                }


            }
        }
    }
})();
