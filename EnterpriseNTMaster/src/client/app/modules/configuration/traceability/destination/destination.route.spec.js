/* jshint -W117, -W030 */
describe('destinationRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/traceability/destination/destination.html';

        beforeEach(function () {
            module('app.destination', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state destination to url /destination ', function () {
            expect($state.href('destination', {})).to.equal('/destination');
        });
        it('should map /destination route to destination View template', function () {
            expect($state.get('destination').templateUrl).to.equal(view);
        });
    });
});