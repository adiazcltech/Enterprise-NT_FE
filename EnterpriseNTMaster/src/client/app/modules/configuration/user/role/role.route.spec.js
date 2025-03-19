/* jshint -W117, -W030 */
describe('rolRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/user/role/role.html';

    beforeEach(function() {
      module('app.role', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state role to url /role ', function() {
      expect($state.href('role', {})).to.equal('/role');
    });
    it('should map /role route to role View template', function() {
      expect($state.get('role').templateUrl).to.equal(view);
    });
     
  });
});
