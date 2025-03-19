/* jshint -W117, -W030 */
describe('orderswithouthistoryRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/ordermanagement/orderswithouthistory/orderswithouthistory.html';

        beforeEach(function () {
            module('app.orderswithouthistory', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state orderswithouthistory to url /orderswithouthistory ', function () {
            expect($state.href('orderswithouthistory', {})).to.equal('/orderswithouthistory');
        });
        it('should map /orderswithouthistory route to alarm View template', function () {
            expect($state.get('orderswithouthistory').templateUrl).to.equal(view);
        });
    });
});  