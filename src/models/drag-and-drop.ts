
export default abstract class DragAndDrop {
    constructor() {
    }

    abstract updateProject(id: number, newStatus: string): void;

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

        this.updateProject(+projectIdSplitted[1], projectNewStatus);
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
