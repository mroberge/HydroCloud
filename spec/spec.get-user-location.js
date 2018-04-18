/*
describe('fetchPlaylistsData function', function () {
    const video = 'video';

    it('should call fetchData from apiService', function(done) {
        spyOn(apiService, 'fetchData').and.returnValue(Promise.resolve(promisedData));

        playlistsService.fetchPlaylistsData()
            .then((result) => {
                expect(apiService.fetchData).toHaveBeenCalledWith(video);
                expect(result).toEqual(promisedData);
                done();
            });
    });
});
*/
var promisedData = {
    first: 1,
    second: 2,
    third: 3,
};

var mapX = {
    center: true,
    setCenter: function () {
        return true
    }
};

var promisedPosition = {
  coords: {
      latitude: 99,
      longitude: 98,
  }
};

describe("geoSuccess():", function() {
   it("is a function", function() {
       expect(geoSuccess).toBeDefined();
       expect(geoSuccess).toEqual(jasmine.any(Function));
   });
   it("sets startPos to the user's location", function() {
       geoSuccess(promisedPosition);
       expect(startPos.lat).toEqual(99);
       expect(startPos.lng).toEqual(98);
   });
   it("calls map.setCenter with startPos if map.center exists", function() {
       //console.log(map);
       map = {center: true,
            setCenter: function() {return true}
       };
       //console.log(map);
       spyOn(map, "setCenter");
       geoSuccess(promisedPosition);
       expect(map.setCenter).toHaveBeenCalled();
       expect(map.setCenter).toHaveBeenCalledWith(startPos);
   });
});

describe("geoError()", function() {
    it("is a function", function() {
        expect(geoError).toBeDefined();
        expect(geoError).toEqual(jasmine.any(Function));
    });
});

describe("getUserLocation()", function() {
    //console.log("spec.get-user-location loaded.");
    it("is a function", function() {
        expect(getUserLocation).toBeDefined();
        expect(getUserLocation).toEqual(jasmine.any(Function));
    });

    it('should call navigator.geolocation.getCurrentPosition when the geoLocation API is available.', function() {
        //console.log(navigator.geolocation);
        spyOn(navigator.geolocation, 'getCurrentPosition').and.returnValue(promisedPosition);
        //spyOn('geoSuccess'); //can't spy on this because we mocked getCurrentPosition().
        //console.log(navigator.geolocation.getCurrentPosition());
        getUserLocation();
        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        //expect(geoSuccess).toHaveBeenCalled(); //this won't be called because our mock doesn't call it on success.

    });
});