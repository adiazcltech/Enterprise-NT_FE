/* jshint -W117, -W030 */
describe('fixativeRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/fixative/fixative.html';

      beforeEach(function() {
          module('app.fixative', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state fixative to url /fixative ', function() {
          expect($state.href('fixative', {})).to.equal('/fixative');
      });
      it('should map /fixative route to fixative View template', function() {
          expect($state.get('fixative').templateUrl).to.equal(view);
      });
  });
});
