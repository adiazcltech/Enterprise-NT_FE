/* jshint -W117, -W030 */
describe('datacustomers', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/datacustomers/datacustomers.html';

        beforeEach(function () {
            module('app.datacustomers', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state datacustomers to url /datacustomers ', function () {
            expect($state.href('datacustomers', {})).to.equal('/datacustomers');
        });
        it('should map /datacustomers route to datacustomers View template', function () {
            expect($state.get('datacustomers').templateUrl).to.equal(view);
        });
    });
});