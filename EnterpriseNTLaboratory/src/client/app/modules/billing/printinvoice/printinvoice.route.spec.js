/* jshint -W117, -W030 */
describe('printinvoice', function () {
    describe('state', function () {
        var view = 'app/modules/billing/printinvoice/printinvoice.html';

        beforeEach(function () {
            module('app.printinvoice', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /printinvoice ', function () {
            expect($state.href('printinvoice', {})).to.equal('/printinvoice');
        });
        it('should map /printinvoice route to hematologicalcounter View template', function () {
            expect($state.get('printinvoice').templateUrl).to.equal(view);
        });
    });
});