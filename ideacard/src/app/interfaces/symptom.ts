import { Accommodation } from "./accommodation";

export interface Symptom {
    id: number,
    name: string,
    description: string,
    accommodations: Accommodation[]
}
