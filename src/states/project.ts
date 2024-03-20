import { ProjectsList, Project, ProjectInterface } from "../models/project";

export default class ProjectState implements ProjectsList {
    lastId: number = 0;
    readonly projects: Project[] = [];

    constructor() {}

    get getProjects() {
        return this.projects;
    }

    pushProject(project: ProjectInterface) {
        this.projects.push(project);

        this.lastId = this.projects.length;
    }
    
    updateStatusById(id: number, newStatus: 'active' | 'finished') {
        const project = this.projects.find(project => project.id === id)!;

        project.status = newStatus;
    }
}
