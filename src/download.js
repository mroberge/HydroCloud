/**
 * Created by Marty on 6/9/2017.
 */

function downloadCSV(options) {
    if (options === undefined || options === null) options = {};
    var csv, data, filename, link;

    csv = options.csv;

    if (csv == null) return;

    filename = options.filename || 'export.csv';

    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

function downloadJSON(options) {
    if (options === undefined || options === null) options = {};
    var json, data, filename, link;

    json = options.json;

    if (json == null) return;

    filename = options.filename || 'export.json';

    data = encodeURI(json);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

function download(options) {
    if (options === undefined || options === null) options = {};
    var json, data, filename, link;

    if (json == null) {
        //post error message
        return;
    }
    filename = options.filename || 'export.' + type;

    if (type == 'csv') {
        //csv = parseJson2Csv(json);
        data = encodeURI(csv);
    } else if (type == 'json') {
        data = JSON.stringify(json);
    }

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}