/* jshint -W117, -W030 */
describe('centralsystemRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/integration/centralsystem/centralsystem.html';

        beforeEach(function () {
            module('app.centralsystem', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state centralsystem to url /centralsystem ', function () {
            expect($state.href('centralsystem', {})).to.equal('/centralsystem');
        });
        it('should map /centralsystem route to centralsystem View template', function () {
            expect($state.get('centralsystem').templateUrl).to.equal(view);
        });
    });
});