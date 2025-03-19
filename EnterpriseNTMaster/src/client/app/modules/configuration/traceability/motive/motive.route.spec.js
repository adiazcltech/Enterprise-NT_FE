/* jshint -W117, -W030 */
describe('motiveRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/traceability/motive/motive.html';

        beforeEach(function () {
            module('app.motive', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state motive to url /motive ', function () {
            expect($state.href('motive', {})).to.equal('/motive');
        });
        it('should map /motive route to motive View template', function () {
            expect($state.get('motive').templateUrl).to.equal(view);
        });
        
    });
});