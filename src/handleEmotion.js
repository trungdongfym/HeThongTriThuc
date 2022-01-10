const fs = require('fs');

function getModel() {
    const dataString = fs.readFileSync('./model.json', { encoding: 'utf8', flag: 'r' });
    console.log(dataString);
    return JSON.parse(dataString);
}

function calculateProb(brand, dataset, model) {
    let prob = 1;
    Object.keys(dataset).forEach(key => {
        let tmp = model[key][brand][dataset[key]] || 0;
        prob *= (tmp / model['emotion'][brand]);
        if (prob === 0) return prob;
    });
    prob *= (model['emotion'][brand] / model['emotion']['total']);
    return prob;
}

function bayes(dataset) {
    const model = getModel();
    const probHappy = calculateProb('happy', dataset, model);
    const probSurprise = calculateProb('surprise', dataset, model);
    const probSad = calculateProb('sad', dataset, model);
    const probDisgust = calculateProb('disgust', dataset, model);
    const probAngry = calculateProb('angry', dataset, model);
    const probScare = calculateProb('scare', dataset, model);
    const probNormal = calculateProb('normal', dataset, model);
    const emotionEnum = {
        'happy': probHappy,
        'surprise': probSurprise,
        'sad': probSad,
        'disgust': probDisgust,
        'angry': probAngry,
        'scare': probScare,
        'normal': probNormal
    };

    const arrValues = Object.values(emotionEnum);
    const arrKeys = Object.keys(emotionEnum);
    const max = Math.max(...arrValues);

    const result = arrKeys.find(key => emotionEnum[key] === max);
    console.log(emotionEnum);
    return result;
}

const testHappy = {
    eyebrow: 'normal',
    eyelid: 'normal',
    cheek: 'AU6',
    nose: 'normal',
    lip: 'AU12',
    jaw: 'normal',
    mouth: 'normal'
}
// AU4,AU5,normal,normal,AU23,AU17,normal
const testAngry = {
    eyebrow: 'AU4',
    eyelid: 'AU5',
    cheek: 'normal',
    nose: 'normal',
    lip: 'AU23',
    jaw: 'AU17',
    mouth: 'normal'
}
//AU1+2,AU5,normal,normal,normal,normal,AU26
const testSurprise = {
    eyebrow: 'AU1+2',
    eyelid: 'AU5',
    cheek: 'normal',
    nose: 'normal',
    lip: 'normal',
    jaw: 'normal',
    mouth: 'AU26'
}

// console.log(bayes(testSurprise));
// getModel();

module.exports = bayes;