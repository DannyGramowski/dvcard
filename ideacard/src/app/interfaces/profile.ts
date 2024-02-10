import { Disability } from "./disability";
import { Testimonial } from "./testimonial";

export interface Profile {
    name: string,
    language: string,
    location: string,
    uuid: string,
    publicprofile: boolean,
    disabilities: Disability[],
    testimonials: Testimonial[]
}