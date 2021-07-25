const fs = require('fs');

let data = fs.readFileSync('../vaccinations.source', {encoding:'utf8', flag:'r'});

data = data.replace(/"vaccination-id":/g,'"id":');
data = data.replace(/"sourceBottle":/g,'"bottle":');
data = data.replace(/"vaccinationDate":/g,'"date":');
let data_array = data.split(/\n/);
data_array = data_array.filter( item => item.length > 0);
let joined_data = data_array.join(",");
let final_data = (' let vaccinations = [' + joined_data + '];\n\nmodule.exports = vaccinations;');

console.log(final_data);

