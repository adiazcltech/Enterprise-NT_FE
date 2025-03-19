/* jshint -W117, -W030 */
describe('diagnosticRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/diagnostic/diagnostic.html';

        beforeEach(function () {
            module('app.diagnostic', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state alarm to url /diagnostic ', function () {
            expect($state.href('diagnostic', {})).to.equal('/diagnostic');
        });
        it('should map /alarm route to alarm View template', function () {
            expect($state.get('diagnostic').templateUrl).to.equal(view);
        });
    });
});