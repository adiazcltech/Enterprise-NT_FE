/* jshint -W117, -W030 */
describe('auditmaster', function () {
    describe('state', function () {
        var view = 'app/modules/audit/auditmaster/auditmaster.html';

        beforeEach(function () {
            module('app.auditmaster', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state alarm to url /auditmaster ', function () {
            expect($state.href('auditmaster', {})).to.equal('/auditmaster');
        });
        it('should map /alarm route to alarm View template', function () {
            expect($state.get('auditmaster').templateUrl).to.equal(view);
        });
    });
});
