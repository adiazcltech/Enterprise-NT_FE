/* jshint -W117, -W030 */
describe('contractRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/billing/contract/contract.html';

        beforeEach(function () {
            module('app.contract', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state contract to url /contract ', function () {
            expect($state.href('contract', {})).to.equal('/contract');
        });
        it('should map /contract route to contract View template', function () {
            expect($state.get('contract').templateUrl).to.equal(view);
        });
    });
});