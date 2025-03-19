/* jshint -W117, -W030 */
describe('testeditionRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/test/testedition/testedition.html';

        beforeEach(function () {
            module('app.testedition', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state testedition to url /testedition ', function () {
            expect($state.href('testedition', {})).to.equal('/testedition');
        });
        it('should map /testedition route to testedition View template', function () {
            expect($state.get('testedition').templateUrl).to.equal(view);
        });
    });
});