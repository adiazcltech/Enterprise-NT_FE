/* jshint -W117, -W030 */
describe('generalstadisticsRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/stadistics/generalstadistics/generalstadistics.html';

        beforeEach(function () {
            module('app.generalstadistics', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /generalstadistics ', function () {
            expect($state.href('generalstadistics', {})).to.equal('/generalstadistics');
        });
        it('should map /generalstadistics route to hematologicalcounter View template', function () {
            expect($state.get('generalstadistics').templateUrl).to.equal(view);
        });
    });
});