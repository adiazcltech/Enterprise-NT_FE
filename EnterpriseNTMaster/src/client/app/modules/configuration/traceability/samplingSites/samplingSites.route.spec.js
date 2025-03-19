/* jshint -W117, -W030 */
describe('samplingSites', function () {

  describe('state', function () {

    var view = 'app/modules/configuration/traceability/specimenCollection/samplingSites.html';

    beforeEach(function () {
      module('app.samplingSites', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
    });

    it('should map state samplingSites to url /samplingSites ', function () {
      expect($state.href('samplingSites', {})).to.equal('/samplingSites');
    });

    it('should map /samplingSites route to samplingSites View template', function () {
      expect($state.get('samplingSites').templateUrl).to.equal(view);
    });

  });

});
