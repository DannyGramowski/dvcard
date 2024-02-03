import { Accommodation } from "./accommodation";
import { Symptom } from "./symptom";

export interface Disability {
    id: string,
    name: string,
    description: string,
    notes: string,
    symptoms: Symptom[],
    accommodations: Accommodation[],
}
