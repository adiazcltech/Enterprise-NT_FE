/* jshint -W117, -W030 */
describe('sampleRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/test/sample/sample.html';

    beforeEach(function() {
      module('app.sample', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state sample to url /sample ', function() {
      expect($state.href('sample', {})).to.equal('/sample');
    });
    it('should map /sample route to sample View template', function() {
      expect($state.get('sample').templateUrl).to.equal(view);
    });
     
  });
});
