/**
 * Created by Marty on 6/9/2017.
 */

function downloadCSV(args) {
    var csv, data, filename, link;

    csv = args.csv;

    if (csv == null) return;

    filename = args.filename || 'export.csv';

    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}