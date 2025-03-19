/* jshint -W117, -W030 */
describe('worksheetsRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/test/worksheets/worksheets.html';

        beforeEach(function () {
            module('app.worksheets', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state worksheets to url /worksheets ', function () {
            expect($state.href('worksheets', {})).to.equal('/worksheets');
        });
        it('should map /worksheets route to worksheets View template', function () {
            expect($state.get('worksheets').templateUrl).to.equal(view);
        });
    });
});