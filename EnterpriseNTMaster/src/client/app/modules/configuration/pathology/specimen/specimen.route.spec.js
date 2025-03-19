/* jshint -W117, -W030 */
describe('specimenRoutes', function() {
    describe('state', function() {
        var view = 'app/modules/configuration/pathology/specimen/specimen.html';

        beforeEach(function() {
            module('app.specimen', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state specimen to url /specimen ', function() {
            expect($state.href('specimen', {})).to.equal('/specimen');
        });
        it('should map /specimen route to specimen View template', function() {
            expect($state.get('specimen').templateUrl).to.equal(view);
        });
    });
});