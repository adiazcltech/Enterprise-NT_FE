/* jshint -W117, -W030 */
describe('changeprices', function () {
  describe('state', function () {
      var view = 'app/modules/billing/changeprices/changeprices.html';

      beforeEach(function () {
          module('app.changeprices', bard.fakeToastr);
          bard.inject('$state');
      });

      it('should map state hematologicalcounter to url /changeprices ', function () {
          expect($state.href('changeprices', {})).to.equal('/changeprices');
      });
      it('should map /changeprices route to hematologicalcounter View template', function () {
          expect($state.get('changeprices').templateUrl).to.equal(view);
      });
  });
});
