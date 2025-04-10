import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Apollo } from 'apollo-angular';
import { registerMutation } from './graphqlRegister';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FlexLayoutModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  error: any;
  loading: boolean = true;
  token: any[] = [];
  message: boolean = false;
  selectedFile: File | null = null;

  constructor(private apollo: Apollo) { }

  // ✅ Handle File Selection for Image Upload
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log("File selected:", this.selectedFile);
  }

  register(name: string, email: string, phoneNo: any, password: string) {
    phoneNo = Number(phoneNo);
    if (!this.selectedFile) {
      alert('Please upload an image');
      return;
    }
    this.apollo.mutate({
      mutation: registerMutation,
      variables: { createuser: { name, email, password, phoneNo }, file: this.selectedFile },
      context: {
        headers: {
          'apollo-require-preflight': true
        },
        useMultipart: true,
      },
    }).subscribe({
      next: ({ data }) => {
        console.log('User registered:', data);
        alert('Registration successful!');
      },
      error: (error) => {
        console.error('Registration error:', error);
      }
    });
  }
}
