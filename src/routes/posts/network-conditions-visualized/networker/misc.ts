export type Position = {
    x: number;
    y: number;
};

export function getEnumValues(enumType: Record<string | number, string | number>): number[] {
    let values: number[] = [];
    for (let key of Object.keys(enumType)) {
        
        let parsed = parseInt(key);
        if (!Number.isNaN(parsed)) {
            values.push(parsed);
        }
    }
    return values;
}
