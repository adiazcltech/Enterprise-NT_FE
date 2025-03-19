// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // url: 'http://localhost:8080/Enterprise_NT',
  // urlQueries: 'http://localhost:5200',
  url: 'http://192.168.1.6:8080/Enterprise_NT_PAT_PG',
  urlQueries: 'http://localhost:5200',
  urlFacturacion: 'http://localhost:8080', // api golang
  // urlQueries: 'http://192.168.1.68:5200',
  customer: '4', //1-> Labserving, 2-> Aida Ascencio, 3 -> La Mesa
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
