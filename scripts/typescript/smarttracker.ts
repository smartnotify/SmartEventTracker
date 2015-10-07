enum Alert {
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}

interface FailureInterface {
    content: string;
    title: string;
}

class Failure implements FailureInterface {
    title: string;
    content: string;

    constructor(title: string, content: string) {
        this.title = title;
        this.content = content;
    }
}

class FakeFailure implements FailureInterface {
    title: string;
    content: string;

    constructor(title: string, content: string) {
        this.title = title;
        this.content = content;
    }

    getContent() {
        return this.title + ' & ' + this.content;
    }
}

class SmartTracker {
    severity: Alert;
    failure: FailureInterface;

    constructor(failure: FailureInterface, severity: Alert) {
        this.failure = failure;
        this.severity = severity;
    }

    getTrackedEvent() {
            return true;
    }
}
