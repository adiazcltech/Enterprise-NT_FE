/* jshint -W117, -W030 */
describe('customerRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/billing/customer/customer.html';

        beforeEach(function () {
            module('app.customer', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state customer to url /customer ', function () {
            expect($state.href('customer', {})).to.equal('/customer');
        });
        it('should map /customer route to customer View template', function () {
            expect($state.get('customer').templateUrl).to.equal(view);
        });
    });
});