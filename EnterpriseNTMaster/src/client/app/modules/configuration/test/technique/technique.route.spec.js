/* jshint -W117, -W030 */
describe('techniqueRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/technique/technique.html';

        beforeEach(function () {
            module('app.technique', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state technique to url /technique ', function () {
            expect($state.href('technique', {})).to.equal('/technique');
        });
        it('should map /technique route to technique View template', function () {
            expect($state.get('technique').templateUrl).to.equal(view);
        });
    });
});