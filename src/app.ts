import ProjectState from "./states/project";
import Sections from "./components/project-section";
import ProjectForm from "./components/project-form";

const projects = new ProjectState();
const sections = new Sections(projects);

new ProjectForm(projects, sections);
