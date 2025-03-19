/* jshint -W117, -W030 */
describe('resultsentry', function () {
    describe('state', function () {
        var view = 'app/modules/result/resultsentry/resultsentry.html';

        beforeEach(function () {
            module('app.resultsentry', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state alarm to url /resultsentry ', function () {
            expect($state.href('resultsentry', {})).to.equal('/resultsentry');
        });
        it('should map /resultsentry route to alarm View template', function () {
            expect($state.get('resultsentry').templateUrl).to.equal(view);
        });
    });
});
