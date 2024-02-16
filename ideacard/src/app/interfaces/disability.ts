import { Accommodation } from "./accommodation";
import { Symptom } from "./symptom";

export interface Disability {
    id: number,
    name: string,
    description: string,
    extrainfo: string,
    symptoms: Symptom[],
    accommodations: Accommodation[]
}
