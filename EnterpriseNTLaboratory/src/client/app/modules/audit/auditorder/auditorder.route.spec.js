/* jshint -W117, -W030 */
describe('auditorder', function () {
    describe('state', function () {
        var view = 'app/modules/audit/auditorder/auditorder.html';

        beforeEach(function () {
            module('app.auditorder', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /auditorder ', function () {
            expect($state.href('auditorder', {})).to.equal('/auditorder');
        });
        it('should map /histogram route to hematologicalcounter View template', function () {
            expect($state.get('auditorder').templateUrl).to.equal(view);
        });
    });
});