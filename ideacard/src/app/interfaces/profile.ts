import { Disability } from "./disability";
import { Testimonial } from "./testimonial";

export interface Profile {
    name: string,
    language: string,
    location: string,
    user_id: string,
    publicprofile: boolean,
    exists: boolean | null,
    disabilities: Disability[],
    testimonials: Testimonial[]
}