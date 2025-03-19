/* jshint -W117, -W030 */
describe('processingtimeRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/processingtime/processingtime.html';

      beforeEach(function() {
          module('app.processingtime', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state processingtime to url /processingtime ', function() {
          expect($state.href('processingtime', {})).to.equal('/processingtime');
      });
      it('should map /processingtime route to processingtime View template', function() {
          expect($state.get('processingtime').templateUrl).to.equal(view);
      });
  });
});
