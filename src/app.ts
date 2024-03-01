interface Project {
    id: number,
    title: string,
    people: number,
    description: string,
    status: 'active' | 'finished'
}

interface ProjectInputs {
    title: HTMLInputElement,
    description: HTMLInputElement,
    people: HTMLInputElement
}

interface ProjectsList {
    projects: Project[]
};

class Projects implements ProjectsList {
    lastId: number = 0;
    readonly projects: Project[] = [];

    constructor() {}

    get getProjects() {
        return this.projects;
    }

    addProject(project: Project) {
        this.projects.push(project);
        this.addProjectOnPage(project);

        this.lastId = this.projects.length;
    }
    
    private addProjectOnPage({ id, title, people, description, status}: Project) {
        const projectsListElement = document.querySelector(`#${status}-projects-list`)! as HTMLElement;

        projectsListElement.innerHTML += `
        <li id="project-${id}" ondragstart="main.dragStart(event)" draggable="true">
            <h2>${title}</h2>
            <h3>${people} persons assigned</h3>
            <p>${description}</p>
        </li>
        `;
    }
    
    updateStatusById(id: number, newStatus: 'active' | 'finished') {
        const project = this.projects.find(project => project.id === id)!;

        project.status = newStatus;
    }
}

class ProjectForm {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement

    constructor(public id: number) {
        this.titleInput = document.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = document.querySelector('#description')! as HTMLInputElement;
        this.peopleInput = document.querySelector('#people')! as HTMLInputElement;

        const project = this.mountProjectData(id);

        this.validateForm(project);
    }

    get getProject() {
        return this.mountProjectData(this.id);
    }

    private mountProjectData(id: number): Project {
        const { titleInput, descriptionInput, peopleInput } = this;

        return {
            id,
            title: titleInput.value.trim(),
            people: +peopleInput.value.trim(),
            description: descriptionInput.value.trim(),
            status: 'active'
        };
    }

    private validateForm({ title, description, people }: Project) {
        let errorMessage: string | undefined;
    
        if (!title) {
            errorMessage = 'Need a title';
        } else if (!description) {
            errorMessage = 'Need a description';
        } else if (!people || people < 0) {
            errorMessage = 'Need at least one person';
        }
    
        if (!errorMessage) {
            return;
        }
    
        alert(errorMessage);
        throw new Error(errorMessage);
    }

    clearForm() {
        const { titleInput, descriptionInput, peopleInput } = this;

        titleInput.value = '';
        descriptionInput.value = '';
        peopleInput.value = '';
    }
}

class Main {
   private projects = new Projects();

    submitForm(event: InputEvent): void {
        event.preventDefault()
    
        const project = new ProjectForm(this.projects.lastId + 1);
    
        this.projects.addProject(project.getProject);

        project.clearForm();
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

const main = new Main();
