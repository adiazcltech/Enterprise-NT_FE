/* jshint -W117, -W030 */
describe('areaPathologyRoutes', function() {
    describe('state', function() {
        var view = 'app/modules/configuration/pathology/areapathology/areapathology.html';

        beforeEach(function() {
            module('app.areapathology', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state areapathology to url /areapathology ', function() {
            expect($state.href('areapathology', {})).to.equal('/areapathology');
        });
        it('should map /areapathology route to areapathology View template', function() {
            expect($state.get('areapathology').templateUrl).to.equal(view);
        });
    });
});