/* jshint -W117, -W030 */
describe('bank', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/billing/bank/bank.html';

    beforeEach(function() {
      module('app.bank', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state bank to url /bank ', function() {
      expect($state.href('bank', {})).to.equal('/bank');
    });
    it('should map /bank route to bank View template', function() {
      expect($state.get('bank').templateUrl).to.equal(view);
    });
     
  });
});
