/* jshint -W117, -W030 */
describe('reviewofresultsRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/result/reviewofresults/reviewofresults.html';

        beforeEach(function () {
            module('app.reviewofresults', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /reviewofresults ', function () {
            expect($state.href('reviewofresults', {})).to.equal('/reviewofresults');
        });
        it('should map /reviewofresults route to hematologicalcounter View template', function () {
            expect($state.get('reviewofresults').templateUrl).to.equal(view);
        });
    });
}); 