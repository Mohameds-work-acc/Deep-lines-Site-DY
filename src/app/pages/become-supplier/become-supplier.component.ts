import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';


@Component({
  selector: 'app-become-supplier',
  templateUrl: './become-supplier.component.html',
  styleUrls: ['./become-supplier.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class BecomeSupplierComponent implements OnInit {
  supplierForm: FormGroup;
  submitting = false;
  openFaqIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.supplierForm = this.fb.group({
      companyName: ['', Validators.required],
      crNumber: ['', Validators.required],
      taxNumber: [''],
      contactPerson: ['', Validators.required],
      position: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: [''],
      category: ['', Validators.required],
      yearsInBusiness: ['', Validators.required],
      certifications: [''],
      experience: [''],
      additionalInfo: [''],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.supplierForm.invalid) {
        
      Object.keys(this.supplierForm.controls).forEach(key => {
        this.supplierForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;

    // Prepare form data
    const formData = this.supplierForm.value;

    emailjs.init('fsy3AwJtgIfOlShBO');
    emailjs.send('service_23hfn4q', 'template_wz5znve', formData)
      .then(() => {
        alert('Your application has been submitted successfully!');
        this.supplierForm.reset();
      })
      .catch(() => {
        alert('There was an error submitting your application. Please try again later.');
      })
      .finally(() => {
        this.submitting = false;
      });

  }

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}