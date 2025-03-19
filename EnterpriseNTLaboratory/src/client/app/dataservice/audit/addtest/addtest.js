/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('addtest', addtest);

    addtest.$inject = ['labelaudit', '$filter', 'moment'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function addtest(labelaudit, $filter, moment) {
        var service = {
            add: add
        };
        return service;
        function add(name, data) {
            var datauser = [];
            if (name === 0) {//valores de referencia     
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'criticalCh' || data.fields[j].field === 'mandatoryNotation') {
                        var object = {
                            'mastert': ($filter('translate')('1001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'test') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : '|' + oldValue.code + '|' + oldValue.name,
                            'after': newValue === null ? '' : '|' + newValue.code + '|' + newValue.name,
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
                            'mastert': ($filter('translate')('1001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'race') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : oldValue.name,
                            'after': newValue === null ? '' : newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'gender') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('1001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : $filter('translate')('0000') === 'esCo' ? oldValue.esCo : oldValue.enUsa,
                            'after': newValue === null ? '' : $filter('translate')('0000') === 'esCo' ? newValue.esCo : newValue.enUsa,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'panic') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        if (newValue.testId !== 0) {
                            var object = {
                                'mastert': ($filter('translate')('1001')).toUpperCase(),
                                'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                                'name': labelaudit.changelabels(data.fields[j].field),
                                'before': oldValue === null ? '' : oldValue.name,
                                'after': newValue === null ? '' : newValue.name,
                                'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                                'user': data.userName
                            };
                            datauser.push(object);
                        }
                    } else if (data.fields[j].field === 'normal') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        if (newValue.testId !== 0) {
                            var object = {
                                'mastert': ($filter('translate')('1001')).toUpperCase(),
                                'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                                'name': labelaudit.changelabels(data.fields[j].field),
                                'before': oldValue === null ? '' : oldValue.name,
                                'after': newValue === null ? '' : newValue.name,
                                'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                                'user': data.userName
                            };
                            datauser.push(object);
                        }
                    } else if (data.fields[j].field === 'ageMin' || data.fields[j].field === 'ageMax') {
                        var object = {
                            'mastert': ($filter('translate')('1001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field + 'V'),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue,
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'lastTransaction' && data.fields[j].field !== 'user') {
                        var object = {
                            'mastert': ($filter('translate')('1001')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue,
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 1) {//maestro de deltacheck 
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'name') {
                        var object = {
                            'mastert': ($filter('translate')('0357')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field + 'D'),
                            'before': data.fields[j].newValue,
                            'after': data.fields[j].oldValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'deltacheckDays') {
                        var object = {
                            'mastert': ($filter('translate')('0357')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'deltacheckMin') {
                        var object = {
                            'mastert': ($filter('translate')('0357')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                    else if (data.fields[j].field === 'deltacheckMax') {
                        var object = {
                            'mastert': ($filter('translate')('0357')).toUpperCase(),
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
            if (name === 2) {//resultado literal por prueba
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field !== 'id') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '<b>* </b>' +
                                    oldValue[m].literalResult.name +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '<b>* </b>' +
                                    newValue[t].literalResult.name +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('1040')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0013'),
                            'before': oldValue.length === 0 ? '' : oldValue[0].name,
                            'after': newValue.length === 0 ? '' : newValue[0].name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                        var object = {
                            'mastert': ($filter('translate')('1040')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0027'),
                            'before': data.state === 'U' ? '' : listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 3) {//resultado literal
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('1000')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        }
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'testId' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('1000')).toUpperCase(),
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
            if (name === 4) {//prueba automatica
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field !== 'id') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                var signnameoldValue = '';
                                if (oldValue[m].sign.id === 50) { signnameoldValue = '='; }
                                if (oldValue[m].sign.id === 51) { signnameoldValue = '>='; }
                                if (oldValue[m].sign.id === 52) { signnameoldValue = '<='; }
                                if (oldValue[m].sign.id === 53) { signnameoldValue = '<'; }
                                if (oldValue[m].sign.id === 54) { signnameoldValue = '>'; }
                                if (oldValue[m].sign.id === 55) { signnameoldValue = '<>'; }
                                if (oldValue[m].sign.id === 56) { signnameoldValue = $filter('translate')('1425'); }
                                if (oldValue[m].sign.id === 57) { signnameoldValue = $filter('translate')('1426'); }
                                listold = listold +
                                    '<b>*</b> ' + signnameoldValue + ' ' + oldValue[m].result1 + ' '
                                    + oldValue[m].result2 + '<br>' + oldValue[m].automaticTest.name +
                                    '<br><br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                var signname = '';
                                if (newValue[t].sign.id === 50) { signname = '='; }
                                if (newValue[t].sign.id === 51) { signname = '>='; }
                                if (newValue[t].sign.id === 52) { signname = '<='; }
                                if (newValue[t].sign.id === 53) { signname = '<'; }
                                if (newValue[t].sign.id === 54) { signname = '>'; }
                                if (newValue[t].sign.id === 55) { signname = '<>'; }
                                if (newValue[t].sign.id === 56) { signname = $filter('translate')('1425'); }
                                if (newValue[t].sign.id === 57) { signname = $filter('translate')('1426'); }

                                listnew = listnew +
                                    '<b>*</b> ' + signname + ' ' + newValue[t].result1 + ' '
                                    + newValue[t].result2 + '<br>' + newValue[t].automaticTest.name +
                                    '<br><br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('1039')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1427'),
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
            if (name === 5) { //relación resultados
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'rules') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listnewresult = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                if (oldValue[t].type === 1) {
                                    var type = $filter('translate')('0459');
                                    var question = oldValue[m].test.name;
                                } else {
                                    var type = $filter('translate')('0994');
                                    var question = oldValue[m].question.name;
                                }

                                var signnameoldValue = '';
                                if (oldValue[m].operator === '50') { signnameoldValue = '='; }
                                if (oldValue[m].operator === '51') { signnameoldValue = '>='; }
                                if (oldValue[m].operator === '52') { signnameoldValue = '<='; }
                                if (oldValue[m].operator === '53') { signnameoldValue = '<'; }
                                if (oldValue[m].operator === '54') { signnameoldValue = '>'; }
                                if (oldValue[m].operator === '55') { signnameoldValue = '<>'; }
                                if (oldValue[m].operator === '56') { signnameoldValue = $filter('translate')('1425'); }
                                if (oldValue[m].operator === '57') { signnameoldValue = $filter('translate')('1426'); }

                                listold = listold +
                                    '<b>' + $filter('translate')('0680') + ': </b>' +
                                    type +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0459') + ': </b>' +
                                    question +
                                    '<br>' +
                                    '<b> ' + $filter('translate')('0580') + ' </b>' +
                                    signnameoldValue + ' ' + oldValue[m].result + ' ' + oldValue[m].result2
                                '<br><br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                if (newValue[t].type === 1) {
                                    var type = $filter('translate')('0459');
                                    var question = newValue[t].test.name;
                                } else {
                                    var type = $filter('translate')('0994');
                                    var question = newValue[t].question.name;
                                }

                                var signname = '';
                                if (newValue[t].operator === '50') { signname = '='; }
                                if (newValue[t].operator === '51') { signname = '>='; }
                                if (newValue[t].operator === '52') { signname = '<='; }
                                if (newValue[t].operator === '53') { signname = '<'; }
                                if (newValue[t].operator === '54') { signname = '>'; }
                                if (newValue[t].operator === '55') { signname = '<>'; }
                                if (newValue[t].operator === '56') { signname = $filter('translate')('1425'); }
                                if (newValue[t].operator === '57') { signname = $filter('translate')('1426'); }


                                listnewresult = listnewresult +
                                    '<b>' + $filter('translate')('0680') + '</b>' +
                                    type +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0459') + ': </b>' +
                                    question +
                                    '<br>' +
                                    $filter('translate')('0680') + ': ' + newValue[t].result + ' ' +
                                    newValue[t].result2 + ' ' + signname;
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0999')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1427'),
                            'before': listold,
                            'after': listnewresult,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }

                }
                return datauser;
            }
            if (name === 6) { //Plantilla de resultados
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field !== 'id') {
                        var oldValue = data.fields[j].oldValue === null ? [] : JSON.parse(data.fields[j].oldValue);
                        var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                        var listold = '';
                        var listtestsold = '';
                        var listtestsnew = '';
                        var listnew = '';
                        vm.testName = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listtestsold = '';
                                for (var t = 0; t < oldValue[m].results.length; t++) {
                                    listtestsold = listtestsold + oldValue[m].results[t].result + '<br>';
                                }
                                vm.testName = oldValue[m].testName;
                                listold = listold + '<b>' + $filter('translate')('1038') + ':</b><br>' +
                                    oldValue[m].option + '<br>' + '<b>' + $filter('translate')('0114') + ':</b><br>' +
                                    oldValue[m].comment + '<br>' + '<b>' + $filter('translate')('0289') + ':</b><br>' +
                                    listtestsold + '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var m = 0; m < newValue.length; m++) {
                                listtestsnew = '';
                                for (var t = 0; t < newValue[m].results.length; t++) {
                                    listtestsnew = listtestsnew + newValue[m].results[t].result + '<br>';
                                }
                                listnew = listnew +
                                    '<b>' + $filter('translate')('1038') + ':</b><br>' +
                                    newValue[m].option +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0114') + ':</b><br>' + newValue[m].comment + '<br>' +
                                    '<b>' + $filter('translate')('0289') + ':</b><br>' +
                                    listtestsnew + '<br>'
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0599')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0013'),
                            'before': vm.testName,
                            'after': vm.testName,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                        var object = {
                            'mastert': ($filter('translate')('0599')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('1428'),
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
            if (name === 7) { //contador hematologico
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'sum') {
                        var object = {
                            'mastert': ($filter('translate')('0998')).toUpperCase(),
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
                            'mastert': ($filter('translate')('0998')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.state === 'I' ? '' : data.fields[j].oldValue === '2' ? $filter('translate')('0496') : $filter('translate')('0648'),
                            'after': data.fields[j].newValue === '2' ? $filter('translate')('0496') : $filter('translate')('0648'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'test') {
                        var oldValue = JSON.parse(data.fields[j].oldValue);
                        var newValue = JSON.parse(data.fields[j].newValue);
                        var object = {
                            'mastert': ($filter('translate')('0998')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': oldValue === null ? '' : '|' + oldValue.abbr + '|' + oldValue.name,
                            'after': newValue === null ? '' : '|' + newValue.abbr + '|' + newValue.name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);

                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0998')).toUpperCase(),
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
            if (name === 8) { //hojas de trabajo  
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'exclusive' || data.fields[j].field === 'microbiology' || data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0018')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'tests') {
                        var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { selected: 'true' });
                        var newValue = data.fields[j].newValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].newValue), { selected: 'true' });
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
                                    '<b>' + $filter('translate')('0098') + ':</b><br>' +
                                    newValue[t].code +
                                    '<br>' +
                                    '<b>' + $filter('translate')('0118') + ':</b><br>' +
                                    newValue[t].name +
                                    '<br><br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('0018')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': listold,
                            'after': listnew,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'type') {
                        if (data.fields[j].oldValue === '') { var oldValue = ''; }
                        if (data.fields[j].oldValue === '1') { var oldValue = $filter('translate')('0495'); }
                        if (data.fields[j].oldValue === '2') { var oldValue = $filter('translate')('0018'); }
                        if (data.fields[j].newValue === '') { var newValue = ''; }
                        if (data.fields[j].newValue === '1') { var newValue = $filter('translate')('0495'); }
                        if (data.fields[j].newValue === '2') { var newValue = $filter('translate')('0018'); }
                        var object = {
                            'mastert': ($filter('translate')('0018')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.state === 'U' ? '' : oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'orientation') {
                        if (data.fields[j].oldValue === '') { var oldValue = ''; }
                        if (data.fields[j].oldValue === '1') { var oldValue = $filter('translate')('0223'); }
                        if (data.fields[j].oldValue === '2') { var oldValue = $filter('translate')('0222'); }
                        if (data.fields[j].newValue === '') { var newValue = ''; }
                        if (data.fields[j].newValue === '1') { var newValue = $filter('translate')('0223'); }
                        if (data.fields[j].newValue === '2') { var newValue = $filter('translate')('0222'); }
                        var object = {
                            'mastert': ($filter('translate')('0018')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.state === 'I' ? '' : oldValue,
                            'after': newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0018')).toUpperCase(),
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
            if (name === 9) { //Excluir pruebas por demografico  
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { test: { selected: 'true' } });
                        var newValue = data.fields[j].newValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].newValue), { test: { selected: 'true' } });
                        var listold = '';
                        var listnew = '';
                        if (oldValue.length !== 0) {
                            for (var m = 0; m < oldValue.length; m++) {
                                listold = listold +
                                    '* |' +
                                    oldValue[m].test.code +
                                    '| ' +
                                    oldValue[m].test.name +
                                    '<br>';
                            }
                        }
                        if (newValue.length !== 0) {
                            for (var t = 0; t < newValue.length; t++) {
                                listnew = listnew +
                                    '* |' + newValue[t].test.code +
                                    '| ' +
                                    newValue[t].test.name +
                                    '<br>';
                            }
                        }
                        var object = {
                            'mastert': ($filter('translate')('1064')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0295'),
                            'before': newValue.length === 0 || data.state === 'U' ? '' : newValue[0].name,
                            'after': newValue.length === 0 ? '' : newValue[0].name,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                        var object = {
                            'mastert': ($filter('translate')('1064')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': $filter('translate')('0013'),
                            'before': listold + '<br>',
                            'after': listnew + '<br>',
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 10) { //excluir prueba por usuario   
                for (var j = 0; j < data.fields.length; j++) {
                    var oldValue = data.fields[j].oldValue === null ? [] : $filter('filter')(JSON.parse(data.fields[j].oldValue), { selected: 'true' });
                    var newValue = data.fields[j].newValue === null ? [] : JSON.parse(data.fields[j].newValue);
                    var listold = '';
                    var listnew = '';
                    if (oldValue.length !== 0) {
                        for (var m = 0; m < oldValue.length; m++) {
                            listold = listold +
                                '<b>' + $filter('translate')('0098') + ':</b>' +
                                oldValue[m].test.code +
                                '<br>' +
                                '<b>' + $filter('translate')('0118') + ':</b>' +
                                oldValue[m].test.name +
                                '<br><br>';
                        }
                    }
                    if (newValue.length !== 0) {
                        for (var t = 0; t < newValue.length; t++) {
                            listnew = listnew +
                                '<b>' + $filter('translate')('0098') + ':</b>' +
                                newValue[t].test.code +
                                '<br>' +
                                '<b>' + $filter('translate')('0118') + ':</b>' +
                                newValue[t].test.name +
                                '<br><br>';
                        }
                    }
                    var object = {
                        'mastert': ($filter('translate')('0997')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('0001'),
                        'before': oldValue.length === 0 ? '' : oldValue[0].name,
                        'after': newValue.length === 0 ? '' : newValue[0].name,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                    var object = {
                        'mastert': ($filter('translate')('0997')).toUpperCase(),
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
        }
    }
})();
/* jshint ignore:end */



