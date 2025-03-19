/* jshint -W117, -W030 */
describe('alarmRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/alarm/alarm.html';

        beforeEach(function () {
            module('app.alarm', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state alarm to url /alarm ', function () {
            expect($state.href('alarm', {})).to.equal('/alarm');
        });
        it('should map /alarm route to alarm View template', function () {
            expect($state.get('alarm').templateUrl).to.equal(view);
        });
    });
});
