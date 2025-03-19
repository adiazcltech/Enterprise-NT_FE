/* jshint -W117, -W030 */
describe('sheetmanagementRoutes', function() {
    describe('state', function() {
        var view = 'app/modules/pathology/microscopy/sheetmanagement/sheetmanagement.html';

        beforeEach(function() {
            module('app.sheetmanagement', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /sheetmanagement ', function() {
            expect($state.href('sheetmanagement', {})).to.equal('/sheetmanagement');
        });
        it('should map /sheetmanagement route to hematologicalcounter View template', function() {
            expect($state.get('sheetmanagement').templateUrl).to.equal(view);
        });
    });
});