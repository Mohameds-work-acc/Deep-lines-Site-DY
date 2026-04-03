import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true,
})
export class Navbar {
   isOpen = false;
  currentYear = new Date().getFullYear();
  navItems = [
    { path: '/', label: 'Home', icon: 'fa-solid fa-home' },
    { path: '/about-us', label: 'About Us', icon: 'fa-regular fa-building' },
    { path: '/services', label: 'Services', icon: 'fa-solid fa-chart-pie' },
    { path: '/solutions', label: 'Solutions', icon: 'fa-solid fa-microchip' },
    { path: '/projects', label: 'Projects', icon: 'fa-regular fa-folder-open' },
    { path: '/blogs', label: 'Blogs', icon: 'fa-regular fa-newspaper' }
  ];
   constructor(private router: Router) {
    // Close menu on route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeMenu();
      }
    });
  }
  openMenu(): void {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMenu(): void {
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  toggleMenu(): void {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
  ngOnInit(): void {
   
  }
}
