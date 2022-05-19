const chai = require("chai");
chai.should();
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);
const getReverseSequenceString = require("./getReverseSequenceString");
describe("getReverseSequenceAndAnnotations", function() {
  it("handles a range option correctly and reverse complements a subset of the sequence across the origin ", function() {
    const newSeq = getReverseSequenceString("uuuucccttt");
    newSeq.should.eq("tttcccuuuu");
  });
});
