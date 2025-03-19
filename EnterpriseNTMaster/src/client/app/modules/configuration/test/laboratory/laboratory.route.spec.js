/* jshint -W117, -W030 */
describe('LaboratoryRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/test/laboratory/laboratory.html';

    beforeEach(function() {
      module('app.laboratory', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
    });

    it('should map state laboratory to url /laboratory ', function() {
      expect($state.href('laboratory', {})).to.equal('/laboratory');
    });
    it('should map /laboratory route to laboratory View template', function() {
      expect($state.get('laboratory').templateUrl).to.equal(view);
    });
     
  });
});
