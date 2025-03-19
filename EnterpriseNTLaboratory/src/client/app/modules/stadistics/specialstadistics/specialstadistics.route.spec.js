/* jshint -W117, -W030 */
describe('specialstadisticsRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/stadistics/specialstadistics/specialstadistics.html';

        beforeEach(function () {
            module('app.specialstadistics', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /specialstadistics ', function () {
            expect($state.href('specialstadistics', {})).to.equal('/specialstadistics');
        });
        it('should map /specialstadistics route to hematologicalcounter View template', function () {
            expect($state.get('specialstadistics').templateUrl).to.equal(view);
        });
    });
});