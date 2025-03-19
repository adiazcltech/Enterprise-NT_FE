/* jshint -W117, -W030 */
describe('receptionsamplesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/transplants/cytotoxicantibodies/cytotoxicantibodies.html';

        beforeEach(function () {
            module('app.cytotoxicantibodies', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /cytotoxicantibodies ', function () {
            expect($state.href('cytotoxicantibodies', {})).to.equal('/cytotoxicantibodies');
        });
        it('should map /cytotoxicantibodies route to hematologicalcounter View template', function () {
            expect($state.get('cytotoxicantibodies').templateUrl).to.equal(view);
        });
    });
});