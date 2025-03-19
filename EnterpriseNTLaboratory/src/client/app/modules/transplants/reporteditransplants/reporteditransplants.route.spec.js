/* jshint -W117, -W030 */
describe('reporteditransplants', function () {
  describe('state', function () {
    var view = 'app/modules/transplants/reporteditransplants/reporteditransplants.html';

    beforeEach(function () {
      module('app.reporteditransplants', bard.fakeToastr);
      bard.inject('$state');
    });

    it('should map state hematologicalcounter to url /reporteditransplants ', function () {
      expect($state.href('reporteditransplants', {})).to.equal('/reporteditransplants');
    });
    it('should map /reporteditransplants route to hematologicalcounter View template', function () {
      expect($state.get('reporteditransplants').templateUrl).to.equal(view);
    });
  });
});