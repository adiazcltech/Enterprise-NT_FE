/* jshint -W117, -W030 */
describe('resultemplateRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/resultemplate/resultemplate.html';

        beforeEach(function () {
            module('app.resultemplate', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state resultemplate to url /resultemplate ', function () {
            expect($state.href('resultemplate', {})).to.equal('/resultemplate');
        });
        it('should map /resultemplate route to resultemplate View template', function () {
            expect($state.get('resultemplate').templateUrl).to.equal(view);
        });
    });
});