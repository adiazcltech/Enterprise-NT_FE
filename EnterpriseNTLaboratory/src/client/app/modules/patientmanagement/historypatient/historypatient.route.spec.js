/* jshint -W117, -W030 */
describe('historypatientRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/patientmanagement/historypatient/historypatient.html';

        beforeEach(function () {
            module('app.historypatient', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state historypatient to url /historypatient ', function () {
            expect($state.href('historypatient', {})).to.equal('/historypatient');
        });
        it('should map /historypatient route to alarm View template', function () {
            expect($state.get('historypatient').templateUrl).to.equal(view);
        });
    });
}); 