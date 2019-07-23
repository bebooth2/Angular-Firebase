import { FinancialComponent } from './components/financial/financial.component';
import { AboutComponent } from './components/about/about.component';
import { AuthGuard } from './auth/auth.guard';
import { WeatherComponent } from './components/weather/weather.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path: 'about', component: AboutComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'financial', component: FinancialComponent},
  {path: 'weather', component: WeatherComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
