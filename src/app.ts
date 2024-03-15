import ProjectState from "./states/project.js";
import Sections from "./components/sections/project.js";
import ProjectForm from "./components/forms/project.js";

const projects = new ProjectState();
const sections = new Sections(projects);
// need to add event listener instead of using onclick since the type is module
new ProjectForm(projects, sections);
