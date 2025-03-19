/* jshint -W117, -W030 */
describe('recordresultbyrank', function () {
    describe('state', function () {
        var view = 'app/modules/result/recordresultbyrank/recordresultbyrank.html';

        beforeEach(function () {
            module('app.recordresultbyrank', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /recordresultbyrank ', function () {
            expect($state.href('recordresultbyrank', {})).to.equal('/recordresultbyrank');
        });
        it('should map /recordresultbyrank route to hematologicalcounter View template', function () {
            expect($state.get('recordresultbyrank').templateUrl).to.equal(view);
        });
    });
}); 