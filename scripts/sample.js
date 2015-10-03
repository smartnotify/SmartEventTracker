var failure = new  FakeFailure('title', 'content');
var smartTrack = new  SmartTracker(failure, Alert.Critical);

// This alert is there the time to find out
// how to unit test with TypeScript
alert(smartTrack.getTrackedEvent());
