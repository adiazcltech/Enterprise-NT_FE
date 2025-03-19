/* jshint -W117, -W030 */
describe('receptionsamplesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/transplants/donor/donor.html';

        beforeEach(function () {
            module('app.donor', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /donor ', function () {
            expect($state.href('donor', {})).to.equal('/donor');
        });
        it('should map /donor route to hematologicalcounter View template', function () {
            expect($state.get('donor').templateUrl).to.equal(view);
        });
    });
});