/* jshint -W117, -W030 */
describe('patientconsultationRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/reportsandconsultations/patientconsultation/patientconsultation.html';

        beforeEach(function () {
            module('app.patientconsultation', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /patientconsultation ', function () {
            expect($state.href('patientconsultation', {})).to.equal('/patientconsultation');
        });
        it('should map /patientconsultation route to hematologicalcounter View template', function () {
            expect($state.get('patientconsultation').templateUrl).to.equal(view);
        });
    });
});