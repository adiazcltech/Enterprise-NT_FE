/* jshint -W117, -W030 */
describe('ServiceRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/demographics/service/service.html';

    beforeEach(function() {
      module('app.service', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state service to url /service ', function() {
      expect($state.href('service', {})).to.equal('/service');
    });
    it('should map /service route to service View template', function() {
      expect($state.get('service').templateUrl).to.equal(view);
    });
     
  });
});
