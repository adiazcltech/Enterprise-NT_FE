/* jshint -W117, -W030 */
describe('demographicapprovalRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/integration/demographicapproval/demographicapproval.html';

        beforeEach(function () {
            module('app.demographicapproval', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state demographicapproval to url /demographicapproval ', function () {
            expect($state.href('demographicapproval', {})).to.equal('/demographicapproval');
        });
        it('should map /demographicapproval route to demographicapproval View template', function () {
            expect($state.get('demographicapproval').templateUrl).to.equal(view);
        });
    });
});