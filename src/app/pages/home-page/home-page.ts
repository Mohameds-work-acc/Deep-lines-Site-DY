import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { SectorService } from '../../services/sector.service';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import emailjs from '@emailjs/browser';
import { RouterLink, RouterOutlet } from "@angular/router";
import { Project } from '../../models/project.model';
@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink , ],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  standalone: true,
})
export class HomePage implements AfterViewInit , OnInit , OnDestroy  {
  swiperModules = ['Autoplay', 'Navigation', 'Pagination'];
  experienceYears = 15;
  projectsCompleted = 50;
  teamMembers = 200;
  projectValue = 2.5;
  private observer: IntersectionObserver | null = null;
  private animationStarted = false;
  sectors: any[] = [];
  projects: Project[] = [];
  partners = [
    { logo: 'clients/c-1.png' },
    {  logo: 'clients/c-2.png' },
    { logo: 'clients/c-3.png' },
    { logo: 'clients/c-4.png' },
    { logo: 'clients/c-5.png',  },
    { logo: 'clients/c-6.png',  },
    { logo: 'clients/c-7.png',  },
    { logo: 'clients/c-8.png', },
    { logo: 'clients/c-9.png',  },
    { logo: 'clients/c-10.png', },
    { logo: 'clients/c-11.png',  },
    { logo: 'clients/c-12.png',  },
    { logo: 'clients/c-13.png',  },
    { logo: 'clients/c-14.png',  },
    { logo: 'clients/c-15.png',  },
    { logo: 'clients/c-16.png',  },
    { logo: 'clients/c-17.png',  },
    { logo: 'clients/c-18.png',  },
    { logo: 'clients/c-19.png',  },
    { logo: 'clients/c-20.png',  },
    { logo: 'clients/c-21.png',  },
    { logo: 'clients/c-22.jpeg',  },
    { logo: 'clients/c-23.jpeg',  },
    { logo: 'clients/c-24.svg',  },
  ];
  constructor(private sectorService: SectorService , private projectService: ProjectService) {

  }
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
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
  initSwiperNavigation(): void {
    // Wait for swiper to be ready
    setTimeout(() => {
      const swiperEl = document.querySelector('swiper-container') as any;
      const prevBtn = document.querySelector('.swiper-button-prev-custom');
      const nextBtn = document.querySelector('.swiper-button-next-custom');

      if (swiperEl && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => swiperEl.swiper.slidePrev());
        nextBtn.addEventListener('click', () => swiperEl.swiper.slideNext());
      }
    }, 100);
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
        slidesPerView: window.innerWidth < 640 ? 1 : 4,
        direction: 'horizontal',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    } else {
      console.warn('Swiper is not loaded on window; check script include in index.html');
    }

    this.setupIntersectionObserver();
  }
  private setupIntersectionObserver(): void {
    const section = document.querySelector('.stat-card');

    if (section) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animationStarted) {
            this.animationStarted = true;
            this.startCounters();
            this.observer?.disconnect();
          }
        });
      }, { threshold: 0.3 });

      this.observer.observe(section);
    } else {
      // Fallback: start counters after a short delay
      setTimeout(() => {
        if (!this.animationStarted) {
          this.startCounters();
        }
      }, 500);
    }
  }

  private startCounters(): void {
    // Counter for Years of Experience
    this.animateCounter('.counter[data-target="' + this.experienceYears + '"]', this.experienceYears);

    // Counter for Projects Completed
    this.animateCounter('.counter[data-target="' + this.projectsCompleted + '"]', this.projectsCompleted);

    // Counter for Team Members
    this.animateCounter('.counter[data-target="' + this.teamMembers + '"]', this.teamMembers);

    // Counter for Project Value (with decimal)
    this.animateDecimalCounter('.counter-value', this.projectValue);
  }

  private animateCounter(selector: string, targetValue: number): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;

    let currentValue = 0;
    const duration = 2000; // 2 seconds
    const stepTime = 20; // milliseconds per step
    const steps = duration / stepTime;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      currentValue += increment;

      if (currentValue >= targetValue) {
        element.textContent = Math.floor(targetValue).toString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(currentValue).toString();
      }
    }, stepTime);
  }

  private animateDecimalCounter(selector: string, targetValue: number): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;

    let currentValue = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      currentValue += increment;

      if (currentValue >= targetValue) {
        element.textContent = targetValue.toFixed(1);
        clearInterval(timer);
      } else {
        element.textContent = currentValue.toFixed(1);
      }
    }, stepTime);
  }

}

