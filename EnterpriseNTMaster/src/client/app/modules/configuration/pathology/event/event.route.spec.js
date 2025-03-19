/* jshint -W117, -W030 */
describe('eventRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/event/event.html';

      beforeEach(function() {
          module('app.event', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state event to url /event ', function() {
          expect($state.href('event', {})).to.equal('/event');
      });
      it('should map /event route to event View template', function() {
          expect($state.get('event').templateUrl).to.equal(view);
      });
  });
});
