import ProjectState from "../states/project.js";
import { Project } from "../models/project.js";
import DragAndDrop from "../models/drag-and-drop.js";

export default class Sections extends DragAndDrop {
    constructor(private projects: ProjectState) {
        super();
        this.configure();
    }

    private configure() {
        const activeProjectsList = document.getElementById('active-projects-list')!;
        const finishedProjectsList = document.getElementById('finished-projects-list')!;
        const lists = [activeProjectsList, finishedProjectsList];

        lists.forEach(list => {
            list.addEventListener('drop', this.drop.bind(this));
            list.addEventListener('dragover', this.allowDrop.bind(this));
        });
    }

    private setEventListenerOnProject(id: string) {
        const project = document.getElementById(id)!;

        project.addEventListener('dragstart', this.dragStart.bind(this));
    }

    public addProject({ id, title, people, description, status}: Project) {
        const projectsListElement = document.querySelector(`#${status}-projects-list`)! as HTMLElement;

        projectsListElement.insertAdjacentHTML('afterbegin', `
        <li id="project-${id}" draggable="true">
            <h2>${title}</h2>
            <h3>${people} persons assigned</h3>
            <p>${description}</p>
        </li>
        `);

        this.setEventListenerOnProject(`project-${id}`);
    }

    updateProject(id: number, newStatus: 'active' | 'finished') {
        this.projects.updateStatusById(id, newStatus);
    }
}