/* jshint -W117, -W030 */
describe('macroscopytemplateRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/macroscopytemplate/macroscopytemplate.html';

      beforeEach(function() {
          module('app.macroscopytemplate', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state macroscopytemplate to url /macroscopytemplate ', function() {
          expect($state.href('macroscopytemplate', {})).to.equal('/macroscopytemplate');
      });
      it('should map /macroscopytemplate route to macroscopytemplate View template', function() {
          expect($state.get('macroscopytemplate').templateUrl).to.equal(view);
      });
  });
});
