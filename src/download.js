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