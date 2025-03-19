/* jshint -W117, -W030 */
describe('orderentryRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/ordermanagement/orderEntry/orderentry.html';

        beforeEach(function () {
            module('app.orderentry', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state orderentry to url /orderentry ', function () {
            expect($state.href('orderentry', {})).to.equal('/orderentry');
        });
        it('should map /orderentry route to alarm View template', function () {
            expect($state.get('orderentry').templateUrl).to.equal(view);
        });
    });
});  