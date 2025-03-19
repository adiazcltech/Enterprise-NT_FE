/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('addtestone', addtestone);

    addtestone.$inject = ['labelaudit', '$filter', 'moment'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function addtestone(labelaudit, $filter, moment) {
        var service = {
            add: add
        };
        return service;
        function add(name, data) {
            var datauser = [];
            if (name === 0) {//pruebas por demograficos pyp      
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'tests') {
                        var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { selected: 'true' });
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>' + $filter('translate')('0098') + ':</b>' +
                                    oldValue[m].code +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0118') + ':</b>' +
                                    oldValue[m].name +
                                    '<br><br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>' + $filter('translate')('0098') + ':</b>' +
                                    newValue[t].code +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0118') + ':</b>' +
                                    newValue[t].name +
                                    '<br><br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0996')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);

                    } else if (data.fields[j].field === 'unit') {
                        if (data.fields[j].oldValue == '1') { var oldValue = $filter('translate')('0103'); }
                        if (data.fields[j].oldValue == '2') { var oldValue = $filter('translate')('0476'); }
                        if (data.fields[j].newValue == '1') { var newValue = $filter('translate')('0103'); }
                        if (data.fields[j].newValue == '2') { var newValue = $filter('translate')('0476'); }
                        var object = {
                            'mastert': ($filter('translate')('0996')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'gender') {
                        var object = {
                            'mastert': ($filter('translate')('0996')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.state === 'I' ? '' : data.fields[j].newValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 1) {//Pruebas por laboratorio                
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'test') {
                        var newValue = data.fields[j].newValue === null ? '' : JSON.parse(data.fields[j].newValue).name
                        var oldValue = data.fields[j].oldValue === null ? '' : JSON.parse(data.fields[j].oldValue).name
                        var object = {
                            'mastert': ($filter('translate')('1012')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'urgency') {
                        if (data.fields[j].oldValue === '0') { var oldValue = ''; }
                        if (data.fields[j].oldValue === '1') { var oldValue = $filter('translate')('1091'); }
                        if (data.fields[j].oldValue === '2') { var oldValue = $filter('translate')('1092'); }
                        if (data.fields[j].newValue === '0') { var newValue = ''; }
                        if (data.fields[j].newValue === '1') { var newValue = $filter('translate')('1091'); }
                        if (data.fields[j].newValue === '2') { var newValue = $filter('translate')('1092'); }
                        var object = {
                            'mastert': ($filter('translate')('1012')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'routine') {
                        if (data.fields[j].oldValue === '0') { var oldValue = ''; }
                        if (data.fields[j].oldValue === '1') { var oldValue = $filter('translate')('1091'); }
                        if (data.fields[j].oldValue === '2') { var oldValue = $filter('translate')('1092'); }
                        if (data.fields[j].newValue === '0') { var newValue = ''; }
                        if (data.fields[j].newValue === '1') { var newValue = $filter('translate')('1091'); }
                        if (data.fields[j].newValue === '2') { var newValue = $filter('translate')('1092'); }
                        var object = {
                            'mastert': ($filter('translate')('1012')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'idBranch' && data.fields[j].field !== 'idLaboratory' && data.fields[j].field !== 'groupType' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction' && data.fields[j].field !== 'codeLaboratory') {
                        var object = {
                            'mastert': ($filter('translate')('1012')).toUpperCase(),
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
            if (name === 2) {//laboratorio
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0429')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'type') {
                        var object = {
                            'mastert': ($filter('translate')('0429')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === '2' ? $filter('translate')('1036') : $filter('translate')('1037'),
                            'after': data.fields[j].newValue === '2' ? $filter('translate')('1036') : $filter('translate')('1037'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'check' && data.fields[j].field !== 'entry'&& data.fields[j].field !== 'middleware' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0429')).toUpperCase(),
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
            if (name === 3) {//diagnostico por prueba
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'tests') {
                        var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { selected: 'true' });
                        var newValue = data.fields[j].newValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].newValue), { selected: 'true' });
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>' + $filter('translate')('0098') + ':</b><br>' +
                                    oldValue[m].code +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0118') + ':</b><br>' +
                                    oldValue[m].name +
                                    '<br><br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>' + $filter('translate')('0098') + ':</b><br>' +
                                    newValue[t].code +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0118') + ':</b><br>' +
                                    newValue[t].name +
                                    '<br><br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0995')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'nameDiagnostic') {
                        var object = {
                            'mastert': ($filter('translate')('0995')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        }
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 4) {//diagnostico
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0258')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'type') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0258')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? oldValue.esCo : oldValue.enUsa,
                            'after': newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? newValue.esCo : newValue.enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0258')).toUpperCase(),
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
            if (name === 5) { //grupos de prueba
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0558')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'tests') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>' + $filter('translate')('0098') + ':</b><br>' +
                                    oldValue[m].code +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0118') + ':</b><br>' +
                                    oldValue[m].name +
                                    '<br><br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>' + $filter('translate')('0098') + ':</b><br>' +
                                    newValue[t].code +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0118') + ':</b><br>' +
                                    newValue[t].name +
                                    '<br><br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0558')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0558')).toUpperCase(),
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
            if (name === 6) { //Orden de impresión
                for (var j = 0; j < data.fields.length; j++) {
                    var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                    var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                    var listold = '';
                    var listnew = '';
                    if (oldValue.length !== 0) {
                        for (var m = 0; m < oldValue.length; m++) {
                            listold = listold +
                                '<b>' + $filter('translate')('0459') + ':</b><br>' +
                                oldValue[m].name +
                                '<br>' +
                                '<b>' + $filter('translate')('1035') + ':</b><br>' +
                                oldValue[m].printOrder +
                                '<br>';
                        }
                    }
                    if (newValue.length !== 0) {
                        for (var t = 0; t < newValue.length; t++) {
                            listnew = listnew +
                                '<b>' + $filter('translate')('0459') + ':</b><br>' +
                                newValue[t].name +
                                '<br>' +
                                '<b>' + $filter('translate')('1035') + ':</b><br>' +
                                newValue[t].printOrder +
                                '<br>';
                        }
                    }
                    if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1035')).toUpperCase(),
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
            if (name === 7) { //Dias de procesamiento
                for (var j = 0; j < data.fields.length; j++) {
                    var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                    var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                    var listold = '';
                    var listnew = '';
                    if (oldValue.length !== 0) {
                        for (var m = 0; m < oldValue.length; m++) {
                            var processingDays = '';
                            var processingLun = oldValue[m].processingDays.search(1) === -1 ? '' : $filter('translate')('1126');
                            var processingMar = oldValue[m].processingDays.search(2) === -1 ? '' : $filter('translate')('1127');
                            var processingMie = oldValue[m].processingDays.search(3) === -1 ? '' : $filter('translate')('1128');
                            var processingJue = oldValue[m].processingDays.search(4) === -1 ? '' : $filter('translate')('1129');
                            var processingvie = oldValue[m].processingDays.search(5) === -1 ? '' : $filter('translate')('1130');
                            var processingSab = oldValue[m].processingDays.search(6) === -1 ? '' : $filter('translate')('1131');
                            var processingDom = oldValue[m].processingDays.search(7) === -1 ? '' : $filter('translate')('1132');
                            processingDays = processingLun + ' ' + processingMar + ' ' +
                                processingMie + ' ' + processingJue + ' ' +
                                processingvie + ' ' + processingSab + ' ' +
                                processingDom;
                            listold = listold +
                                '<b>' + $filter('translate')('0459') + ':</b><br>' +
                                oldValue[m].name +
                                '<br>' +
                                '<b>' + $filter('translate')('0851') + ':</b><br>' +
                                processingDays +
                                '<br>';
                        }
                    }
                    if (newValue.length !== 0) {
                        for (var t = 0; t < newValue.length; t++) {
                            var processingDays = '';
                            var processingLun = newValue[t].processingDays.search(1) === -1 ? '' : $filter('translate')('1126');
                            var processingMar = newValue[t].processingDays.search(2) === -1 ? '' : $filter('translate')('1127');
                            var processingMie = newValue[t].processingDays.search(3) === -1 ? '' : $filter('translate')('1128');
                            var processingJue = newValue[t].processingDays.search(4) === -1 ? '' : $filter('translate')('1129');
                            var processingvie = newValue[t].processingDays.search(5) === -1 ? '' : $filter('translate')('1130');
                            var processingSab = newValue[t].processingDays.search(6) === -1 ? '' : $filter('translate')('1131');
                            var processingDom = newValue[t].processingDays.search(7) === -1 ? '' : $filter('translate')('1132');
                            processingDays = processingLun + ' ' + processingMar + ' ' +
                                processingMie + ' ' + processingJue + ' ' +
                                processingvie + ' ' + processingSab + ' ' +
                                processingDom;
                            listnew = listnew +
                                '<b>' + $filter('translate')('0459') + ':</b><br>' +
                                newValue[t].name +
                                '<br>' +
                                '<b>' + $filter('translate')('0851') + ':</b><br>' +
                                processingDays +
                                '<br>';
                        }
                    }
                    if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0851')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0013'),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        }
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 8) { //Muestra
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'coveredSample' || data.fields[j].field === 'specialStorage' || data.fields[j].field === 'check') {
                        var object = {
                            'mastert': ($filter('translate')('0111')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'container') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0111')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'laboratorytype') {
                        var oldValuelaboratorytype = '';
                        if (data.fields[j].oldValue !== null) {
                            var Clinical = data.fields[j].oldValue.search('2') === -1 ? '' : '*' + $filter('translate')('1028') + '<br>';
                            var Microbiology = data.fields[j].oldValue.search('3') === -1 ? '' : '*' + $filter('translate')('0225') + '<br>';
                            var Pathology = data.fields[j].oldValue.search('4') === -1 ? '' : '*' + $filter('translate')('1029') + '<br>';
                            var Cytology = data.fields[j].oldValue.search('5') === -1 ? '' : '*' + $filter('translate')('1030') + '<br>';
                            oldValuelaboratorytype = Clinical + ' ' + Microbiology + ' ' + Pathology + ' ' + Cytology + '<br>';
                        }
                        var newlaboratorytype = '';
                        if (data.fields[j].newValue !== null) {
                            var Clinical = data.fields[j].newValue.search('2') === -1 ? '' : '*' + $filter('translate')('1028') + '<br>';
                            var Microbiology = data.fields[j].newValue.search('3') === -1 ? '' : '*' + $filter('translate')('0225') + '<br>';
                            var Pathology = data.fields[j].newValue.search('4') === -1 ? '' : '*' + $filter('translate')('1029') + '<br>';
                            var Cytology = data.fields[j].newValue.search('5') === -1 ? '' : '*' + $filter('translate')('1030') + '<br>';
                            newlaboratorytype = Clinical + ' ' + Microbiology + ' ' + Pathology + ' ' + Cytology + '<br>';
                        }
                        var object = {
                            'mastert': ($filter('translate')('0111')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValuelaboratorytype,
                            'after': newlaboratorytype,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' &&
                        data.fields[j].field !== 'tests' &&
                        data.fields[j].field !== 'sampleTrackings' &&
                        data.fields[j].field !== 'subSamples' &&
                        data.fields[j].field !== 'printable' &&
                        data.fields[j].field !== 'typebarcode' &&
                        data.fields[j].field !== 'user' &&
                        data.fields[j].field !== 'lastTransaction' &&
                        data.fields[j].field !== 'selected') {
                        var object = {
                            'mastert': ($filter('translate')('0111')).toUpperCase(),
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
            if (name === 9) { //Recipiente
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0867')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'unit') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0867')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'idUserModify' && data.fields[j].field !== 'image' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0867')).toUpperCase(),
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
            if (name === 10) { //Comentario
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0114')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'diagnostic') {
                        var oldValue = '';
                        var newValue = '';
                        if (data.fields[j].oldValue === '1') { oldValue = $filter('translate')('0652'); }
                        if (data.fields[j].oldValue === '2') { oldValue = $filter('translate')('1025'); }
                        if (data.fields[j].oldValue === '3') { oldValue = $filter('translate')('1026'); }
                        if (data.fields[j].newValue === '1') { newValue = $filter('translate')('0652'); }
                        if (data.fields[j].newValue === '2') { newValue = $filter('translate')('1025'); }
                        if (data.fields[j].newValue === '3') { newValue = $filter('translate')('1026'); }
                        var object = {
                            'mastert': ($filter('translate')('0114')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);

                    } else if (data.fields[j].field === 'apply') {
                        var oldapply = '';
                        if (data.fields[j].oldValue !== null) {
                            if (data.fields[j].oldValue.search('1') !== -1) {
                                var Application = $filter('translate')('0743');
                            }
                            if (data.fields[j].oldValue.search('2') !== -1) {
                                var Application = $filter('translate')('1027');
                            }
                            if (data.fields[j].oldValue.search('3') !== -1) {
                                var Application = $filter('translate')('0402');
                            }
                            oldapply = Application;
                        }
                        var newapply = '';
                        if (data.fields[j].newValue !== null) {
                            if (data.fields[j].newValue.search('1') !== -1) {
                                var Application = $filter('translate')('0743');
                            }
                            if (data.fields[j].newValue.search('2') !== -1) {
                                var Application = $filter('translate')('1027');
                            }
                            if (data.fields[j].newValue.search('3') !== -1) {
                                var Application = $filter('translate')('0402');
                            }
                            newapply = Application;
                        }
                        var object = {
                            'mastert': ($filter('translate')('0114')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldapply,
                            'after': newapply,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0114')).toUpperCase(),
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



