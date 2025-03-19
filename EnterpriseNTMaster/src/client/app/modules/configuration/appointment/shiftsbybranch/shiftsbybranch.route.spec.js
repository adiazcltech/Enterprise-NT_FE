/* jshint -W117, -W030 */
describe('shiftsbybranch', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/appointment/shiftsbybranch/shiftsbybranch.html';

    beforeEach(function() {
      module('app.shiftsbybranch', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state shiftsbybranch to url /shiftsbybranch ', function() {
      expect($state.href('shiftsbybranch', {})).to.equal('/shiftsbybranch');
    });
    it('should map /shiftsbybranch route to shiftsbybranch View template', function() {
      expect($state.get('shiftsbybranch').templateUrl).to.equal(view);
    });

  });
});
