const fs = require('fs');

const data_1 = fs.readFileSync('../Zerpfy.source', {encoding:'utf8', flag:'r'});
const data_2 = fs.readFileSync('../Antiqua.source', {encoding:'utf8', flag:'r'});
const data_3 = fs.readFileSync('../SolarBuddhica.source', {encoding:'utf8', flag:'r'});

let data = data_1 + data_2 + data_3;

data = data.replace(/"orderNumber":/g,'"order_number":');
data = data.replace(/"responsiblePerson":/g,'"responsible_person":');
data = data.replace(/"healthCareDistrict":/g,'"healthcare_district":');
let data_array = data.split(/\n/);
data_array = data_array.filter( item => item.length > 0);
let joined_data = data_array.join(",");
let final_data = (' let bottles = [' + joined_data + '];\n\nmodule.exports = bottles;');

console.log(final_data);

