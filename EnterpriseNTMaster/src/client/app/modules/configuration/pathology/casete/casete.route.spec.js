/* jshint -W117, -W030 */
describe('caseteRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/casete/casete.html';

      beforeEach(function() {
          module('app.casete', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state casete to url /casete ', function() {
          expect($state.href('casete', {})).to.equal('/casete');
      });
      it('should map /casete route to casete View template', function() {
          expect($state.get('casete').templateUrl).to.equal(view);
      });
  });
});
