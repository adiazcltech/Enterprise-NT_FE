/* jshint -W117, -W030 */
describe('unitRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/test/unit/unit.html';

        beforeEach(function () {
            module('app.unit', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state unit to url /unit ', function () {
            expect($state.href('unit', {})).to.equal('/unit');
        });
        it('should map /unit route to unit View template', function () {
            expect($state.get('unit').templateUrl).to.equal(view);
        });
    });
});