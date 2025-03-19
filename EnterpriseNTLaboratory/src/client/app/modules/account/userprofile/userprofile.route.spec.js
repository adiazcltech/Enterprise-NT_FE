/* jshint -W117, -W030 */
describe('userprofile', function () {
    describe('state', function () {
        var view = 'app/modules/account/userprofile/userprofile.html';

        beforeEach(function () {
            module('app.userprofile', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state alarm to url /userprofile ', function () {
            expect($state.href('userprofile', {})).to.equal('/userprofile');
        });
        it('should map /alarm route to alarm View template', function () {
            expect($state.get('userprofile').templateUrl).to.equal(view);
        });
    });
});
