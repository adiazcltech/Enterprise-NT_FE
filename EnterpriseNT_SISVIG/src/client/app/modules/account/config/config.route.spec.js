/* jshint -W117, -W030 */
describe('configController', function () {
  describe('state', function () {
    var view = 'app/modules/account/config/config.html';

    beforeEach(function () {
      module('app.config', bard.fakeToastr);
      bard.inject('$state');
    });

    it('should map state alarm to url /config ', function () {
      expect($state.href('config', {})).to.equal('/config');
    });
    it('should map /config route to alarm View template', function () {
      expect($state.get('config').templateUrl).to.equal(view);
    });
  });
});
