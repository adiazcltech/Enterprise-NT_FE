/* jshint -W117, -W030 */
describe('destinationmicrobiologyRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/microbiology/destinationmicrobiology/destinationmicrobiology.html';

        beforeEach(function () {
            module('app.destinationmicrobiology', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state destinationmicrobiology to url /destinationmicrobiology ', function () {
            expect($state.href('destinationmicrobiology', {})).to.equal('/destinationmicrobiology');
        });
        it('should map /destinationmicrobiology route to destinationmicrobiology View template', function () {
            expect($state.get('destinationmicrobiology').templateUrl).to.equal(view);
        });
    });
});