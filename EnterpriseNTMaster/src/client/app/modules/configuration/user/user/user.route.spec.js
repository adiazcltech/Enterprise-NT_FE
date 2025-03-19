/* jshint -W117, -W030 */
describe('userRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/user/user/user.html';

        beforeEach(function () {
            module('app.user', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state user to url /user ', function () {
            expect($state.href('user', {})).to.equal('/user');
        });
        it('should map /user route to user View template', function () {
            expect($state.get('user').templateUrl).to.equal(view);
        });
    });
});