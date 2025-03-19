/* jshint -W117, -W030 */
describe('login', function () {
    describe('state', function () {
        var view = 'app/modules/account/login/login.html';

        beforeEach(function () {
            module('app.login', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state alarm to url /login ', function () {
            expect($state.href('login', {})).to.equal('/');
        });
        it('should map /alarm route to alarm View template', function () {
            expect($state.get('login').templateUrl).to.equal(view);
        });
    });
});
