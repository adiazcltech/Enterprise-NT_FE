/* jshint -W117, -W030 */
describe('reportedit', function () {
  describe('state', function () {
    var view = 'app/modules/tools/reportedit/reportedit.html';

    beforeEach(function () {
      module('app.reportedit', bard.fakeToastr);
      bard.inject('$state');
    });

    it('should map state hematologicalcounter to url /reportedit ', function () {
      expect($state.href('reportedit', {})).to.equal('/reportedit');
    });
    it('should map /reportedit route to hematologicalcounter View template', function () {
      expect($state.get('reportedit').templateUrl).to.equal(view);
    });
  });
});