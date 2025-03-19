/* jshint -W117, -W030 */
describe('customerateRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/billing/customerate/customerate.html';

        beforeEach(function () {
            module('app.customerate', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state customerate to url /customerate ', function () {
            expect($state.href('customerate', {})).to.equal('/customerate');
        });
        it('should map /customerate route to customerate View template', function () {
            expect($state.get('customerate').templateUrl).to.equal(view);
        });
    });
});