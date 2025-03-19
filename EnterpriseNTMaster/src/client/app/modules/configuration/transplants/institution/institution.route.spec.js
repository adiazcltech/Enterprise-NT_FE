/* jshint -W117, -W030 */
describe('institutionRoutes', function() {
    describe('state', function() {
        var view = 'app/modules/configuration/transplants/institution/institution.html';

        beforeEach(function() {
            module('app.institution', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state institution to url /institution ', function() {
            expect($state.href('institution', {})).to.equal('/institution');
        });
        it('should map /institution route to institution View template', function() {
            expect($state.get('institution').templateUrl).to.equal(view);
        });
    });
});