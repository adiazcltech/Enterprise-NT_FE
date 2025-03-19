/* jshint -W117, -W030 */
describe('specialtyRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/demographics/specialty/specialty.html';

    beforeEach(function() {
      module('app.specialty', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state specialty to url /specialty ', function() {
      expect($state.href('specialty', {})).to.equal('/specialty');
    });
    it('should map /specialty route to specialty View template', function() {
      expect($state.get('specialty').templateUrl).to.equal(view);
    });
     
  });
});
