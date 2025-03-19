/* jshint -W117, -W030 */
describe('organRoutes', function() {
    describe('state', function() {
        var view = 'app/modules/configuration/pathology/organ/organ.html';

        beforeEach(function() {
            module('app.organ', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state organ to url /organ ', function() {
            expect($state.href('organ', {})).to.equal('/organ');
        });
        it('should map /organ route to organ View template', function() {
            expect($state.get('organ').templateUrl).to.equal(view);
        });
    });
});