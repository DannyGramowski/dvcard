import { Accommodation } from "./accommodation";
import { Symptom } from "./symptom";

export interface Disability {
    id: string,
    name: string,
    description: string,
    symptoms: Symptom[],
    accommodations: Accommodation[]
}
