/* jshint -W117, -W030 */
describe('feeschedulesRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/billing/feeschedules/feeschedules.html';

        beforeEach(function () {
            module('app.feeschedules', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state feeschedules to url /feeschedules ', function () {
            expect($state.href('feeschedules', {})).to.equal('/feeschedules');
        });
        it('should map /feeschedules route to feeschedules View template', function () {
            expect($state.get('feeschedules').templateUrl).to.equal(view);
        });
    });
});