/* jshint -W117, -W030 */
describe('reciverRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/billing/reciver/reciver.html';

        beforeEach(function () {
            module('app.reciver', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state reciver to url /reciver ', function () {
            expect($state.href('reciver', {})).to.equal('/reciver');
        });
        it('should map /reciver route to reciver View template', function () {
            expect($state.get('reciver').templateUrl).to.equal(view);
        });
    });
});