/* jshint -W117, -W030 */
describe('deltacheckRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/deltacheck/deltacheck.html';

        beforeEach(function () {
            module('app.deltacheck', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state alarm to url /alarm ', function () {
            expect($state.href('deltacheck', {})).to.equal('/deltacheck');
        });
        it('should map /alarm route to alarm View template', function () {
            expect($state.get('deltacheck').templateUrl).to.equal(view);
        });
    });
});