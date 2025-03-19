/* jshint -W117, -W030 */
describe('processfortestRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/microbiology/processfortest/processfortest.html';

        beforeEach(function () {
            module('app.processfortest', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state processfortest to url /processfortest ', function () {
            expect($state.href('processfortest', {})).to.equal('/processfortest');
        });
        it('should map /processfortest route to processfortest View template', function () {
            expect($state.get('processfortest').templateUrl).to.equal(view);
        });
    });
});