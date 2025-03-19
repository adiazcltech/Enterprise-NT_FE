/* jshint -W117, -W030 */
describe('colorationbytestRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/colorationbytest/colorationbytest.html';

      beforeEach(function() {
          module('app.colorationbytest', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state colorationbytest to url /colorationbytest ', function() {
          expect($state.href('colorationbytest', {})).to.equal('/colorationbytest');
      });
      it('should map /colorationbytest route to colorationbytest View template', function() {
          expect($state.get('colorationbytest').templateUrl).to.equal(view);
      });
  });
});
