/* jshint -W117, -W030 */
describe('restartmiddleware', function () {
    describe('state', function () {
        var view = 'app/modules/result/restartmiddleware/restartmiddleware.html';

        beforeEach(function () {
            module('app.restartmiddleware', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /restartmiddleware ', function () {
            expect($state.href('restartmiddleware', {})).to.equal('/restartmiddleware');
        });
        it('should map /restartmiddleware route to hematologicalcounter View template', function () {
            expect($state.get('restartmiddleware').templateUrl).to.equal(view);
        });
    });
});