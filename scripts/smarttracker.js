var Alert;
(function (Alert) {
    Alert[Alert["Low"] = 0] = "Low";
    Alert[Alert["Medium"] = 1] = "Medium";
    Alert[Alert["High"] = 2] = "High";
    Alert[Alert["Critical"] = 3] = "Critical";
})(Alert || (Alert = {}));
var Failure = (function () {
    function Failure(title, content) {
        this.title = title;
        this.content = content;
    }
    return Failure;
})();
var FakeFailure = (function () {
    function FakeFailure(title, content) {
        this.title = title;
        this.content = content;
    }
    FakeFailure.prototype.getContent = function () {
        return this.title + ' & ' + this.content;
    };
    return FakeFailure;
})();
var SmartTracker = (function () {
    function SmartTracker(failure, severity) {
        this.failure = failure;
        this.severity = severity;
    }
    SmartTracker.prototype.getTrackedEvent = function () {
        return true;
    };
    return SmartTracker;
})();
