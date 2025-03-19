/* jshint -W117, -W030 */
describe('scheduleRoutes', function() {
  describe('state', function() {
      var view = 'app/modules/configuration/pathology/schedule/schedule.html';

      beforeEach(function() {
          module('app.schedule', bard.fakeToastr);
          bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
      });

      it('should map state schedule to url /schedule ', function() {
          expect($state.href('schedule', {})).to.equal('/schedule');
      });
      it('should map /schedule route to schedule View template', function() {
          expect($state.get('schedule').templateUrl).to.equal(view);
      });
  });
});
