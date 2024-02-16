import { Injectable } from '@angular/core';
import { Category } from '../interfaces/category';
import { Disability } from '../interfaces/disability';
import { Symptom } from '../interfaces/symptom';
import { Accommodation } from '../interfaces/accommodation';

@Injectable({
  providedIn: 'root'
})
export class DisabilityInfoService {
  accommodations: Accommodation[] = [
    {id: 0, name: 'Accessible facility (Ramps, parking etc.)', description: ''}
  ]
  symptoms: Symptom[] = [
    {id: 0, name: 'Fatigue / Weakness', description: 'Individuals may experience decreased stamina or fatigue, making it challenging to perform physically demanding tasks or tolerate extended work hours.', accommodations: [this.accommodations[0]]},
  ];
  disabilities: Disability[] = [
    {id: 0, name: 'Human Immunodeficiency Virus (HIV)', description: 'HIV (Human Immunodeficiency Virus), the virus that causes AIDS, is a life-long disease that compromises the body’s immune system, making it difficult to fight-off illnesses and other diseases. HIV infection leads to AIDS (Acquired Immunodeficiency Syndrome) when the CD4 cells, also known as T Cells, of the immune system are destroyed to the point where the body cannot fight off infections and diseases. AIDS in the final stage of HIV infection. Due to improved treatment, many individuals with HIV continue to work without needing any accommodations.', extrainfo: '', symptoms: [this.symptoms[0], this.symptoms[0], this.symptoms[0], this.symptoms[0]], accommodations: []},
    {id: 1, name: 'Alcoholism', description: 'Alcoholism, also called “alcohol dependence,” is a disease that includes four symptoms: craving (a strong need, or compulsion, to drink), loss of control (the inability to limit one’s drinking on any given occasion), physical dependence (withdrawal symptoms, such as nausea, sweating, shakiness, and anxiety, occur when alcohol use is stopped after a period of heavy drinking), and tolerance (the need to drink greater amounts of alcohol in order to “get high”). Alcoholism treatment works for many people, but just like any chronic disease, there are varying levels of success when it comes to treatment. Alcoholism treatment programs use both counseling and medications to help a person stop drinking.', extrainfo: '', symptoms: [], accommodations: []}
  ]
  categories: Category[] = [{id: 0, name: 'AIDS / HIV', disabilities: [this.disabilities[0]]}, {id: 1, name: 'ADDICTION', disabilities: []}, {id: 2, name: 'ALLERGIES', disabilities: []}, {id: 3, name: 'AMPUTATION', disabilities: []}, {id: 4, name: 'ANXIETY / PANIC DISORDER', disabilities: []}, {id: 5, name: 'ADD / ADHD', disabilities: []}, {id: 6, name: 'BLOOD DISORDERS', disabilities: []}, {id: 7, name: 'BODY SIZE', disabilities: []}, {id: 8, name: 'BRAIN INJURY', disabilities: []}, {id: 9, name: 'CONGENITAL', disabilities: []}, {id: 10, name: 'COVID-19 RELATED', disabilities: []}, {id: 11, name: 'GASTROINTESTINAL DISORDERS', disabilities: []}, {id: 12, name: 'HEADACHES', disabilities: []}, {id: 13, name: 'HEARING IMPAIRMENT', disabilities: []}, {id: 14, name: 'HEART CONDITION', disabilities: []}, {id: 15, name: 'HEIGHT', disabilities: []}, {id: 16, name: 'INTELLECTUAL IMPAIRMENT', disabilities: []}, {id: 17, name: 'LEARNING DISABILITY', disabilities: []}, {id: 18, name: 'MENTAL HEALTH CONDITIONS', disabilities: []}, {id: 19, name: 'PALSY', disabilities: []}, {id: 20, name: 'PARALYSIS', disabilities: []}, {id: 21, name: 'SPEECH IMPAIRMENT', disabilities: []}, {id: 22, name: 'VISION IMPAIRMENT', disabilities: []}, {id: 23, name: 'WEIGHT', disabilities: []}];



  constructor() { }

  getCategories() {
    return this.categories;
  }

  getDisabilities() {
    return this.disabilities;
  }
}
