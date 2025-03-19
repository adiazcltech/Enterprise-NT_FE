/* jshint -W117, -W030 */
describe('taxprinter', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/billing/taxprinter/taxprinter.html';

    beforeEach(function() {
      module('app.taxprinter', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state taxprinter to url /taxprinter ', function() {
      expect($state.href('taxprinter', {})).to.equal('/taxprinter');
    });
    it('should map /taxprinter route to taxprinter View template', function() {
      expect($state.get('taxprinter').templateUrl).to.equal(view);
    });
     
  });
});
