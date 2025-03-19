/* jshint -W117, -W030 */
describe('auditinvoice', function () {
    describe('state', function () {
        var view = 'app/modules/audit/auditinvoice/auditinvoice.html';

        beforeEach(function () {
            module('app.auditinvoice', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /auditinvoice ', function () {
            expect($state.href('auditinvoice', {})).to.equal('/auditinvoice');
        });
        it('should map /auditinvoice route to hematologicalcounter View template', function () {
            expect($state.get('auditinvoice').templateUrl).to.equal(view);
        });
    });
});