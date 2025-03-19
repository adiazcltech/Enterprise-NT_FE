/* jshint -W117, -W030 */
describe('reportsRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/reportsandconsultations/reports/reports.html';

        beforeEach(function () {
            module('app.reports', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /reports ', function () {
            expect($state.href('reports', {})).to.equal('/reports');
        });
        it('should map /reports route to hematologicalcounter View template', function () {
            expect($state.get('reports').templateUrl).to.equal(view);
        });
    });
});