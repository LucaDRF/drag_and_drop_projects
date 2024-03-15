import ProjectState from "../../states/project.js";
import { Project } from "../../models/project.js";

export default class Sections {
    constructor(private projects: ProjectState) {
    }

    dragStart(event: DragEvent) {
        event.dataTransfer!.setData('Text', (event.target! as HTMLElement).id);
    }

    allowDrop(event: DragEvent) {
        event.preventDefault();
    }

    drop(event: DragEvent) {
        event.preventDefault();

        const hostElement = this.getHostElement(event);
        const projectId = event.dataTransfer!.getData('Text');
        const draggedElement = document.getElementById(projectId)!;
        const projectNewStatus = hostElement.id === 'finished-projects-list' ? 'finished' : 'active';
        
        hostElement.appendChild(draggedElement);
        
        const projectIdSplitted = projectId.split('-')!;

        this.projects.updateStatusById(+projectIdSplitted[1], projectNewStatus);
        console.log(this.projects);
        
    }

    public addProject({ id, title, people, description, status}: Project) {
        const projectsListElement = document.querySelector(`#${status}-projects-list`)! as HTMLElement;

        projectsListElement.innerHTML += `
        <li id="project-${id}" ondragstart="sections.dragStart(event)" draggable="true">
            <h2>${title}</h2>
            <h3>${people} persons assigned</h3>
            <p>${description}</p>
        </li>
        `;
    }

    private getHostElement(event: DragEvent) {
        let target: HTMLElement = (event.target! as HTMLElement);

        if (target.localName !== 'ul') {
            while(target.localName !== 'ul') {
                target = target.parentElement!;
            }
        }

        return target;
    }
}