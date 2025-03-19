/* jshint -W117, -W030 */
describe('receptionsamplesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/transplants/receptionsamples/receptionsamples.html';

        beforeEach(function () {
            module('app.receptionsamples', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /receptionsamples ', function () {
            expect($state.href('receptionsamples', {})).to.equal('/receptionsamples');
        });
        it('should map /receptionsamples route to hematologicalcounter View template', function () {
            expect($state.get('receptionsamples').templateUrl).to.equal(view);
        });
    });
});