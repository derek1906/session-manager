import { Injectable } from '@angular/core';
import { PLAIN_SERIALIZER } from 'commons/serializers/plain';
import { AES_SERIALIZER } from 'commons/serializers/aes';

export enum SerializationMethod {
    PLAIN = 0,
    AES
}

interface DataSerializationMeta {
    method: SerializationMethod;
    data: string;
}

const SERIALZERS: Map<SerializationMethod, Serializer> = new Map([
    [SerializationMethod.PLAIN, PLAIN_SERIALIZER],
    [SerializationMethod.AES, AES_SERIALIZER]
]);

@Injectable({
    providedIn: "root"
})
export class DataSerializerService {
    private _getSerializer(method: SerializationMethod) {
        if (!SERIALZERS.has(method)) {
            throw new TypeError(`Unknown serialization method "${method}"`);
        }

        return SERIALZERS.get(method);
    }

    serialize(
        data: any,
        serializationMethod: SerializationMethod,
        parameters: SerializerParameters
    ): string {
        const serializer = this._getSerializer(serializationMethod);
        const serializedData = serializer.serialize(data, parameters);

        return JSON.stringify({
            method: serializationMethod,
            data: serializedData
        } as DataSerializationMeta);
    }

    deserialize(
        serializedData: string,
        parameters: SerializerParameters
    ): any {
        const { method, data } = JSON.parse(serializedData) as DataSerializationMeta;
        const serializer = this._getSerializer(method);
        const deserializedData = serializer.deserialize(data, parameters);

        return deserializedData;
    }
}
