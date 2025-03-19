/* jshint -W117, -W030 */
describe('restartcounter', function () {
    describe('state', function () {
        var view = 'app/modules/ordermanagement/restartcounter/restartcounter.html';

        beforeEach(function () {
            module('app.restartcounter', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /restartcounter ', function () {
            expect($state.href('restartcounter', {})).to.equal('/restartcounter');
        });
        it('should map /restartcounter route to hematologicalcounter View template', function () {
            expect($state.get('restartcounter').templateUrl).to.equal(view);
        });
    });
});