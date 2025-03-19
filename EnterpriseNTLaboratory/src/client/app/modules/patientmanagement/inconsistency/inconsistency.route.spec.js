/* jshint -W117, -W030 */
describe('inconsistencyRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/patientmanagement/inconsistency/inconsistency.html';

        beforeEach(function () {
            module('app.inconsistency', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state inconsistency to url /inconsistency ', function () {
            expect($state.href('inconsistency', {})).to.equal('/inconsistency');
        });
        it('should map /inconsistency route to alarm View template', function () {
            expect($state.get('inconsistency').templateUrl).to.equal(view);
        });
    });
});  