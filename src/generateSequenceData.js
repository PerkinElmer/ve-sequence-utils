// this is throwing a weird eslint error

// var ac = require('ve-api-check');
const { generateRandomRange } = require("ve-range-utils");
const objectid = require("bson-objectid");

module.exports = function generateSequenceData({ sequenceLength = 1000 } = {}) {
  return {
    // "sequence" : "gtggatgcatgtgtcatggtcat",
    circular: true,
    name: "p-" + Math.floor(Math.random * 100),
    description: "",
    sequence: generateSequence(sequenceLength),
    translations: generateAnnotations(
      5,
      0,
      sequenceLength - 1,
      sequenceLength / 3
    ),
    features: generateAnnotations(
      10,
      0,
      sequenceLength - 1,
      sequenceLength / 3
    ),
    primers: generateAnnotations(10, 0, sequenceLength - 1, 50),
    parts: generateAnnotations(10, 0, sequenceLength - 1, sequenceLength / 3)
  };
};

// export default tidyUpSequenceData(exampleData)

function generateSequence(m = 9) {
  let s = "";
  let r = "gatc";
  for (let i = 0; i < m; i++) {
    s += r.charAt(Math.floor(Math.random() * r.length));
  }
  return s;
}

function generateAnnotations(
  numberOfAnnotationsToGenerate,
  start,
  stop,
  maxLength
) {
  let result = {};
  for (let i = 0; i < numberOfAnnotationsToGenerate; i++) {
    const annotation = generateAnnotation(start, stop, maxLength);
    result[annotation.id] = annotation;
  }
  return result;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateAnnotation(start, stop, maxLength) {
  let range = generateRandomRange(start, stop, maxLength);
  return {
    ...range,
    name: getRandomInt(0, 100000).toString(),
    type: "misc_feature",
    id: objectid().str,
    forward: Math.random() > 0.5,
    notes: {}
  };
}

// tnr: this is used to generate a very large, multi-featured sequence
// var string = "ggggcccccgggggccc";
// var reallyLongFakeSequence = "";
// for (var i = 1; i < 100000; i++) {
//   reallyLongFakeSequence += string;
//   if (i % 100 === 0) {
//     reallyLongFakeSequence += 'taafatg';
//     sequenceData.features.push({
//       id: i,
//       start: parseInt(i * 10),
//       end: parseInt(i * 10 + 100),
//       name: 'cooljim',
//       color: 'green',
//       forward: true,
//       annotationType: "feature"
//     });
//   }
// }
// sequenceData.sequence += reallyLongFakeSequence;
//
// export default function() {
//   var baseSeqData = {
//
//   }
//   function seqGen() {
//
//   }
// }
// "features" : [
//     {
//         "name" : "1",
//         "type" : "misc_feature",
//         "start" : 1,
//         "end" : 1,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'blue'
//     },
//     {
//         "name" : "2",
//         "type" : "misc_feature",
//         "start" : 1,
//         "end" : 1,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'blue'
//     },
//     {
//         "name" : "3",
//         "type" : "misc_feature",
//         "start" : 1,
//         "end" : 1,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'blue'
//     },
//     {
//         "name" : "4",
//         "type" : "misc_feature",
//         "start" : 1,
//         "end" : 14,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'blue'
//     },
//     {
//         "name" : "5",
//         "type" : "misc_feature",
//         "start" : 1,
//         "end" : 1,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'blue'
//     },
//     {
//         "name" : "6",
//         "type" : "misc_feature",
//         "id" : "5590c1978fafgw979df000a4f02c7a",
//         "start" : 4,
//         "end" : 6,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'orange'
//     },
//     {
//         "name" : "housemouserousepouse",
//         "type" : "misc_feature",
//         "id" : "5590c197897fs9df000a4f02c7a",
//         "start" : 4,
//         "end" : 6,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'orange'
//     },
//     {
//         "name" : "housemouserousepouse",
//         "type" : "misc_feature",
//         "id" : "5590c1978979dasdfaf000a4f02c7a",
//         "start" : 4,
//         "end" : 6,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'orange'
//     },
//     {
//         "name" : "housemouserousepouse",
//         "type" : "misc_feature",
//         "id" : "5590c197faas8979df000a4f02c7a",
//         "start" : 4,
//         "end" : 6,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'orange'
//     },
//     {
//         "name" : "housemouserousepouse",
//         "type" : "misc_feature",
//         "id" : "5590c1978979df000a4f02c7aasd",
//         "start" : 4,
//         "end" : 6,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'orange'
//     },
//     {
//         "name" : "house",
//         "type" : "misc_feature",
//         "id" : "5590c1978979df000a4f02c7b",
//         "start" : 70,
//         "end" : 90,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'green'
//     },
//     {
//         "name" : "weer",
//         "type" : "misc_feature",
//         "id" : "5590c1d88979df000a4f02f5c",
//         "start" : 3,
//         "end" : 69,
//         "strand" : 1,
//         "notes" : [],
//         "color": 'red'
//     }
// ],
