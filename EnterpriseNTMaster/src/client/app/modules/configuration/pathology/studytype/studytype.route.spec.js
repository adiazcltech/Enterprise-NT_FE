/* jshint -W117, -W030 */
describe('studyTypeRoutes', function() {
    describe('state', function() {
        var view = 'app/modules/configuration/pathology/studytype/studytype.html';

        beforeEach(function() {
            module('app.studytype', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state studytype to url /studytype ', function() {
            expect($state.href('studytype', {})).to.equal('/studytype');
        });
        it('should map /studytype route to studytype View template', function() {
            expect($state.get('studytype').templateUrl).to.equal(view);
        });

    });
});