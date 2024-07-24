export enum ShapeType {
    RECTANGLE
};
export type StaticRectangleShape = {
    type: ShapeType.RECTANGLE;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number
};
export type StaticShape = StaticRectangleShape;
