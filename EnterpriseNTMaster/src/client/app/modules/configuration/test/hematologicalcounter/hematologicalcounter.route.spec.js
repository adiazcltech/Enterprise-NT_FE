/* jshint -W117, -W030 */
describe('hematologicalcounterRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/hematologicalcounter/hematologicalcounter.html';

        beforeEach(function () {
            module('app.hematologicalcounter', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state hematologicalcounter to url /hematologicalcounter ', function () {
            expect($state.href('hematologicalcounter', {})).to.equal('/hematologicalcounter');
        });
        it('should map /hematologicalcounter route to hematologicalcounter View template', function () {
            expect($state.get('hematologicalcounter').templateUrl).to.equal(view);
        });
    });
});