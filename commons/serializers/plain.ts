import { DeserializationError } from "./deserializationError";

export const PLAIN_SERIALIZER: Serializer = {
    serialize(data: any): string {
        return JSON.stringify(data);
    },
    deserialize(input: string): any {
        try {
            return JSON.parse(input);
        } catch (err) {
            throw new DeserializationError(err);
        }
    }
};
