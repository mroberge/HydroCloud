// spec sheet for dataReq.js

describe("The dataReq.js file", function() {
  it("contains an option-list reading function named dataReq()", function() {
    expect(dataReq).toBeDefined();
    expect(dataReq).toEqual(jasmine.any(Function));
  });
});