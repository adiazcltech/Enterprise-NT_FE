/* jshint -W117, -W030 */
describe('questionRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/interview/question/question.html';

        beforeEach(function () {
            module('app.question', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state question to url /question ', function () {
            expect($state.href('question', {})).to.equal('/question');
        });
        it('should map /question route to question View template', function () {
            expect($state.get('question').templateUrl).to.equal(view);
        });
    });
});