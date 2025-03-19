/* jshint -W117, -W030 */
describe('worklistRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/result/worklist/worklist.html';

        beforeEach(function () {
            module('app.worklist', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /worklist ', function () {
            expect($state.href('worklist', {})).to.equal('/worklist');
        });
        it('should map /worklist route to hematologicalcounter View template', function () {
            expect($state.get('worklist').templateUrl).to.equal(view);
        });
    });
});   