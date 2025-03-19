/* jshint -W117, -W030 */
describe('referencevaluesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/referencevalues/referencevalues.html';

        beforeEach(function () {
            module('app.referencevalues', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state referencevalues to url /referencevalues ', function () {
            expect($state.href('referencevalues', {})).to.equal('/referencevalues');
        });
        it('should map /referencevalues route to referencevalues View template', function () {
            expect($state.get('referencevalues').templateUrl).to.equal(view);
        });
    });
});