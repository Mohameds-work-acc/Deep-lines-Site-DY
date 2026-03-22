import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  submitting = false;
  openFaqIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;

    const formData = this.contactForm.value;
    console.log('Contact Form Submitted:', formData);
    
    emailjs.init('fsy3AwJtgIfOlShBO');
    emailjs.send('service_23hfn4q', 'template_em3m7v5', formData)
      .then(() => {
        alert('Your message has been sent successfully! We will get back to you shortly.');
        this.contactForm.reset();
        this.submitting = false;
      })
      .catch(() => {
        alert('Failed to send your message. Please try again later.');
        this.submitting = false;
      });
    
    
  }

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}