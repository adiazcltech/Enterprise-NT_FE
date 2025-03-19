/* jshint -W117, -W030 */
describe('excludetestbyuserRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/user/excludetestbyuser/excludetestbyuser.html';

        beforeEach(function () {
            module('app.excludetestbyuser', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state excludetestbyuser to url /excludetestbyuser ', function () {
            expect($state.href('excludetestbyuser', {})).to.equal('/excludetestbyuser');
        });
        it('should map /excludetestbyuser route to excludetestbyuser View template', function () {
            expect($state.get('excludetestbyuser').templateUrl).to.equal(view);
        });
    });
});