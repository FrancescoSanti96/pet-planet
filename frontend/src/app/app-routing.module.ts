import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { LoginComponent } from './pages/login-page/login.component';
import { PersonalPageComponent } from './pages/personal-page/personal-page.component';
import { ChatComponent } from './component/chat/chat.component';
import { PersonalPostComponent } from './pages/personal-post/personal-post.component';
import { OtherPetProfileComponent } from './pages/other-pet-profile/other-pet-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'chat/:friendId', component: ChatComponent },
  { path: 'homepage', component: HomePageComponent },
  { path: 'register', component: RegistrationPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: PersonalPageComponent },
  { path: 'post', component: PersonalPostComponent },
  { path: 'other-pet-profile/:userId', component: OtherPetProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
