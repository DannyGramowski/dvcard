import { Disability } from "./disability";
import { Testimonial } from "./testimonial";

export interface Profile {
    name: string,
    disabilities: Disability[],
    testimonials: Testimonial[]
}