export type BoardObject = {
    id: string;
    type: 'rectangle' | 'circle' | 'text';
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    color?: string;
};
