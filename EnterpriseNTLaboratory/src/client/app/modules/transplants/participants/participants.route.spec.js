/* jshint -W117, -W030 */
describe('receptionsamplesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/transplants/participants/participants.html';

        beforeEach(function () {
            module('app.participants', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /participants ', function () {
            expect($state.href('participants', {})).to.equal('/participants');
        });
        it('should map /participants route to hematologicalcounter View template', function () {
            expect($state.get('participants').templateUrl).to.equal(view);
        });
    });
});