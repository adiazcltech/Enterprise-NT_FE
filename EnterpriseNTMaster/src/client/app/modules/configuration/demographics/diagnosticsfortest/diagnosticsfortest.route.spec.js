/* jshint -W117, -W030 */
describe('literalresultfortest', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/test/literalresultfortest/literalresultfortest.html';

    beforeEach(function() {
      module('app.literalresultfortest', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state literalresultfortest to url /literalresultfortest ', function() {
      expect($state.href('literalresultfortest', {})).to.equal('/literalresultfortest');
    });
    it('should map /literalresultfortest literalresultfortest to literalresultfortest View template', function() {
      expect($state.get('literalresultfortest').templateUrl).to.equal(view);
    });
     
  });
});
