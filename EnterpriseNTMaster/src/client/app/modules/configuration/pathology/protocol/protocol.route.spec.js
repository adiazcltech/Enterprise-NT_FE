/* jshint -W117, -W030 */
describe('protocolRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/protocol/protocol.html';

      beforeEach(function() {
          module('app.protocol', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state protocol to url /protocol ', function() {
          expect($state.href('protocol', {})).to.equal('/protocol');
      });
      it('should map /protocol route to protocol View template', function() {
          expect($state.get('protocol').templateUrl).to.equal(view);
      });
  });
});
