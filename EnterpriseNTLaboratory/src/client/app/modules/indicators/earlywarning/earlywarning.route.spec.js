/* jshint -W117, -W030 */
describe('earlywarningRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/indicators/earlywarning/earlywarning.html';

        beforeEach(function () {
            module('app.earlywarning', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /earlywarning ', function () {
            expect($state.href('earlywarning', {})).to.equal('/earlywarning');
        });
        it('should map /earlywarning route to hematologicalcounter View template', function () {
            expect($state.get('earlywarning').templateUrl).to.equal(view);
        });
    });
});