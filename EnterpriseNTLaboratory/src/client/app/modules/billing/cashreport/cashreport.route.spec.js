/* jshint -W117, -W030 */
describe('cashreport', function () {
    describe('state', function () {
        var view = 'app/modules/billing/cashreport/cashreport.html';

        beforeEach(function () {
            module('app.cashreport', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /cashreport ', function () {
            expect($state.href('cashreport', {})).to.equal('/cashreport');
        });
        it('should map /cashreport route to hematologicalcounter View template', function () {
            expect($state.get('cashreport').templateUrl).to.equal(view);
        });
    });
});