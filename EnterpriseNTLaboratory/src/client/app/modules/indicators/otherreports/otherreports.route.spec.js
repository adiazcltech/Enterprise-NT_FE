/* jshint -W117, -W030 */
describe('otherreports', function () {
    describe('state', function () {
        var view = 'app/modules/indicators/otherreports/otherreports.html';

        beforeEach(function () {
            module('app.otherreports', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /otherreports ', function () {
            expect($state.href('otherreports', {})).to.equal('/otherreports');
        });
        it('should map /otherreports route to hematologicalcounter View template', function () {
            expect($state.get('otherreports').templateUrl).to.equal(view);
        });
    });
});