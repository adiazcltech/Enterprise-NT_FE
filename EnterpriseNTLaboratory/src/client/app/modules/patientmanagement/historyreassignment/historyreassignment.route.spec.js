/* jshint -W117, -W030 */
describe('historyreassignmentRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/patientmanagement/historyreassignment/historyreassignment.html';

        beforeEach(function () {
            module('app.historyreassignment', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state historyreassignment to url /historyreassignment ', function () {
            expect($state.href('historyreassignment', {})).to.equal('/historyreassignment');
        });
        it('should map /historyreassignment route to alarm View template', function () {
            expect($state.get('historyreassignment').templateUrl).to.equal(view);
        });
    });
}); 