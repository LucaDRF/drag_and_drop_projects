import ProjectState from "./states/project.js";
import Sections from "./components/project-section.js";
import ProjectForm from "./components/project-form.js";

const projects = new ProjectState();
const sections = new Sections(projects);

new ProjectForm(projects, sections);
