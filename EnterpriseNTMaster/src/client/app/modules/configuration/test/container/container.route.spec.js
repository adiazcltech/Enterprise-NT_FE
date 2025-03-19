/* jshint -W117, -W030 */
describe('ContainerRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/test/container/container.html';

    beforeEach(function() {
      module('app.container', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state container to url /Container ', function() {
      expect($state.href('container', {})).to.equal('/container');
    });
    it('should map /container route to Container View template', function() {
      expect($state.get('container').templateUrl).to.equal(view);
    });
     
  });
});
