/* jshint -W117, -W030 */
describe('populationgroupRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/demographics/populationgroup/populationgroup.html';

        beforeEach(function () {
            module('app.populationgroup', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state populationgroup to url /populationgroup ', function () {
            expect($state.href('populationgroup', {})).to.equal('/populationgroup');
        });
        it('should map /populationgroup route to populationgroup View template', function () {
            expect($state.get('populationgroup').templateUrl).to.equal(view);
        });
    });
});