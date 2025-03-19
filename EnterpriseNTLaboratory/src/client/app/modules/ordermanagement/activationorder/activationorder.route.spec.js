/* jshint -W117, -W030 */
describe('activationorderRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/ordermanagement/activationorder/activationorder.html';

        beforeEach(function () {
            module('app.activationorder', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /activationorder ', function () {
            expect($state.href('activationorder', {})).to.equal('/activationorder');
        });
        it('should map /activationorder route to hematologicalcounter View template', function () {
            expect($state.get('activationorder').templateUrl).to.equal(view);
        });
    });
});