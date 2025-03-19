/* jshint -W117, -W030 */
describe('LaboratoryRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/integration/middleware/middleware.html';

    beforeEach(function() {
      module('app.middleware', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
    });

    it('should map state middleware to url /middleware ', function() {
      expect($state.href('middleware', {})).to.equal('/middleware');
    });
    it('should map /middleware route to middleware View template', function() {
      expect($state.get('middleware').templateUrl).to.equal(view);
    });
     
  });
});
