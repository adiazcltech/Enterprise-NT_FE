/* jshint -W117, -W030 */
describe('BranchRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/opportunity/histogram/histogram.html';

    beforeEach(function() {
      module('app.histogram', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state histogram to url /histogram ', function() {
      expect($state.href('histogram', {})).to.equal('/histogram');
    });
    it('should map /histogram route to area View template', function() {
      expect($state.get('histogram').templateUrl).to.equal(view);
    });
     
  });
});
