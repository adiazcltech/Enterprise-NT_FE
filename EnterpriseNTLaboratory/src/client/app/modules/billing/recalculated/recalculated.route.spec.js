/* jshint -W117, -W030 */
describe('recalculated', function () {
    describe('state', function () {
        var view = 'app/modules/billing/recalculated/recalculated.html';

        beforeEach(function () {
            module('app.recalculated', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /recalculated ', function () {
            expect($state.href('recalculated', {})).to.equal('/recalculated');
        });
        it('should map /recalculated route to hematologicalcounter View template', function () {
            expect($state.get('recalculated').templateUrl).to.equal(view);
        });
    });
});