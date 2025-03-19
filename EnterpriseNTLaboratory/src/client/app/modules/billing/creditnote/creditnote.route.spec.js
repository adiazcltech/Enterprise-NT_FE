/* jshint -W117, -W030 */
describe('creditnote', function () {
    describe('state', function () {
        var view = 'app/modules/billing/creditnote/creditnote.html';

        beforeEach(function () {
            module('app.creditnote', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /creditnote ', function () {
            expect($state.href('creditnote', {})).to.equal('/creditnote');
        });
        it('should map /creditnote route to hematologicalcounter View template', function () {
            expect($state.get('creditnote').templateUrl).to.equal(view);
        });
    });
});