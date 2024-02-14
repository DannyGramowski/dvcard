import { Disability } from "./disability";

export interface Category {
    id: number,
    name: string,
    disabilities: Disability[]
}