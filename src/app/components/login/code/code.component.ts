import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Apollo } from 'apollo-angular';
import { login } from './graphqlCode';

@Component({
  selector: 'app-code',
  imports: [CommonModule, FlexLayoutModule],
  templateUrl: './code.component.html',
  styleUrl: './code.component.scss'
})
export class CodeComponent {
  @Input() phoneNumber!: number;
  activationCode!: string;

  error: any;
  loading: boolean = false;
  code: string[] = ['', '', '', '', '', ''];
  inputs = Array(6).fill(0);

  constructor(private router: Router, private apollo: Apollo) { }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    this.code[index] = value;

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
    // Auto-submit if all fields are filled
    if (this.code.every(d => d.length === 1)) {
      this.activationCode = this.code.join('');
      console.log('Submitting code:', this.activationCode);
      this.login();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }

  login() {
    this.apollo.watchQuery({
      query: login,
      variables: {
        phoneNo: this.phoneNumber,
        otp: this.activationCode
      }
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.loading = false;
      if (error) {
        console.error("Error fetching users:", error);
        this.error = error;
      } else {
        console.log(data);
        this.loading = true;

        setTimeout(() => {
          // Do something after 5 seconds
          this.loading = false;
          this.router.navigate(['/next']); // or any action
        }, 5000);

        // sessionStorage.setItem("token", data.login.token);
        // sessionStorage.setItem("refreshToken", data.login.refreshToken);
      }
    });
  }
}
