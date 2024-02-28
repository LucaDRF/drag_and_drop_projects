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

    addProject(project: ProjectForm) {
        this.projects.push(project);
        this.addProjectOnPage(project);

        this.lastId = this.projects.length;
        
        project.clearForm();
    }
    
    addProjectOnPage({ id, title, people, description, status}: Project) {
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

    get getProjects() {
        return this.projects;
    }
}

class ProjectForm implements Project{
    title: string;
    people: number;
    description: string;
    status: 'active' | 'finished';

    constructor(public id: number) {
        const project = this.getDataFromInputs(id);

        this.validateForm(project);

        this.title = project.title;
        this.people = project.people;
        this.description = project.description;
        this.status = project.status;
    }

    getDataFromInputs(id: number): Project {
        const { title, description, people } = this.getInputs();

        return {
            id,
            title: title.value,
            people: +people.value,
            description: description.value,
            status: 'active'
        };
    }

    validateForm({ title, description, people }: Project) {
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

    getInputs(): ProjectInputs {
        return {
            title: document.querySelector('#title')! as HTMLInputElement,
            description: document.querySelector('#description')! as HTMLInputElement,
            people: document.querySelector('#people')! as HTMLInputElement
        }
    }

    clearForm() {
        const { title, description, people } = this.getInputs();

        title.value = '';
        description.value = '';
        people.value = '';
    }
}

class Main {
   private projects = new Projects();

    submitForm(event: InputEvent): void {
        event.preventDefault()
    
        const project = new ProjectForm(this.projects.lastId + 1);
    
        this.projects.addProject(project);
        console.log(this.projects.getProjects);
    }

    dragStart(event: DragEvent) {
        event.dataTransfer!.setData('Text', (event.target! as HTMLElement).id);
    }

    allowDrop(event: DragEvent) {
        event.preventDefault();
    }

    drop(event: DragEvent) {
        let target: HTMLElement = (event.target! as HTMLElement);

        if (target.localName !== 'ul') {
            while(target.localName !== 'ul') {
                target = target.parentElement!;
            }
        }

        event.preventDefault();
        
        const projectId = event.dataTransfer!.getData('Text');
        const projectIdSplitted = projectId.split('-')!;
        const projectNewStatus = target.id === 'finished-projects-list' ? 'finished' : 'active';
        
        target.appendChild(document.getElementById(projectId)!);

        this.projects.updateStatusById(+projectIdSplitted[1], projectNewStatus);
        console.log(this.projects.getProjects);
    }
}

const main = new Main();
