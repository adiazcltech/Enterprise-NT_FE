/* jshint -W117, -W030 */
describe('exceptionRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/tools/exception/exception.html';

        beforeEach(function () {
            module('app.exception', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /exception ', function () {
            expect($state.href('exception', {})).to.equal('/exception');
        });
        it('should map /exception route to hematologicalcounter View template', function () {
            expect($state.get('exception').templateUrl).to.equal(view);
        });
    });
});