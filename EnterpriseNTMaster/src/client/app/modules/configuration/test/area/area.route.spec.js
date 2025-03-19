/* jshint -W117, -W030 */
describe('areaRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/area/area.html';

        beforeEach(function () {
            module('app.area', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state alarm to url /alarm ', function () {
            expect($state.href('area', {})).to.equal('/area');
        });
        it('should map /alarm route to alarm View template', function () {
            expect($state.get('area').templateUrl).to.equal(view);
        });
    });
});