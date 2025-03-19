/* jshint -W117, -W030 */
describe('barcodeeditRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/tools/barcodeedit/barcodeedit.html';

        beforeEach(function () {
            module('app.barcodeedit', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /barcodeedit ', function () {
            expect($state.href('barcodeedit', {})).to.equal('/barcodeedit');
        });
        it('should map /barcodeedit route to hematologicalcounter View template', function () {
            expect($state.get('barcodeedit').templateUrl).to.equal(view);
        });
    });
});