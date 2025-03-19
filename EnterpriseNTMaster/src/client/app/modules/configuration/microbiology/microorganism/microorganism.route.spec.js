/* jshint -W117, -W030 */
describe('microorganismRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/microbiology/microorganism/microorganism.html';

        beforeEach(function () {
            module('app.microorganism', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state microorganism to url /microorganism ', function () {
            expect($state.href('microorganism', {})).to.equal('/microorganism');
        });
        it('should map /microorganism route to microorganism View template', function () {
            expect($state.get('microorganism').templateUrl).to.equal(view);
        });
    });
});