/* jshint -W117, -W030 */
describe('containerPathologyRoutes', function() {
    describe('state', function() {
        var view = 'app/modules/configuration/pathology/containerpathology/containerpathology.html';

        beforeEach(function() {
            module('app.containerpathology', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state containerpathology to url /containerpathology ', function() {
            expect($state.href('containerpathology', {})).to.equal('/containerpathology');
        });
        it('should map /containerpathology route to containerpathology View template', function() {
            expect($state.get('containerpathology').templateUrl).to.equal(view);
        });

    });
});