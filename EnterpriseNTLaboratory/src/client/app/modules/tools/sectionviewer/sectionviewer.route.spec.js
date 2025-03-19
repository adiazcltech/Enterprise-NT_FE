/* jshint -W117, -W030 */
describe('sectionviewer', function () {
    describe('state', function () {
        var view = 'app/modules/tools/sectionviewer/sectionviewer.html';

        beforeEach(function () {
            module('app.sectionviewer', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /sectionviewer ', function () {
            expect($state.href('sectionviewer', {})).to.equal('/sectionviewer');
        });
        it('should map /sectionviewer route to hematologicalcounter View template', function () {
            expect($state.get('sectionviewer').templateUrl).to.equal(view);
        });
    });
});