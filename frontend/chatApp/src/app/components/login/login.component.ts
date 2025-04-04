import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { getId, login, registerMutation } from './graphqlLoginQueries';
import { ChatComponent } from '../chat/chat.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, DashboardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  error: any;
  loading: boolean = true;
  token: any[] = [];
  message: boolean = false;
  selectedFile: File | null = null;

  constructor(private apollo: Apollo) { }
  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this.message = true;
    }
  }

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

  login(email: string, password: string) {
    console.log(email, password);

    this.apollo.watchQuery({
      query: login,
      variables: {
        email,
        password
      }
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.loading = false;
      if (error) {
        console.error("Error fetching users:", error);
        this.message = false;
        this.error = error;
      } else {
        this.token = data.login.token
        this.getId();
        this.message = true;
        sessionStorage.setItem("token", data.login.token);
        sessionStorage.setItem("refreshToken", data.login.refreshToken);
      }
    });
  }

  getId() {
    this.apollo.watchQuery({
      query: getId,
      context: {
        headers: {
          'Authorization': this.token
        },
      }
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.loading = false;
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        sessionStorage.setItem("id", data.getId.id);
      }
    });
  }
}

