// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('blocks.exception')
    .provider('exceptionHandler', exceptionHandlerProvider)
    .config(config);

  /**
   * Must configure the exception handling
   */
  function exceptionHandlerProvider() {
    this.config = {
      appErrorPrefix: undefined
    };

    this.configure = function (appErrorPrefix) {
      this.config.appErrorPrefix = appErrorPrefix;
    };


    this.$get = function () {
      return { config: this.config };
    };
  }

  config.$inject = ['$provide'];

  /**
   * Configure by setting an optional string value for appErrorPrefix.
   * Accessible via config.appErrorPrefix (via config value).
   * @param  {Object} $provide
   */
  /* @ngInject */
  function config($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
  }

  extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger', '$injector'];

  /**
   * Extend the $exceptionHandler service to also display a toast.
   * @param  {Object} $delegate
   * @param  {Object} exceptionHandler
   * @param  {Object} logger
   * @return {Function} the decorated $exceptionHandler service
   */
  function extendExceptionHandler($delegate, exceptionHandler, logger, $injector) {
    return function (exception, cause) {
      var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
      var errorData = { exception: exception, cause: cause };
      exception.message = appErrorPrefix + exception.message;
      /**
       * Could add the error to a service's collection,
       * add errors to $rootScope, log errors to remote web server,
       * or log locally. Or throw hard. It is entirely up to you.
       * throw exception;
       *
       * @example
       *     throw { message: 'error message we added' };
       */

      if (localStorage.getItem("Enterprise_NT.authorizationData") !== null) {
        var datauser = JSON.parse(localStorage['ls.Enterprise_NT.authorizationData']);
        var data = {
          "id": 0,
          "date": new Date().getTime(),
          "code": 2,
          "message": exception.message,
          "host": location.host,
          "url": location.pathname,
          "detail": exception.stack,
          "idUser": datauser.id,
          "user": datauser.userName,
          "errorfields": [],
          "type": 1
        };
        $injector.get('exceptionDS').insertexception(datauser.authToken, data);
        logger.error(exception.message, errorData);
        $delegate(exception, cause);
      }
    };
  }
})();
/* jshint ignore:end */