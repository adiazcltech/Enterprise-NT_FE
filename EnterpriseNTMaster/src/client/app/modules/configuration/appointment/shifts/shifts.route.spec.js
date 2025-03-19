/* jshint -W117, -W030 */
describe('shifts', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/appointment/shifts/shifts.html';

    beforeEach(function() {
      module('app.shifts', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state shifts to url /shifts ', function() {
      expect($state.href('shifts', {})).to.equal('/shifts');
    });
    it('should map /shifts route to shifts View template', function() {
      expect($state.get('shifts').templateUrl).to.equal(view);
    });

  });
});
