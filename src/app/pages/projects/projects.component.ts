import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

// Import Leaflet
import * as L from 'leaflet';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  projectsWithLocation: Project[] = [];
  loading = false;
  error: string | null = null;
  selectedProject: Project | null = null;
  selectedSectorId: number | null = null;
  uniqueSectors: { id: number; title: string }[] = [];
  mapLoading = true;
  mapStyle: 'default' | 'dark' = 'default';

  private mainMap: L.Map | null = null;
  private modalMap: L.Map | null = null;
  private markers: L.Marker[] = [];
  private customIcon: L.DivIcon;

  constructor(private projectService: ProjectService, private ngZone: NgZone) {
    // Create custom icon for markers
    this.customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pin">
               <div class="marker-pulse"></div>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 6 11 6 11s6-5.75 6-11c0-3.87-3.13-7-7-7z" fill="#CA0018" stroke="white" stroke-width="2"/>
                 <circle cx="12" cy="9" r="2" fill="white"/>
               </svg>
             </div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -42]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngAfterViewInit(): void {
    const hostElement = document.querySelector('app-projects') as (HTMLElement & {
      openProjectModalFromMap?: (projectId: number) => void;
    }) | null;

    if (hostElement) {
      hostElement.openProjectModalFromMap = (projectId: number) => {
        this.ngZone.run(() => this.openProjectModalFromMap(projectId));
      };
    }
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;

    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = data;
        this.projectsWithLocation = data.filter(p => p.latitude && p.longitude);
        this.extractUniqueSectors();
        this.loading = false;

        // Initialize map after projects are loaded
        setTimeout(() => {
          this.initMainMap();
        }, 500);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.error = 'Failed to load projects. Please check your connection and try again.';
        this.loading = false;

        // Load mock data for testing
        this.loadMockData();
      }
    });
  }

  private loadMockData(): void {
    this.projects = [
      {
        id: 1,
        title: 'Riyadh Metro Station',
        projectName: 'King Abdullah Financial District Station',
        description: 'State-of-the-art metro station with smart systems integration',
        imageUrl: 'assets/riyadh-metro.jpg',
        latitude: 24.7743,
        longitude: 46.7386,
        locationName: 'Riyadh, KSA',
        projectValue: 450000000,
        sector: { id: 1, title: 'Smart Traffic Systems' },
        canDisplayClientName: true,
        clientName: 'Riyadh Metro Authority',
        startDate: '2020-01-01',
        endDate: '2023-12-31',
        keyAchievements: ['On-time delivery', 'LEED Certified'],
        author: { id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@deeplines.com' }
      },
      {
        id: 2,
        title: 'Jeddah Water Treatment',
        projectName: 'Jeddah Desalination Plant',
        description: 'Advanced water treatment facility serving 2M+ residents',
        imageUrl: 'assets/jeddah-water.jpg',
        latitude: 21.5433,
        longitude: 39.1728,
        locationName: 'Jeddah, KSA',
        projectValue: 780000000,
        sector: { id: 2, title: 'Water Infrastructure' },
        canDisplayClientName: true,
        clientName: 'SWCC',
        startDate: '2019-06-01',
        endDate: '2022-12-31',
        author: { id: 2, name: 'Sarah Al-Mansour', email: 'sarah@deeplines.com' }
      },
      {
        id: 3,
        title: 'Dammam Smart Grid',
        projectName: 'Eastern Province Smart Grid',
        description: 'Smart electrical distribution network',
        imageUrl: 'assets/dammam-grid.jpg',
        latitude: 26.4207,
        longitude: 50.0888,
        locationName: 'Dammam, KSA',
        projectValue: 320000000,
        sector: { id: 3, title: 'Electrical Networks' },
        canDisplayClientName: true,
        clientName: 'SEC',
        startDate: '2021-03-01',
        endDate: '2024-06-30',
        author: { id: 3, name: 'Faisal Al-Otaibi', email: 'faisal@deeplines.com' }
      },
      {
        id: 4,
        title: 'Medina Stormwater',
        projectName: 'Medina Flood Protection',
        description: 'Comprehensive drainage and flood management',
        imageUrl: 'assets/medina-drainage.jpg',
        latitude: 24.5247,
        longitude: 39.5692,
        locationName: 'Medina, KSA',
        projectValue: 180000000,
        sector: { id: 4, title: 'Drainage Systems' },
        canDisplayClientName: false,
        startDate: '2022-01-01',
        endDate: '2024-03-31',
        author: { id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@deeplines.com' }
      },
      {
        id: 5,
        title: 'NEOM Solar Farm',
        projectName: 'NEOM Renewable Energy Phase 1',
        description: 'Large-scale solar energy project',
        imageUrl: 'assets/neom-solar.jpg',
        latitude: 28.0,
        longitude: 35.2,
        locationName: 'NEOM, KSA',
        projectValue: 1200000000,
        sector: { id: 5, title: 'Renewable Energy' },
        canDisplayClientName: true,
        clientName: 'NEOM Energy',
        startDate: '2022-06-01',
        endDate: '2025-12-31',
        author: { id: 2, name: 'Sarah Al-Mansour', email: 'sarah@deeplines.com' }
      }
    ];

    this.filteredProjects = this.projects;
    this.projectsWithLocation = this.projects.filter(p => p.latitude && p.longitude);
    this.extractUniqueSectors();
    this.loading = false;

    setTimeout(() => {
      this.initMainMap();
    }, 500);
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

  getProjectCountBySector(sectorId: number): number {
    return this.filteredProjects.filter(p => p.sector?.id === sectorId).length;
  }

  getTotalProjectValue(): number {
    return this.projects.reduce((sum, p) => sum + (p.projectValue || 0), 0);
  }

  getAverageProjectValue(): number {
    const total = this.getTotalProjectValue();
    const count = this.projects.filter(p => p.projectValue).length;
    return count > 0 ? total / count : 0;
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

    // Update map markers after filter
    this.updateMapMarkers();
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

  private initMainMap(): void {
    const mapElement = document.getElementById('main-projects-map');
    if (!mapElement || this.projectsWithLocation.length === 0) {
      this.mapLoading = false;
      return;
    }

    // Center on Saudi Arabia
    const saudiCenter: [number, number] = [23.8859, 45.0792];

    this.mainMap = L.map('main-projects-map').setView(saudiCenter, 5);

    // Set tile layer based on style
    this.setTileLayer();

    // Add markers for projects with locations
    this.addMarkersToMap();

    // Fit bounds to show all markers
    this.fitMapToBounds();

    this.mapLoading = false;
  }

  private setTileLayer(): void {
    if (!this.mainMap) return;

    if (this.mapStyle === 'default') {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3
      }).addTo(this.mainMap);
    } else {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3
      }).addTo(this.mainMap);
    }
  }

  private addMarkersToMap(): void {
    if (!this.mainMap) return;

    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Add markers for filtered projects
    this.filteredProjects.forEach(project => {
      if (project.latitude && project.longitude) {
        const popupContent = `
          <div class="custom-popup" style="font-family: system-ui; min-width: 200px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="width: 4px; height: 30px; background: #CA0018; border-radius: 2px;"></div>
              <strong style="color: #1f2937; font-size: 14px;">${project.projectName || project.title}</strong>
            </div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 6px;">
              <i class="fa-regular fa-building" style="margin-right: 4px;"></i> ${project.sector?.title || 'Infrastructure'}
            </div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">
              <i class="fa-solid fa-location-dot" style="margin-right: 4px; color: #CA0018;"></i> ${project.locationName || 'Project Site'}
            </div>
            ${project.projectValue ? `<div style="font-size: 11px; color: #10b981; margin-bottom: 8px;">
              <i class="fa-regular fa-money-bill-1"></i> ${project.projectValue.toLocaleString()} SAR
            </div>` : ''}
            <button onclick="document.querySelector('app-projects')?.openProjectModalFromMap(${project.id})"
                    style="width: 100%; background: #CA0018; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; cursor: pointer; margin-top: 4px;">
              View Details →
            </button>
          </div>
        `;

        const marker = L.marker([project.latitude, project.longitude], { icon: this.customIcon })
          .bindPopup(popupContent)
          .addTo(this.mainMap!);

        // Store project id on marker
        (marker as any).projectId = project.id;

        this.markers.push(marker);
      }
    });
  }

  private updateMapMarkers(): void {
    if (this.mainMap) {
      this.addMarkersToMap();
    }
  }

  fitMapToBounds(): void {
    if (!this.mainMap || this.markers.length === 0) return;

    const bounds = L.latLngBounds(this.markers.map(m => m.getLatLng()));
    this.mainMap.fitBounds(bounds, { padding: [50, 50] });
  }

  resetMapView(): void {
    if (!this.mainMap) return;
    this.mainMap.setView([23.8859, 45.0792], 5);
  }

  toggleMapStyle(): void {
    this.mapStyle = this.mapStyle === 'default' ? 'dark' : 'default';
    if (this.mainMap) {
      this.mainMap.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          this.mainMap?.removeLayer(layer);
        }
      });
      this.setTileLayer();
    }
  }

  centerMapOnProject(project: Project): void {
    if (this.mainMap && project.latitude && project.longitude) {
      this.mainMap.setView([project.latitude, project.longitude], 12);
      // Find and open popup for this marker
      const marker = this.markers.find(m => (m as any).projectId === project.id);
      if (marker) {
        marker.openPopup();
      }
    }
  }

  openProjectModalFromMap(projectId: number): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      this.mainMap?.closePopup();
      this.openProjectModal(project);
    }
  }

  openProjectModal(project: Project): void {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';

    // Initialize modal map after modal opens
    setTimeout(() => {
      if (project.latitude && project.longitude) {
        this.initModalMap(project.latitude, project.longitude, project.locationName || 'Project Location');
      }
    }, 300);
  }

  private initModalMap(lat: number, lng: number, locationName: string): void {
    const mapElement = document.getElementById('modal-project-map');
    if (!mapElement) return;

    if (this.modalMap) {
      this.modalMap.remove();
    }

    this.modalMap = L.map('modal-project-map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.modalMap);

    const marker = L.marker([lat, lng], { icon: this.customIcon }).addTo(this.modalMap);
    marker.bindPopup(`<strong>📍 ${locationName}</strong>`).openPopup();
  }

  openInGoogleMaps(project: Project): void {
    if (project.latitude && project.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`;
      window.open(url, '_blank');
    }
  }

  closeModal(): void {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';

    if (this.modalMap) {
      this.modalMap.remove();
      this.modalMap = null;
    }
  }
  scrollToMap(){
    window.scroll({top:800 , behavior:"smooth"})
  }
}
