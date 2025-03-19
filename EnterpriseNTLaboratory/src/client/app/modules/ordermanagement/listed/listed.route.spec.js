/* jshint -W117, -W030 */
describe('listedRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/ordermanagement/listed/listed.html';

        beforeEach(function () {
            module('app.listed', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state listed to url /listed ', function () {
            expect($state.href('listed', {})).to.equal('/listed');
        });
        it('should map /listed route to alarm View template', function () {
            expect($state.get('listed').templateUrl).to.equal(view);
        });
    });
});  