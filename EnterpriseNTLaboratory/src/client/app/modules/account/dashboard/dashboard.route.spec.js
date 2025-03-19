/* jshint -W117, -W030 */
describe('dashboardRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/account/dashboard/dashboard.html';

        beforeEach(function () {
            module('app.dashboard', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state dashboard to url /dashboard ', function () {
            expect($state.href('dashboard', {})).to.equal('/dashboard');
        });
        it('should map /dashboard route to alarm View template', function () {
            expect($state.get('dashboard').templateUrl).to.equal(view);
        });
    });
});   