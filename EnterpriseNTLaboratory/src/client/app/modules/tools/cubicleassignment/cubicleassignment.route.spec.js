/* jshint -W117, -W030 */
describe('cubicleassignment', function () {
    describe('state', function () {
        var view = 'app/modules/tools/cubicleassignment/cubicleassignment.html';

        beforeEach(function () {
            module('app.cubicleassignment', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /cubicleassignment ', function () {
            expect($state.href('cubicleassignment', {})).to.equal('/cubicleassignment');
        });
        it('should map /cubicleassignment route to hematologicalcounter View template', function () {
            expect($state.get('cubicleassignment').templateUrl).to.equal(view);
        });
    });
});