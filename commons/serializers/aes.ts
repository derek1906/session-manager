import { DeserializationError } from './deserializationError';
import { PLAIN_SERIALIZER } from './plain';
import * as CryptoJS from 'crypto-js';

export const AES_SERIALIZER: Serializer = {
    serialize(
        data: any,
        parameters: SerializerParameters
    ): string {
        const serializedString = PLAIN_SERIALIZER.serialize(data, parameters);

        return CryptoJS.AES.encrypt(
            serializedString,
            parameters["key"]
        ).toString();
    },
    deserialize(
        input: string,
        parameters: SerializerParameters
    ): any {
        let decryptedString: string;
        try {
            decryptedString = CryptoJS.AES.decrypt(
                input,
                parameters["key"]
            ).toString(CryptoJS.enc.Utf8);
        } catch (err) {
            throw new DeserializationError(err);
        }

        return PLAIN_SERIALIZER.deserialize(decryptedString, parameters);
    }
};
