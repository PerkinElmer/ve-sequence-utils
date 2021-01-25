const getAminoAcidStringFromSequenceString = require("./getAminoAcidStringFromSequenceString");
const assert = require("assert");

describe("getAminoAcidStringFromSequenceString", function() {
  it("computes a aa string from dna", function() {
    assert.equal("M", getAminoAcidStringFromSequenceString("atg"));
    assert.equal("MM", getAminoAcidStringFromSequenceString("atgatg"));
    assert.equal("MXM", getAminoAcidStringFromSequenceString("atgxxxatg"));
    assert.equal("M.M", getAminoAcidStringFromSequenceString("atg...atg"));
    assert.equal("M*M", getAminoAcidStringFromSequenceString("atgtrratg"));
    assert.equal("M*M", getAminoAcidStringFromSequenceString("atgtaaatg"));
    assert.equal("MB", getAminoAcidStringFromSequenceString("atgray"));
    assert.equal("MX", getAminoAcidStringFromSequenceString("atgrRr"));
    assert.equal("MM", getAminoAcidStringFromSequenceString("atgatg"));
    assert.equal("M--", getAminoAcidStringFromSequenceString("atg------"));
    assert.equal("", getAminoAcidStringFromSequenceString("at"));
  });
});
