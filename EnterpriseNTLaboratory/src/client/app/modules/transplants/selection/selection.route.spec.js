/* jshint -W117, -W030 */
describe('receptionsamplesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/transplants/selection/selection.html';

        beforeEach(function () {
            module('app.selection', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /selection ', function () {
            expect($state.href('selection', {})).to.equal('/selection');
        });
        it('should map /selection route to hematologicalcounter View template', function () {
            expect($state.get('selection').templateUrl).to.equal(view);
        });
    });
});