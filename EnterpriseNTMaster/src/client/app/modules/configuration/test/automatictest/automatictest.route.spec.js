/* jshint -W117, -W030 */
describe('automatictestRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/automatictest/automatictest.html';

        beforeEach(function () {
            module('app.automatictest', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state alarm to url /alarm ', function () {
            expect($state.href('automatictest', {})).to.equal('/automatictest');
        });
        it('should map /alarm route to alarm View template', function () {
            expect($state.get('automatictest').templateUrl).to.equal(view);
        });
    });
});