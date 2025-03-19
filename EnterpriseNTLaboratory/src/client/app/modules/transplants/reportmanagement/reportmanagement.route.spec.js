/* jshint -W117, -W030 */
describe('receptionsamplesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/transplants/reportmanagement/reportmanagement.html';

        beforeEach(function () {
            module('app.reportmanagement', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /reportmanagement ', function () {
            expect($state.href('reportmanagement', {})).to.equal('/reportmanagement');
        });
        it('should map /reportmanagement route to hematologicalcounter View template', function () {
            expect($state.get('reportmanagement').templateUrl).to.equal(view);
        });
    });
});