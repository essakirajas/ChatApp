// app.routes.ts or wherever your routes are defined
import { Routes } from '@angular/router';
import { PhoneNoComponent } from './components/login/phone-no/phone-no.component';
import { CodeComponent } from './components/login/code/code.component';

export const routes: Routes = [
  { path: '', component: PhoneNoComponent },
  { path: 'code', component: CodeComponent },
];
