/* jshint -W117, -W030 */
describe('anatomicalsite', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/microbiology/anatomicalsite/anatomicalsite.html';

    beforeEach(function() {
      module('app.anatomicalsite', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state anatomicalsite to url /anatomicalsite ', function() {
      expect($state.href('anatomicalsite', {})).to.equal('/anatomicalsite');
    });
    it('should map /anatomicalsite route to anatomicalsite View template', function() {
      expect($state.get('anatomicalsite').templateUrl).to.equal(view);
    });
     
  });
});
