interface ProjectInterface {
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

    pushProject(project: ProjectInterface) {
        this.projects.push(project);

        this.lastId = this.projects.length;
    }
    
    updateStatusById(id: number, newStatus: 'active' | 'finished') {
        const project = this.projects.find(project => project.id === id)!;

        project.status = newStatus;
    }
}

class Project implements ProjectInterface {
    constructor(
        public id: number,
        public title: string,
        public people: number,
        public description: string,
        public status: 'active' | 'finished') {
    }
}

class ProjectForm {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement

    constructor(private projects: Projects, private sections: Sections) {
        this.titleInput = document.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = document.querySelector('#description')! as HTMLInputElement;
        this.peopleInput = document.querySelector('#people')! as HTMLInputElement;
    }

    submitForm(event: InputEvent): void {
        event.preventDefault()

        const { id, title, people, description, status } = this.formData;

        this.validateForm(title, people, description);
    
        const project = new Project(id, title, people, description, status);
    
        this.projects.pushProject(project);
        this.sections.addProject(project);

        this.clearForm();
    }

    get formData(): ProjectInterface {
        const { titleInput, descriptionInput, peopleInput } = this;

        return {
            id: this.projects.lastId + 1,
            title: titleInput.value.trim(),
            people: +peopleInput.value.trim(),
            description: descriptionInput.value.trim(),
            status: 'active'
        }
    }

    private validateForm(title: string, people: number, description: string) {
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

class Sections {
    constructor(private projects: Projects) {
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

const projects = new Projects();
const sections = new Sections(projects);
const projectForm = new ProjectForm(projects, sections);
