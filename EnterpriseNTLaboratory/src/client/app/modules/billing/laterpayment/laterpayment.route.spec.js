/* jshint -W117, -W030 */
describe('queriesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/billing/laterpayment/laterpayment.html';

        beforeEach(function () {
            module('app.laterpayment', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /laterpayment ', function () {
            expect($state.href('laterpayment', {})).to.equal('/laterpayment');
        });
        it('should map /laterpayment route to hematologicalcounter View template', function () {
            expect($state.get('laterpayment').templateUrl).to.equal(view);
        });
    });
});