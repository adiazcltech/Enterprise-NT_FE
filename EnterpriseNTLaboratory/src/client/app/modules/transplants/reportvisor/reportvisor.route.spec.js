/* jshint -W117, -W030 */
describe('receptionsamplesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/transplants/reportvisor/reportvisor.html';

        beforeEach(function () {
            module('app.reportvisor', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /reportvisor ', function () {
            expect($state.href('reportvisor', {})).to.equal('/reportvisor');
        });
        it('should map /reportvisor route to hematologicalcounter View template', function () {
            expect($state.get('reportvisor').templateUrl).to.equal(view);
        });
    });
});