import ProjectState from "../../states/project.js";
import { Project, ProjectInterface } from "../../models/project.js";
import Sections from "../sections/project.js";


export default class ProjectForm {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement

    constructor(private projects: ProjectState, private sections: Sections) {
        this.titleInput = document.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = document.querySelector('#description')! as HTMLInputElement;
        this.peopleInput = document.querySelector('#people')! as HTMLInputElement;
    }

    submitForm(event: InputEvent): void {
        console.log('aa');
        
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
