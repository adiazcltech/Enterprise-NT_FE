/* jshint -W117, -W030 */
describe('ordertypeRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/demographics/ordertype/ordertype.html';

    beforeEach(function() {
      module('app.ordertype', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state ordertype to url /ordertype ', function() {
      expect($state.href('ordertype', {})).to.equal('/ordertype');
    });
    it('should map /ordertype route to ordertype View template', function() {
      expect($state.get('ordertype').templateUrl).to.equal(view);
    });
     
  });
});
