/* jshint -W117, -W030 */
describe('controldeliveryreportsRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/reportsandconsultations/controldeliveryreports/controldeliveryreports.html';

        beforeEach(function () {
            module('app.controldeliveryreports', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /controldeliveryreports ', function () {
            expect($state.href('controldeliveryreports', {})).to.equal('/controldeliveryreports');
        });
        it('should map /controldeliveryreports route to hematologicalcounter View template', function () {
            expect($state.get('controldeliveryreports').templateUrl).to.equal(view);
        });
    });
});