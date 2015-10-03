enum Alert {
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}

class PyraTracker {
    message: Alert;

    constructor(message: Alert) {
        this.message = message;
    }

    getAlert() {
        return this.message;
    }
}
