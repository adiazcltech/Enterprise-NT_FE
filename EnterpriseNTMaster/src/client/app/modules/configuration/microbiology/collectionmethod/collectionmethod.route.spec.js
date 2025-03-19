/* jshint -W117, -W030 */
describe('taskRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/microbiology/task/task.html';

        beforeEach(function () {
            module('app.task', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state task to url /task ', function () {
            expect($state.href('task', {})).to.equal('/task');
        });
        it('should map /task route to task View template', function () {
            expect($state.get('task').templateUrl).to.equal(view);
        });
    });
});