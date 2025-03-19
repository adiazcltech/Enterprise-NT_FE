/* jshint -W117, -W030 */
describe('physicianRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/demographics/physician/physician.html';

    beforeEach(function() {
      module('app.physician', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
    });

    it('should map state physician to url /physician ', function() {
      expect($state.href('physician', {})).to.equal('/physician');
    });
    it('should map /physician route to physician View template', function() {
      expect($state.get('physician').templateUrl).to.equal(view);
    });
     
  });
});
