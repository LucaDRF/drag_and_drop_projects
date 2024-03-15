export interface ProjectInterface {
    id: number,
    title: string,
    people: number,
    description: string,
    status: 'active' | 'finished'
}

export interface ProjectInputs {
    title: HTMLInputElement,
    description: HTMLInputElement,
    people: HTMLInputElement
}

export interface ProjectsList {
    projects: Project[]
};

export class Project implements ProjectInterface {
    constructor(
        public id: number,
        public title: string,
        public people: number,
        public description: string,
        public status: 'active' | 'finished') {
    }
}
