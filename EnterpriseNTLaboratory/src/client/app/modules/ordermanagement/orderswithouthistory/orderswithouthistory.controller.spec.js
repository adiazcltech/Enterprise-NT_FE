// /* jshint -W117, -W030 */

// describe('OrdersWithoutHistoryController', function () { 
//     var controller;
//     beforeEach(function () {
//         bard.appModule('app.orderswithouthistory');
//         bard.inject('$controller', '$log', '$q', '$rootScope', 'localStorageService', 'authService');
//     });

//     beforeEach(function () {
//         sinon.stub(authService, 'login').returns($q.when(
//             localStorageService.set('FormatoFecha', ''),
//             localStorageService.set('NumeroOrdenAutomatico', ''),
//             localStorageService.set('DigitosOrden', ''),
//             localStorageService.set('DigitosOrden', ''),
//             localStorageService.set('SimboloMonetario', ''),
//             localStorageService.set('ManejoCentavos', ''),
//             localStorageService.set('Enterprise_NT.authorizationData', {
//             authToken: 'eyJhbG',
//             userName: 'DEV'
//             })
//         ));

//         controller = $controller('OrdersWithoutHistoryController');

//     });

//         describe('orderswithouthistory controller', function () {
//         it('should be created successfully', function () {
//             expect(controller).to.be.defined;
//         });

//         describe('after activate', function () {
//             it('should have title of orderswithouthistory', function () {
//                 expect(controller.title).to.equal('OrdersWithoutHistory');
//             });
//         });
//     });
// });