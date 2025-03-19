/* jshint -W117, -W030 */
describe('generateinvoice', function () {
    describe('state', function () {
        var view = 'app/modules/billing/generateinvoice/generateinvoice.html';

        beforeEach(function () {
            module('app.generateinvoice', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /generateinvoice ', function () {
            expect($state.href('generateinvoice', {})).to.equal('/generateinvoice');
        });
        it('should map /generateinvoice route to hematologicalcounter View template', function () {
            expect($state.get('generateinvoice').templateUrl).to.equal(view);
        });
    });
});