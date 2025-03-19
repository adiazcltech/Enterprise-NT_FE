/* jshint -W117, -W030 */
describe('priceassigmentRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/billing/priceassigment/priceassigment.html';

        beforeEach(function () {
            module('app.priceassigment', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state priceassigment to url /priceassigment ', function () {
            expect($state.href('priceassigment', {})).to.equal('/priceassigment');
        });
        it('should map /priceassigment route to priceassigment View template', function () {
            expect($state.get('priceassigment').templateUrl).to.equal(view);
        });
    });
});