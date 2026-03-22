import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
  imports: [RouterLink]
})
export class AboutUsComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    // Add scroll animation listener
    this.addScrollAnimations();
  }

  submitContactForm(): void {
    // Get form values
    const name = (document.getElementById('name') as HTMLInputElement)?.value;
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const message = (document.getElementById('message') as HTMLTextAreaElement)?.value;
    
    // Here you would typically send this data to your backend service
    console.log('Form submitted:', { name, email, message });
    
    // Show success message (you can replace with a proper toast notification)
    alert('Thank you for your message! We will get back to you soon.');
    
    // Clear form
    if (name && email && message) {
      (document.getElementById('name') as HTMLInputElement).value = '';
      (document.getElementById('email') as HTMLInputElement).value = '';
      (document.getElementById('message') as HTMLTextAreaElement).value = '';
    }
  }

  private addScrollAnimations(): void {
    // Add intersection observer for fade-in animations on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }
}