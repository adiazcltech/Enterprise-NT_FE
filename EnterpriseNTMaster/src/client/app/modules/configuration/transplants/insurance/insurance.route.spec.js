/* jshint -W117, -W030 */
describe('insuranceRoutes', function() {
    describe('state', function() {
        var view = 'app/modules/configuration/transplants/insurance/insurance.html';

        beforeEach(function() {
            module('app.insurance', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state insurance to url /insurance ', function() {
            expect($state.href('insurance', {})).to.equal('/insurance');
        });
        it('should map /insurance route to insurance View template', function() {
            expect($state.get('insurance').templateUrl).to.equal(view);
        });
    });
});