/* jshint -W117, -W030 */
describe('orderentryRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/options/options.html';

        beforeEach(function () {
            module('app.options', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state options to url /options ', function () {
            expect($state.href('options', {})).to.equal('/options');
        });
        it('should map /options route to options View template', function () {
            expect($state.get('options').templateUrl).to.equal(view);
        });
    });
});