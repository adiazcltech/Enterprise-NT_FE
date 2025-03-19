/* jshint -W117, -W030 */
describe('statisticswithpricesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/stadistics/statisticswithprices/statisticswithprices.html';

        beforeEach(function () {
            module('app.statisticswithprices', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /statisticswithprices ', function () {
            expect($state.href('statisticswithprices', {})).to.equal('/statisticswithprices');
        });
        it('should map /statisticswithprices route to hematologicalcounter View template', function () {
            expect($state.get('statisticswithprices').templateUrl).to.equal(view);
        });
    });
});