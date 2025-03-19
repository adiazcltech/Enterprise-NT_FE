/* jshint -W117, -W030 */
describe('planoWhonetRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/microbiology/planoWhonet/planoWhonet.html';

        beforeEach(function () {
            module('app.planoWhonet', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /planoWhonet ', function () {
            expect($state.href('planoWhonet', {})).to.equal('/planoWhonet');
        });
        it('should map /planoWhonet route to hematologicalcounter View template', function () {
            expect($state.get('planoWhonet').templateUrl).to.equal(view);
        });
    });
});