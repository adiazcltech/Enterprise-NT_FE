/* jshint -W117, -W030 */
describe('ediRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/billing/edi/edi.html';

        beforeEach(function () {
            module('app.edi', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state edi to url /edi ', function () {
            expect($state.href('edi', {})).to.equal('/edi');
        });
        it('should map /edi route to edi View template', function () {
            expect($state.get('edi').templateUrl).to.equal(view);
        });
    });
});