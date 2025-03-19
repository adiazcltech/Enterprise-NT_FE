/* jshint -W117, -W030 */
describe('alarmdayRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/integration/alarmday/alarmday.html';

        beforeEach(function () {
            module('app.alarmday', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state alarmday to url /alarmday ', function () {
            expect($state.href('alarmday', {})).to.equal('/alarmday');
        });
        it('should map /alarmday route to alarmday View template', function () {
            expect($state.get('alarmday').templateUrl).to.equal(view);
        });
    });
});