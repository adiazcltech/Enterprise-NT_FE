/* jshint -W117, -W030 */
describe('meansofcultivationfortestRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/microbiology/meansofcultivationfortest/meansofcultivationfortest.html';

        beforeEach(function () {
            module('app.meansofcultivationfortest', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state meansofcultivationfortest to url /meansofcultivationfortest ', function () {
            expect($state.href('meansofcultivationfortest', {})).to.equal('/meansofcultivationfortest');
        });
        it('should map /meansofcultivationfortest route to meansofcultivationfortest View template', function () {
            expect($state.get('meansofcultivationfortest').templateUrl).to.equal(view);
        });
    });
});