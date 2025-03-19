/* jshint -W117, -W030 */
describe('indicatorsRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/indicators/indicators/indicators.html';

        beforeEach(function () {
            module('app.indicator', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /indicators ', function () {
            expect($state.href('indicators', {})).to.equal('/indicators');
        });
        it('should map /indicators route to hematologicalcounter View template', function () {
            expect($state.get('indicators').templateUrl).to.equal(view);
        });
    });
});