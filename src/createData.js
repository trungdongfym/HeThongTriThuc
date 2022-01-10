const fs = require('fs');

const model = fs.readFileSync('./model.json',{encoding:'utf8',flag:'r'});

function createDataQuestion(){
   const data = JSON.parse(model);
   delete data['emotion'];
   let res = {};
   for(let [key,val] of Object.entries(data)){
      res[key] = res[key]? res[key]:[];
      let setAus = new Set();
      for(let [key1,val1] of Object.entries(val)){
         for(let [key2,val2] of Object.entries(val1)){
            // console.log(key,key2);
            setAus.add(key2);
         }
      }
      // console.log(key,setAus);
      res[key] = [...setAus];
   }
   console.log(res);
}

createDataQuestion();