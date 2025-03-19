/* jshint -W117, -W030 */
describe('laboratorytestRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/laboratorytest/laboratorytest.html';

        beforeEach(function () {
            module('app.laboratorytest', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state hematologicalcounter to url /laboratorytest ', function () {
            expect($state.href('laboratorytest', {})).to.equal('/laboratorytest');
        });
        it('should map /laboratorytest route to hematologicalcounter View template', function () {
            expect($state.get('laboratorytest').templateUrl).to.equal(view);
        });
    });
});