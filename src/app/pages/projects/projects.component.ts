import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  imports: [CommonModule]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  loading = false;
  error: string | null = null;
  selectedProject: Project | null = null;
  selectedSectorId: number | null = null;
  uniqueSectors: { id: number; title: string }[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;
    
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = data;
        this.extractUniqueSectors();
        this.loading = false;
        console.log('Projects loaded:', this.projects);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.error = 'Failed to load projects. Please check your connection and try again.';
        this.loading = false;
        
       
      }
    });
  }

  private extractUniqueSectors(): void {
    const sectorMap = new Map<number, string>();
    this.projects.forEach(project => {
      if (project.sector && !sectorMap.has(project.sector.id)) {
        sectorMap.set(project.sector.id, project.sector.title);
      }
    });
    
    this.uniqueSectors = Array.from(sectorMap.entries()).map(([id, title]) => ({
      id,
      title
    }));
  }

  filterBySector(sectorId: number | null): void {
    this.selectedSectorId = sectorId;
    
    if (sectorId === null) {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(
        project => project.sector?.id === sectorId
      );
    }
  }

  getSectorIcon(sectorTitle: string): string {
    const iconMap: { [key: string]: string } = {
      'Water Infrastructure': 'fa-solid fa-droplet',
      'Smart Traffic Systems': 'fa-solid fa-traffic-light',
      'Electrical Networks': 'fa-solid fa-bolt',
      'Drainage Systems': 'fa-solid fa-water',
      'Renewable Energy': 'fa-solid fa-solar-panel',
      'Construction Projects': 'fa-solid fa-hard-hat'
    };
    return iconMap[sectorTitle] || 'fa-solid fa-cube';
  }

  openProjectModal(project: Project): void {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }

  
}