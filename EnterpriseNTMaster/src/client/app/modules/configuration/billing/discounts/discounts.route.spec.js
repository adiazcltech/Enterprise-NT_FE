/* jshint -W117, -W030 */
describe('cardRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/billing/discounts/discounts.html';

        beforeEach(function () {
            module('app.discounts', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state discounts to url /discounts ', function () {
            expect($state.href('discounts', {})).to.equal('/discounts');
        });
        it('should map /discounts route to discounts View template', function () {
            expect($state.get('discounts').templateUrl).to.equal(view);
        });
    });
});