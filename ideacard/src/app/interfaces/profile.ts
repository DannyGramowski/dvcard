import { Disability } from "./disability";
import { Testimonial } from "./testimonial";

export interface Profile {
    name: string,
    exists: boolean | undefined,
    disabilities: Disability[],
    testimonials: Testimonial[]
}