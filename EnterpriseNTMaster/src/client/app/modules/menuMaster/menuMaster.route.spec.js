/* jshint -W117, -W030 */
describe('rolRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/menuMaster/menuMaster.html';

    beforeEach(function() {
      module('app.menuMaster', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state menuMaster to url /menuMaster ', function() {
      expect($state.href('menuMaster', {})).to.equal('/menuMaster');
    });
    it('should map /menuMaster route to menuMaster View template', function() {
      expect($state.get('menuMaster').templateUrl).to.equal(view);
    });
     
  });
});
