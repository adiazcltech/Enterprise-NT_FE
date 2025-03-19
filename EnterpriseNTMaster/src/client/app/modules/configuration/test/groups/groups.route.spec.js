/* jshint -W117, -W030 */
describe('literalresultRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/test/literalresult/literalresult.html';

    beforeEach(function() {
      module('app.literalresult', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state literalresult to url /literalresult ', function() {
      expect($state.href('literalresult', {})).to.equal('/literalresult');
    });
    it('should map /literalresult literalresult to literalresult View template', function() {
      expect($state.get('literalresult').templateUrl).to.equal(view);
    });
     
  });
});
