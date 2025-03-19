/* jshint -W117, -W030 */
describe('fieldRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/field/field.html';

      beforeEach(function() {
          module('app.field', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state field to url /field ', function() {
          expect($state.href('field', {})).to.equal('/field');
      });
      it('should map /field route to field View template', function() {
          expect($state.get('field').templateUrl).to.equal(view);
      });
  });
});
