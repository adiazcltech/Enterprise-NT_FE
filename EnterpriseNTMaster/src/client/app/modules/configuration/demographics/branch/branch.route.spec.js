/* jshint -W117, -W030 */
describe('BranchRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/demographics/branch/branch.html';

    beforeEach(function() {
      module('app.branch', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state branch to url /branch ', function() {
      expect($state.href('branch', {})).to.equal('/branch');
    });
    it('should map /branch route to area View template', function() {
      expect($state.get('branch').templateUrl).to.equal(view);
    });
     
  });
});
