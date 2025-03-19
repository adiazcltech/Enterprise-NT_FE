/* jshint -W117, -W030 */
describe('paymenttypesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/billing/paymenttypes/paymenttypes.html';

        beforeEach(function () {
            module('app.paymenttypes', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state paymenttypes to url /paymenttypes ', function () {
            expect($state.href('paymenttypes', {})).to.equal('/paymenttypes');
        });
        it('should map /paymenttypes route to paymenttypes View template', function () {
            expect($state.get('paymenttypes').templateUrl).to.equal(view);
        });
    });
});