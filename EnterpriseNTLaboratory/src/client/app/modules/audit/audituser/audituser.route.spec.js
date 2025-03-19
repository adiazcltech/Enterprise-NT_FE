/* jshint -W117, -W030 */
describe('audituser', function () {
    describe('state', function () {
        var view = 'app/modules/audit/audituser/audituser.html';

        beforeEach(function () {
            module('app.audituser', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /audituser ', function () {
            expect($state.href('audituser', {})).to.equal('/audituser');
        });
        it('should map /audituser route to hematologicalcounter View template', function () {
            expect($state.get('audituser').templateUrl).to.equal(view);
        });
    });
});