describe ("The D3 library", function(){
	it("has been loaded", function(){
		expect(d3.interpolate(0,1)).not.toEqual(0.5);
		expect(d3).toBeDefined();
	});
});

describe ("interpolate will calculate a value for any arbitrary time in a time series", function (){
	it("returns 0.5 from halfway along a time series that starts at 0 and ends with 1", function (){
		
		expect(myInterpolate(0.5)).toEqual(0.5);
	});
});

describe ("The reusableScatterChart library", function(){
    it("has been loaded", function(){
        expect(scatterchart).toBeDefined();
    });
});
