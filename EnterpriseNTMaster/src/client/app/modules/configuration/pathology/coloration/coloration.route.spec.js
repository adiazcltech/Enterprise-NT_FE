/* jshint -W117, -W030 */
describe('colorationRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/coloration/coloration.html';

      beforeEach(function() {
          module('app.coloration', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state coloration to url /coloration ', function() {
          expect($state.href('coloration', {})).to.equal('/coloration');
      });
      it('should map /coloration route to coloration View template', function() {
          expect($state.get('coloration').templateUrl).to.equal(view);
      });
  });
});
