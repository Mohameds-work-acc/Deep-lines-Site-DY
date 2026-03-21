import { Component, OnInit } from '@angular/core';
import { SectorService } from '../../services/sector.service';
import { Sector } from '../../models/sector.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sectors',
  imports: [CommonModule],
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css']
})
export class SectorsComponent implements OnInit {
  sectors: Sector[] = [];
  loading = false;
  error: string | null = null;
  selectedSector: Sector | null = null;
  showMVModal = false;
  mvSector: Sector | null = null;

  constructor(private sectorService: SectorService) {}

  ngOnInit(): void {
    this.loadSectors();
  }

  loadSectors(): void {
    this.loading = true;
    this.error = null;
    
    this.sectorService.getAll().subscribe({
      next: (data) => {
        this.sectors = data;
        this.loading = false;
        console.log('Sectors loaded:', this.sectors);
      },
      error: (err) => {
        console.error('Error loading sectors:', err);
        this.error = 'Failed to load sectors. Please check your connection and try again.';
        this.loading = false;
        
      }
    });
  }

  // Mock data for development/testing
  private loadMockData(): void {
    this.sectors = [
      {
        id: 1,
        title: 'Water Infrastructure',
        description: 'Comprehensive water management solutions including treatment plants, distribution networks, and sewage systems designed for sustainability and efficiency.',
        imageUrl: 'assets/water-infrastructure.jpg',
        vision: 'To be the leader in sustainable water solutions across the Kingdom',
        mission: 'Delivering innovative water infrastructure that ensures resource efficiency and environmental stewardship',
        author: { Id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@deeplines.com' },
        updatedBy: { Id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@deeplines.com' },
        relatedProductsCount: 12
      },
      {
        id: 2,
        title: 'Smart Traffic Systems',
        description: 'Intelligent traffic management solutions including smart signals, monitoring systems, and integrated control centers for urban mobility.',
        imageUrl: 'assets/smart-traffic.jpg',
        vision: 'Creating seamless urban mobility through intelligent infrastructure',
        mission: 'Implementing cutting-edge traffic solutions that enhance safety and efficiency',
        author: { Id: 2, name: 'Sarah Al-Mansour', email: 'sarah@deeplines.com' },
        updatedBy: { Id: 2, name: 'Sarah Al-Mansour', email: 'sarah@deeplines.com' },
        relatedProductsCount: 8
      },
      {
        id: 3,
        title: 'Electrical Networks',
        description: 'Complete electrical infrastructure solutions including power distribution, substations, and smart grid technologies.',
        imageUrl: 'assets/electrical-networks.jpg',
        vision: 'Powering Saudi Arabia\'s future with reliable and sustainable electrical infrastructure',
        mission: 'Delivering high-quality electrical networks that ensure uninterrupted power supply',
        author: { Id: 3, name: 'Faisal Al-Otaibi', email: 'faisal@deeplines.com' },
        updatedBy: { Id: 3, name: 'Faisal Al-Otaibi', email: 'faisal@deeplines.com' },
        relatedProductsCount: 15
      },
      {
        id: 4,
        title: 'Drainage Systems',
        description: 'Advanced drainage and stormwater management solutions for urban and industrial applications.',
        imageUrl: 'assets/drainage-systems.jpg',
        vision: 'Creating resilient cities through advanced water management systems',
        mission: 'Designing and implementing efficient drainage solutions that protect communities',
        author: { Id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@deeplines.com' },
        updatedBy: { Id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@deeplines.com' },
        relatedProductsCount: 6
      },
      {
        id: 5,
        title: 'Renewable Energy',
        description: 'Sustainable energy solutions including solar, wind, and hybrid systems for commercial and industrial applications.',
        imageUrl: 'assets/renewable-energy.jpg',
        vision: 'Leading the transition to sustainable energy in Saudi Arabia',
        mission: 'Providing innovative renewable energy solutions that reduce carbon footprint',
        author: { Id: 2, name: 'Sarah Al-Mansour', email: 'sarah@deeplines.com' },
        updatedBy: { Id: 2, name: 'Sarah Al-Mansour', email: 'sarah@deeplines.com' },
        relatedProductsCount: 10
      },
      {
        id: 6,
        title: 'Construction Projects',
        description: 'End-to-end construction management for commercial, industrial, and infrastructure projects.',
        imageUrl: 'assets/construction.jpg',
        vision: 'Setting new standards in construction excellence and project delivery',
        mission: 'Executing complex construction projects with precision and quality',
        author: { Id: 3, name: 'Faisal Al-Otaibi', email: 'faisal@deeplines.com' },
        updatedBy: { Id: 3, name: 'Faisal Al-Otaibi', email: 'faisal@deeplines.com' },
        relatedProductsCount: 20
      }
    ];
  }

  getTotalProjects(): number {
    return this.sectors.reduce((total, sector) => total + (sector.relatedProductsCount || 0), 0);
  }

  openSectorModal(sector: Sector): void {
    this.selectedSector = sector;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedSector = null;
    document.body.style.overflow = 'auto';
  }

  openMissionVision(sector: Sector): void {
    this.mvSector = sector;
    this.showMVModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeMVModal(): void {
    this.showMVModal = false;
    this.mvSector = null;
    document.body.style.overflow = 'auto';
  }
}