/* jshint -W117, -W030 */
describe('cardRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/billing/card/card.html';

        beforeEach(function () {
            module('app.card', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state card to url /card ', function () {
            expect($state.href('card', {})).to.equal('/card');
        });
        it('should map /card route to card View template', function () {
            expect($state.get('card').templateUrl).to.equal(view);
        });
    });
});