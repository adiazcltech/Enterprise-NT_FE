/* jshint -W117, -W030 */
describe('historyassignmentRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/patientmanagement/historyassignment/historyassignment.html';

        beforeEach(function () {
            module('app.historyassignment', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state historyassignment to url /historyassignment ', function () {
            expect($state.href('historyassignment', {})).to.equal('/historyassignment');
        });
        it('should map /historyassignment route to alarm View template', function () {
            expect($state.get('historyassignment').templateUrl).to.equal(view);
        });
    });
}); 