describe("PubSub", function() {
    var pubsub;

    beforeEach(function() {
        pubsub = UnitySpace.PubSub;
    });

    it("should be able publish channel", function() {
        expect(pubsub.publish('/test/channel1', true)).toBeFalsy();
    });

    it("should be able publish data to channel", function() {
        var result = false;
        pubsub.subscribe('/test/channel1', function(value) {
            result = value;
        });
        expect(pubsub.publish('/test/channel1', true)).toBeTruthy();
        expect(result).toBeTruthy();
    });

    it("should be global listen", function() {
        var result = false;
        pubsub.subscribe('*', function(value) {
            result = value;
        });
        expect(pubsub.publish('/test/channel1', true)).toBeTruthy();
        expect(result).toBeTruthy();
    });

});