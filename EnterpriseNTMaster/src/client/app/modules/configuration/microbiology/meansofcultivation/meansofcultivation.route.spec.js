/* jshint -W117, -W030 */
describe('meansofcultivationRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/microbiology/meansofcultivation/meansofcultivation.html';

        beforeEach(function () {
            module('app.meansofcultivation', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state meansofcultivation to url /meansofcultivation ', function () {
            expect($state.href('meansofcultivation', {})).to.equal('/meansofcultivation');
        });
        it('should map /meansofcultivation route to meansofcultivation View template', function () {
            expect($state.get('meansofcultivation').templateUrl).to.equal(view);
        });
    });
});