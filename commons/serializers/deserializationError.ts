export class DeserializationError extends Error {
    name = "DeserializationError";
    message = "Unable to deserialize message with the given parameters. Originated error: ";
    originalError: Error;

    constructor(originalError: Error) {
        super();
        this.message += originalError.toString();
        this.originalError = originalError;
    }
}
