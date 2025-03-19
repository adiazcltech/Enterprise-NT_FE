/* jshint -W117, -W030 */
describe('refrigerator', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/traceability/refrigerator/refrigerator.html';

    beforeEach(function() {
      module('app.refrigerator', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state refrigerator to url /refrigerator ', function() {
      expect($state.href('refrigerator', {})).to.equal('/refrigerator');
    });
    it('should map /refrigerator route to refrigerator View template', function() {
      expect($state.get('refrigerator').templateUrl).to.equal(view);
    });
     
  });
});
