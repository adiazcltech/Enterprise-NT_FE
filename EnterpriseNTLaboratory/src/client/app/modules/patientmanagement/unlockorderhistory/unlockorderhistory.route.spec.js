/* jshint -W117, -W030 */
describe('unlockorderhistoryRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/patientmanagement/unlockorderhistory/unlockorderhistory.html';

        beforeEach(function () {
            module('app.unlockorderhistory', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state unlockorderhistory to url /unlockorderhistoryRoutes ', function () {
            expect($state.href('unlockorderhistory', {})).to.equal('/unlockorderhistory');
        });
        it('should map /unlockorderhistory route to alarm View template', function () {
            expect($state.get('unlockorderhistory').templateUrl).to.equal(view);
        });
    });
});  