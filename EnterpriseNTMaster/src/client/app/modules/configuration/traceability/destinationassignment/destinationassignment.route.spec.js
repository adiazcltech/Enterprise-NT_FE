/* jshint -W117, -W030 */
describe('destinationassignmentRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/traceability/destinationassignment/destinationassignment.html';

        beforeEach(function () {
            module('app.destinationassignment', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state hematologicalcounter to url /destinationassignment ', function () {
            expect($state.href('destinationassignment', {})).to.equal('/destinationassignment');
        });
        it('should map /laboratorytest route to hematologicalcounter View template', function () {
            expect($state.get('destinationassignment').templateUrl).to.equal(view);
        });
    });
});