/* jshint -W117, -W030 */
describe('pathologistRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/pathologist/pathologist.html';

      beforeEach(function() {
          module('app.pathologist', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state pathologist to url /pathologist ', function() {
          expect($state.href('pathologist', {})).to.equal('/pathologist');
      });
      it('should map /pathologist route to pathologist View template', function() {
          expect($state.get('pathologist').templateUrl).to.equal(view);
      });
  });
});
