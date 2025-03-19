/* jshint -W117, -W030 */
describe('tuberackRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/samplesmanagement/tuberack/tuberack.html';

        beforeEach(function () {
            module('app.tuberack', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /tuberack ', function () {
            expect($state.href('tuberack', {})).to.equal('/tuberack');
        });
        it('should map /tuberack route to hematologicalcounter View template', function () {
            expect($state.get('tuberack').templateUrl).to.equal(view);
        });
    });
});