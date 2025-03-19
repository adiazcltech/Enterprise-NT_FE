/* jshint -W117, -W030 */
describe('queriesRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/reportsandconsultations/queries/queries.html';

        beforeEach(function () {
            module('app.queries', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /queries ', function () {
            expect($state.href('queries', {})).to.equal('/queries');
        });
        it('should map /queries route to hematologicalcounter View template', function () {
            expect($state.get('queries').templateUrl).to.equal(view);
        });
    });
});