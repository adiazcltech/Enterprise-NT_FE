/* jshint -W117, -W030 */
describe('demographicsItemRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/demographics/demographicsItem/demographicsItem.html';

        beforeEach(function () {
            module('app.demographicsItem', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state demographicsItem to url /demographicsItem ', function () {
            expect($state.href('demographicsItem', {})).to.equal('/demographicsItem');
        });
        it('should map /demographicsItem route to demographicsItem View template', function () {
            expect($state.get('demographicsItem').templateUrl).to.equal(view);
        });
    });
});