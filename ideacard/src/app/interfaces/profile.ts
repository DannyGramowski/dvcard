import { Disability } from "./disability";
import { Testimonial } from "./testimonial";

export interface Profile {
    name: string,
    exists: boolean | null,
    disabilities: Disability[],
    testimonials: Testimonial[]
}