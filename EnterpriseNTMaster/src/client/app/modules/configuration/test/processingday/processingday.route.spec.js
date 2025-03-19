/* jshint -W117, -W030 */
describe('processingdayRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/processingday/processingday.html';

        beforeEach(function () {
            module('app.processingday', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state processingday to url /processingday ', function () {
            expect($state.href('processingday', {})).to.equal('/processingday');
        });
        it('should map /processingday route to processingday View template', function () {
            expect($state.get('processingday').templateUrl).to.equal(view);
        });
    });
});