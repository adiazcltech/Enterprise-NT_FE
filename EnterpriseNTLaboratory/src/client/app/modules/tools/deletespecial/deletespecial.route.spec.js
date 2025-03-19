/* jshint -W117, -W030 */
describe('deletespecial', function () {
    describe('state', function () {
        var view = 'app/modules/tools/deletespecial/deletespecial.html';

        beforeEach(function () {
            module('app.deletespecial', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state deletespecial to url /deletespecial', function () {
            expect($state.href('deletespecial', {})).to.equal('/deletespecial');
        });
        it('should map /deletespecial route to alarm View template', function () {
            expect($state.get('deletespecial').templateUrl).to.equal(view);
        });
    });
});   