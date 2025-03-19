/* jshint -W117, -W030 */
describe('processRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/microbiology/process/process.html';

        beforeEach(function () {
            module('app.process', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state process to url /process ', function () {
            expect($state.href('process', {})).to.equal('/process');
        });
        it('should map /process route to process View template', function () {
            expect($state.get('process').templateUrl).to.equal(view);
        });
    });
});