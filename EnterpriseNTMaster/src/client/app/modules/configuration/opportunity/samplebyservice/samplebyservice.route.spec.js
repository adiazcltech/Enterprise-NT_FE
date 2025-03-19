/* jshint -W117, -W030 */
describe('samplebyserviceRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/opportunity/samplebyservice/samplebyservice.html';

        beforeEach(function () {
            module('app.samplebyservice', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state samplebyservice to url /samplebyservice ', function () {
            expect($state.href('samplebyservice', {})).to.equal('/samplebyservice');
        });
        it('should map /samplebyservice route to samplebyservice View template', function () {
            expect($state.get('samplebyservice').templateUrl).to.equal(view);
        });
    });
});