const fs = require('fs');

function getData() {
    let res = [];
    let data = fs.readFileSync('Dataset_tt.csv', { encoding: 'utf8', flag: 'r' });
    let index = data.indexOf('\n');
    let remain = data;
    while (index > -1) {
        let tmp = remain.substring(0, index - 1);
        res.push(tmp);
        remain = remain.substring(index + 1);
        index = remain.indexOf('\n');
    }
    return res;
}

function statData(data) {
    let res = {};
    const headers = data[0].split(',');
    for (let k = 0; k < headers.length; k++) {
        res[headers[k]] = {};
        for (let i = 1; i < data.length; i++) {
            let dataset = data[i].split(',');
            if (!res[headers[k]][dataset[dataset.length - 1]]) {
                res[headers[k]][dataset[dataset.length - 1]] = k < headers.length - 1 ? {} : 0;
            }
            if (k < headers.length - 1 && !res[headers[k]][dataset[dataset.length - 1]][dataset[k]]) {
                res[headers[k]][dataset[dataset.length - 1]][dataset[k]] = 0;
            }
            if (k < headers.length - 1)
                res[headers[k]][dataset[dataset.length - 1]][dataset[k]]++;
            else res[headers[k]][dataset[dataset.length - 1]]++;
        }
    }
    res[headers[headers.length - 1]].total = data.length - 1;
    return res;
}

function createData() {
    const data = getData();
    const headers = data[0].split(',');
    const handleData = {};
    for (const header of headers) {
        handleData[header] = new Set();
    }
    
    for (let i = 1; i < data.length; i++) {
        const aus = data[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            handleData[headers[j]].add(aus[j]);
        }
    }

    for (const header of headers) {
        handleData[header] = Array.from(handleData[header]);
    }

    delete handleData.emotion;

    fs.writeFileSync('data.json', JSON.stringify(handleData, null, 4), { encoding: 'utf8', flag: 'w' });
}

function trainModel() {
    const data = getData();
    fs.writeFileSync('model.json', JSON.stringify(statData(data), null, 4), { encoding: 'utf8', flag: 'w' });
    // statData(data)
}

createData();
trainModel();