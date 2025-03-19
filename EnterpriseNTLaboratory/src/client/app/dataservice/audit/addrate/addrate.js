/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('addrate', addrate);

    addrate.$inject = ['labelaudit', '$filter', 'moment'];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function addrate(labelaudit, $filter, moment) {
        var service = {
            add: add
        };
        return service;
        function add(name, data) {
            var datauser = [];
            if (name === 0) {//Asignación de precios por tarifa  
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'nameValid') {
                        var object = {
                            'mastert': ($filter('translate')('1063')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1010'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'nameRate') {
                        var object = {
                            'mastert': ($filter('translate')('1063')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0087'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'test') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue !== null && data.state !== 'I') {
                            listold = listold +
                                '<b>' + $filter('translate')('0098') + ':</b>' +
                                oldValue.code +
                                '<br>' +
                                '<b>' + $filter('translate')('0118') + ':</b>' +
                                oldValue.name +
                                '<br>' +
                                '<b>' + $filter('translate')('0257') + ':</b>' +
                                oldValue.price +
                                '<br><br>';
                        }
                        if (newValue !== null) {
                            listnew = listnew +
                                '<b>' + $filter('translate')('0098') + ':</b>' +
                                newValue.code +
                                '<br>' +
                                '<b>' + $filter('translate')('0118') + ':</b>' +
                                newValue.name +
                                '<br>' +
                                '<b>' + $filter('translate')('0257') + ':</b>' +
                                newValue.price +
                                '<br><br>';
                        }

                        var object = {
                            'mastert': ($filter('translate')('1063')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0013'),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);

                    }
                }
                return datauser;
            }
            if (name === 1) {//vigencia  
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'automatically') {
                        var object = {
                            'mastert': ($filter('translate')('1010')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field === 'state' ? 'stateA' : 'automatically'),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'initialDate') {
                        var object = {
                            'mastert': ($filter('translate')('1010')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : moment(new Date(data.fields[j].oldValue)).format('DD/MM/YYYY') === 'Invalid date' ? moment(parseInt(data.fields[j].oldValue)).format('DD/MM/YYYY') : moment(new Date(data.fields[j].oldValue)).format('DD/MM/YYYY'),
                            'after': data.fields[j].newValue === null ? '' : moment(new Date(data.fields[j].newValue)).format('DD/MM/YYYY') === 'Invalid date' ? moment(parseInt(data.fields[j].newValue)).format('DD/MM/YYYY') : moment(new Date(data.fields[j].newValue)).format('DD/MM/YYYY'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'endDate') {
                        var object = {
                            'mastert': ($filter('translate')('1010')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : moment(new Date(data.fields[j].oldValue)).format('DD/MM/YYYY') === 'Invalid date' ? moment(parseInt(data.fields[j].oldValue)).format('DD/MM/YYYY') : moment(new Date(data.fields[j].oldValue)).format('DD/MM/YYYY'),
                            'after': data.fields[j].newValue === null ? '' : moment(new Date(data.fields[j].newValue)).format('DD/MM/YYYY') === 'Invalid date' ? moment(parseInt(data.fields[j].newValue)).format('DD/MM/YYYY') : moment(new Date(data.fields[j].newValue)).format('DD/MM/YYYY'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1010')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 2) {//Impuesto por prueba
                for (var j = 0; j < data.fields.length; j++) {
                    var oldValue = data.fields[j].oldValue === null ? [] : _.filter(JSON.parse(data.fields[j].oldValue), function (o) { return o.tax !== undefined && o.tax !== 0; });
                    var newValue = data.fields[j].newValue === null ? [] : _.filter(JSON.parse(data.fields[j].newValue), function (o) { return o.tax !== undefined && o.tax !== 0; });
                    var listold = '';
                    var listnew = '';
                    if (oldValue.length !== 0) {
                        for (var m = 0; m < oldValue.length; m++) {
                            listold = listold +
                                '<b> * </b>' +
                                oldValue[m].name +
                                '<br>' +
                                '<b>' + $filter('translate')('0470') + ':</b>' +
                                oldValue[m].tax +
                                '<br><br>';
                        }
                    }
                    if (newValue.length !== 0) {
                        for (var t = 0; t < newValue.length; t++) {
                            listnew = listnew +
                                '<b> * </b>' +
                                newValue[t].name +
                                '<br>' +
                                '<b>' + $filter('translate')('0470') + ':</b>' +
                                newValue[t].tax +
                                '<br><br>';
                        }
                    }
                    var object = {
                        'mastert': ($filter('translate')('1062')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0866'),
                        'before': oldValue[0] == undefined ? '' : oldValue[0].area.name,
                        'after': newValue[0] === undefined ? '' : newValue[0].area.name,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                    var object = {
                        'mastert': ($filter('translate')('1062')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0013'),
                        'before': listold,
                        'after': listnew,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                }
                return datauser;
            }
            if (name === 3) {//Receptor edi
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('1011')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1011')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 4) {//dias de alarma pendientes de pago
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'test') {
                        var oldValue = data.fields[j].oldValue === null ? [] : _.filter(JSON.parse(data.fields[j].oldValue), function (o) { return o.deltacheckDays !== 0; });
                        var newValue = data.fields[j].newValue === null ? [] : _.filter(JSON.parse(data.fields[j].newValue), function (o) { return o.deltacheckDays !== 0; });
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    oldValue[m].name +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0476') + ':</b>' +
                                    oldValue[m].deltacheckDays +
                                    '<br><br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    newValue[t].name +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0476') + ':</b>' +
                                    newValue[t].deltacheckDays +
                                    '<br><br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('1061')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0013'),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);

                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1061')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': data.fields[j].field,
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 5) {//Tarifa por cliente
                for (var j = 0; j < data.fields.length; j++) {
                    var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                    var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                    var listold = '';
                    var listnew = '';
                    if (oldValue.length !== 0) {
                        for (var m = 0; m < oldValue.length; m++) {
                            listold = listold +
                                '* ' +
                                oldValue[m].rate.name +
                                '<br>';
                        }
                    }
                    if (newValue.length !== 0) {
                        for (var t = 0; t < newValue.length; t++) {
                            listnew = listnew +
                                '* ' +
                                newValue[t].rate.name +
                                '<br>';
                        }
                    }
                    if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1060')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0085'),
                            'before': oldValue.length === 0 ? '' : oldValue[0].account.name,
                            'after': newValue.length === 0 ? '' : newValue[0].account.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                        var object = {
                            'mastert': ($filter('translate')('1060')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0087'),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 6) {//RESOLUCIÓN
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('1009')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'provider') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1009')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1009')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 7) {//TARIFA
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'checkPaid' || data.fields[j].field === 'showPriceInEntry' || data.fields[j].field === 'defaultItem' || data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0087')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'code' || data.fields[j].field === 'name' || data.fields[j].field === 'phone') {
                        var object = {
                            'mastert': ($filter('translate')('0087')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'address' || data.fields[j].field === 'email' || data.fields[j].field === 'addAddress') {
                        var object = {
                            'mastert': ($filter('translate')('0087')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field + 'T'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'city' || data.fields[j].field === 'department' || data.fields[j].field === 'webPage') {
                        var object = {
                            'mastert': ($filter('translate')('0087')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'postalCode' || data.fields[j].field === 'observation' || data.fields[j].field === 'checkPaid') {
                        var object = {
                            'mastert': ($filter('translate')('0087')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);

                    } else if (data.fields[j].field === 'typePayer') {
                        if (data.fields[j].oldValue === '1') { var oldValue = $filter('translate')('1051'); }
                        if (data.fields[j].oldValue === '2') { var oldValue = $filter('translate')('1052'); }
                        if (data.fields[j].oldValue === '3') { var oldValue = $filter('translate')('1053'); }
                        if (data.fields[j].oldValue === '4') { var oldValue = $filter('translate')('1054'); }
                        if (data.fields[j].oldValue === '5') { var oldValue = $filter('translate')('1055'); }
                        if (data.fields[j].newValue === '1') { var newValue = $filter('translate')('1051'); }
                        if (data.fields[j].newValue === '2') { var newValue = $filter('translate')('1052'); }
                        if (data.fields[j].newValue === '3') { var newValue = $filter('translate')('1053'); }
                        if (data.fields[j].newValue === '4') { var newValue = $filter('translate')('1054'); }
                        if (data.fields[j].newValue === '5') { var newValue = $filter('translate')('1055'); }
                        var object = {
                            'mastert': ($filter('translate')('0087')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'checkCPTRelation' || data.fields[j].field === 'assingAllAccounts') {
                        var object = {
                            'mastert': ($filter('translate')('0087')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'applyDiagnostics' || data.fields[j].field === 'homebound' || data.fields[j].field === 'venipunture') {
                        var object = {
                            'mastert': ($filter('translate')('0087')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'claimType') {
                        if (data.fields[j].oldValue === '') { var oldValue = ''; }
                        if (data.fields[j].oldValue === '1') { var oldValue = $filter('translate')('1056'); }
                        if (data.fields[j].oldValue === '2') { var oldValue = $filter('translate')('1057'); }
                        if (data.fields[j].oldValue === '3') { var oldValue = $filter('translate')('1058'); }
                        if (data.fields[j].newValue === '') { var newValue = ''; }
                        if (data.fields[j].newValue === '1') { var newValue = $filter('translate')('1056'); }
                        if (data.fields[j].newValue === '2') { var newValue = $filter('translate')('1057'); }
                        if (data.fields[j].newValue === '3') { var newValue = $filter('translate')('1058'); }
                        var object = {
                            'mastert': ($filter('translate')('1008')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'eligibility' || data.fields[j].field === 'applyTypePayer' || data.fields[j].field === 'assingBenefits' || data.fields[j].field === 'supplierSignature') {
                        var object = {
                            'mastert': ($filter('translate')('1008')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'transactionType') {
                        var oldValue = '';
                        var newValue = '';
                        if (data.fields[j].oldValue === '1') { var oldValue = $filter('translate')('0459'); }
                        if (data.fields[j].oldValue === '2') { var oldValue = $filter('translate')('1059'); }
                        if (data.fields[j].newValue === '1') { var newValue = $filter('translate')('0459'); }
                        if (data.fields[j].newValue === '2') { var newValue = $filter('translate')('1059'); }
                        var object = {
                            'mastert': ($filter('translate')('1008')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'electronicClaim') {
                        var object = {
                            'mastert': ($filter('translate')('1008')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'false' ? $filter('translate')('0074') : $filter('translate')('1419'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'false' ? $filter('translate')('0074') : $filter('translate')('1419'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'receiver' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1008')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
        }
    }
})();
/* jshint ignore:end */