/* jshint -W117, -W030 */
describe('profilRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/test/profil/profil.html';

    beforeEach(function() {
      module('app.profil', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state profil to url /profil ', function() {
      expect($state.href('profil', {})).to.equal('/profil');
    });
    it('should map /profil profil to profil View template', function() {
      expect($state.get('profil').templateUrl).to.equal(view);
    });
     
  });
});
