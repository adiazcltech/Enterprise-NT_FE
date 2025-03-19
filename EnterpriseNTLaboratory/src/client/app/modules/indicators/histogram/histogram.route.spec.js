/* jshint -W117, -W030 */
describe('histogramRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/indicators/histogram/histogram.html';

        beforeEach(function () {
            module('app.histogram', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /histogram ', function () {
            expect($state.href('histogram', {})).to.equal('/histogram');
        });
        it('should map /histogram route to hematologicalcounter View template', function () {
            expect($state.get('histogram').templateUrl).to.equal(view);
        });
    });
});