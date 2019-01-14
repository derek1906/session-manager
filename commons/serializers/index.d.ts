interface SerializerParameters {
    [key: string]: any;
}

interface Serializer {
    serialize(
        data: any,
        parameters: SerializerParameters
    ): string;
    deserialize(
        input: string,
        parameters: SerializerParameters
    ): any;
}
