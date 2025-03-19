/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('addtestwo', addtestwo);

    addtestwo.$inject = ['labelaudit', '$filter', 'moment'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function addtestwo(labelaudit, $filter, moment) {
        var service = {
            add: add
        };
        return service;
        function add(name, data) {
            var datauser = [];
            if (name === 0) {//examen  
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'billing' ||
                        data.fields[j].field === 'deleteProfile' || data.fields[j].field === 'specialStorage' ||
                        data.fields[j].field === 'showEntry' || data.fields[j].field === 'showInQuery' ||
                        data.fields[j].field === 'confidential' || data.fields[j].field === 'resultRequest' ||
                        data.fields[j].field === 'printGraph' || data.fields[j].field === 'statisticsProcessed' ||
                        data.fields[j].field === 'basic' || data.fields[j].field === 'preliminaryValidation') {
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'testType') {
                        var oldValue = '';
                        var newValue = '';
                        if (data.fields[j].oldValue === '0') { oldValue = $filter('translate')('0459'); }
                        if (data.fields[j].oldValue === '1') { oldValue = $filter('translate')('0746'); }
                        if (data.fields[j].oldValue === '2') { oldValue = $filter('translate')('1034'); }
                        if (data.fields[j].newValue === '0') { newValue = $filter('translate')('0459'); }
                        if (data.fields[j].newValue === '1') { newValue = $filter('translate')('0746'); }
                        if (data.fields[j].newValue === '2') { newValue = $filter('translate')('1034'); }
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'statistics') {
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels('statisticsA'),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'unitAge') {
                        var oldValue = '';
                        var newValue = '';
                        if (data.fields[j].oldValue === '1') { oldValue = $filter('translate')('0103'); }
                        if (data.fields[j].oldValue === '2') { oldValue = $filter('translate')('0476'); }
                        if (data.fields[j].newValue === '1') { newValue = $filter('translate')('0103'); }
                        if (data.fields[j].newValue === '2') { newValue = $filter('translate')('0476'); }
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels('unitAgeT'),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'resultType') {
                        var oldValue = '';
                        var newValue = '';
                        if (data.fields[j].oldValue === '1') { oldValue = $filter('translate')('0496'); }
                        if (data.fields[j].oldValue === '2') { oldValue = $filter('translate')('0648'); }
                        if (data.fields[j].newValue === '1') { newValue = $filter('translate')('0496'); }
                        if (data.fields[j].newValue === '2') { newValue = $filter('translate')('0648'); }
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'printOnReport') {
                        var oldValue = '';
                        var newValue = '';
                        if (data.fields[j].oldValue === '1') { oldValue = $filter('translate')('0158'); }
                        if (data.fields[j].oldValue === '2') { oldValue = $filter('translate')('1031'); }
                        if (data.fields[j].oldValue === '3') { oldValue = $filter('translate')('1032'); }
                        if (data.fields[j].newValue === '1') { newValue = $filter('translate')('0158'); }
                        if (data.fields[j].newValue === '2') { newValue = $filter('translate')('1031'); }
                        if (data.fields[j].newValue === '3') { newValue = $filter('translate')('1032'); }
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'processingDays') {
                        var processingDaysoldValue = '';
                        if (data.fields[j].oldValue !== null) {
                            var processingLunold = data.fields[j].oldValue.search(1) === -1 ? '' : $filter('translate')('1126');
                            var processingMarold = data.fields[j].oldValue.search(2) === -1 ? '' : $filter('translate')('1127');
                            var processingMieold = data.fields[j].oldValue.search(3) === -1 ? '' : $filter('translate')('1128');
                            var processingJueold = data.fields[j].oldValue.search(4) === -1 ? '' : $filter('translate')('1129');
                            var processingvieold = data.fields[j].oldValue.search(5) === -1 ? '' : $filter('translate')('1130');
                            var processingSabold = data.fields[j].oldValue.search(6) === -1 ? '' : $filter('translate')('1131');
                            var processingDomold = data.fields[j].oldValue.search(7) === -1 ? '' : $filter('translate')('1132');
                            processingDaysoldValue = processingLunold + ' ' + processingMarold + ' ' +
                                processingMieold + ' ' + processingJueold + ' ' +
                                processingvieold + ' ' + processingSabold + ' ' +
                                processingDomold;
                        }
                        var processingDaysnewValue = '';
                        if (data.fields[j].newValue !== null) {
                            var processingLun = data.fields[j].newValue.search(1) === -1 ? '' : $filter('translate')('1126');
                            var processingMar = data.fields[j].newValue.search(2) === -1 ? '' : $filter('translate')('1127');
                            var processingMie = data.fields[j].newValue.search(3) === -1 ? '' : $filter('translate')('1128');
                            var processingJue = data.fields[j].newValue.search(4) === -1 ? '' : $filter('translate')('1129');
                            var processingvie = data.fields[j].newValue.search(5) === -1 ? '' : $filter('translate')('1130');
                            var processingSab = data.fields[j].newValue.search(6) === -1 ? '' : $filter('translate')('1131');
                            var processingDom = data.fields[j].newValue.search(7) === -1 ? '' : $filter('translate')('1132');
                            processingDaysnewValue = processingLun + ' ' + processingMar + ' ' +
                                processingMie + ' ' + processingJue + ' ' +
                                processingvie + ' ' + processingSab + ' ' +
                                processingDom;
                        }
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': processingDaysoldValue,
                            'after': processingDaysnewValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'processingBy') {
                        var oldValue = '';
                        var newValue = '';
                        if (data.fields[j].oldValue === '1') { oldValue = $filter('translate')('0862'); }
                        if (data.fields[j].oldValue === '2') { oldValue = $filter('translate')('1027'); }
                        if (data.fields[j].oldValue === '3') { oldValue = $filter('translate')('1033'); }
                        if (data.fields[j].newValue === '1') { newValue = $filter('translate')('0862'); }
                        if (data.fields[j].newValue === '2') { newValue = $filter('translate')('1027'); }
                        if (data.fields[j].newValue === '3') { newValue = $filter('translate')('1033'); }
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'requirements') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    oldValue[m].code +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    newValue[t].code +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'concurrences') {
                        var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { selected: true });
                        var newValue = data.fields[j].newValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].newValue), { selected: true });
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>' + $filter('translate')('0198') + ':</b>' +
                                    oldValue[m].concurrence.abbr +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0118') + ':</b>' +
                                    oldValue[m].concurrence.name +
                                    '<br><br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>' + $filter('translate')('0198') + ':</b>' +
                                    newValue[t].concurrence.abbr +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0118') + ':</b>' +
                                    newValue[t].concurrence.name +
                                    '<br><br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'level') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? oldValue.esCo : oldValue.enUsa,
                            'after': newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? newValue.esCo : newValue.enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'gender') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? oldValue.esCo : oldValue.enUsa,
                            'after': newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? newValue.esCo : newValue.enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'sample') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'technique') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'unit') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'selected' && data.fields[j].field !== 'selfValidation' && data.fields[j].field === 'excludeAnalytes' && data.fields[j].field === 'dependentExam' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction' && data.fields[j].field !== 'area') {
                        var object = {
                            'mastert': ($filter('translate')('0013')).toUpperCase(),
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
            if (name === 1) {// alarma
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('1015')).toUpperCase(),
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
                            'mastert': ($filter('translate')('1015')).toUpperCase(),
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
            if (name === 2) {//Grupo etario
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0513')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'gender') {
                        var object = {
                            'mastert': ($filter('translate')('0513')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? JSON.parse(data.fields[j].oldValue).esCo : JSON.parse(data.fields[j].oldValue).enUsa,
                            'after': data.fields[j].newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? JSON.parse(data.fields[j].newValue).esCo : JSON.parse(data.fields[j].newValue).enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'unitAge') {
                        var object = {
                            'mastert': ($filter('translate')('0513')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === '1' ? $filter('translate')('0428') : $filter('translate')('0476'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].oldValue === '1' ? $filter('translate')('0428') : $filter('translate')('0476'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0513')).toUpperCase(),
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
            if (name === 3) {//maestro requisito 
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0858')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'requirement') {
                        var object = {
                            'mastert': ($filter('translate')('0858')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0332'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'code') {
                        var object = {
                            'mastert': ($filter('translate')('0858')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0858'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'selected' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0858')).toUpperCase(),
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
            if (name === 4) {//maestro tecnica
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0740')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'name') {
                        var object = {
                            'mastert': ($filter('translate')('0740')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels('descriptionA'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0740')).toUpperCase(),
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
            if (name === 5) { //unidad
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0125')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0125')).toUpperCase(),
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
            if (name === 6) { //Area
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'partialValidation') {
                        var object = {
                            'mastert': ($filter('translate')('0866')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0866')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? JSON.parse(data.fields[j].oldValue).esCo : JSON.parse(data.fields[j].oldValue).enUsa,
                            'after': data.fields[j].newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? JSON.parse(data.fields[j].newValue).esCo : JSON.parse(data.fields[j].newValue).enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'color') {
                        var object = {
                            'mastert': ($filter('translate')('0866')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : '<span style="color:' + data.fields[j].oldValue + ';font-size: 15px">■</span>',
                            'after': data.fields[j].newValue === null ? '' : '<span style="color:' + data.fields[j].newValue + ';font-size: 15px">■</span>',
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'ordering') {
                        var object = {
                            'mastert': ($filter('translate')('0866')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels('code'),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0866')).toUpperCase(),
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



