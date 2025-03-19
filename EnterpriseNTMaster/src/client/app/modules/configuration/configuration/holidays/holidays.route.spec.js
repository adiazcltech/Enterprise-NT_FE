/* jshint -W117, -W030 */
describe('raceRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/demographics/race/race.html';

    beforeEach(function() {
      module('app.race', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state race to url /race ', function() {
      expect($state.href('race', {})).to.equal('/race');
    });
    it('should map /race route to race View template', function() {
      expect($state.get('race').templateUrl).to.equal(view);
    });
     
  });
});
