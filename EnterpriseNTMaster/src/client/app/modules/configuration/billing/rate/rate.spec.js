/* jshint -W117, -W030 */
describe('rateRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/billing/rate/rate.html';

    beforeEach(function() {
      module('app.rate', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
    });

    it('should map state rate to url /rate ', function() {
      expect($state.href('rate', {})).to.equal('/rate');
    });
    it('should map /rate route to rate View template', function() {
      expect($state.get('rate').templateUrl).to.equal(view);
    });
     
  });
});
