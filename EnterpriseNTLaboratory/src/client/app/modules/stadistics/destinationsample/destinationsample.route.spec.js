/* jshint -W117, -W030 */
describe('destinationsample', function () {
    describe('state', function () {
        var view = 'app/modules/stadistics/destinationsample/destinationsample.html';

        beforeEach(function () {
            module('app.destinationsample', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /destinationsample ', function () {
            expect($state.href('destinationsample', {})).to.equal('/destinationsample');
        });
        it('should map /generalstadistics route to hematologicalcounter View template', function () {
            expect($state.get('destinationsample').templateUrl).to.equal(view);
        });
    });
});