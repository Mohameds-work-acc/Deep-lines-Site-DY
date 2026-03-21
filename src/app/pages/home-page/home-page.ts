import { Component, AfterViewInit, OnInit } from '@angular/core';
import { SectorService } from '../../services/sector.service';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import emailjs from '@emailjs/browser';
@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  standalone: true,
})
export class HomePage implements AfterViewInit , OnInit {
  sectors: any[] = [];
  projects: any[] = [];
  constructor(private sectorService: SectorService , private projectService: ProjectService) {
    
  }
  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
     
        this.projects = data.slice(0, 7);
   
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
    this.sectorService.getAll().subscribe({
      next: (data) => {
        this.sectors = data; 
      },
      error: (err) => {
        console.error('Error fetching sectors:', err);
      }
    });

    
  }

  submitContactForm(): void {
    const form  = document.getElementById('contactUs-form') as HTMLFormElement;
    
    if (form) {
      
      emailjs.init('gAK9XxdQzt0DjLBum');
      emailjs.sendForm('service_zfhzpkr', 'template_z3x6x7q', form)
        .then((result) => {
          alert('Your message has been sent successfully!');
          form.reset();
        }, (error) => {
          alert('There was an error sending your message. Please try again later.');
        });
    }
  }

  ngAfterViewInit(): void {
    
    const SwiperCtor = (window as any).Swiper;
    if (typeof SwiperCtor === 'function') {
      new SwiperCtor('.swiper', {
        slidesPerView: 4,
        direction: 'horizontal',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    } else {
      console.warn('Swiper is not loaded on window; check script include in index.html');
    }
  }

}

