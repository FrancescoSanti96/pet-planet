import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { LoginComponent } from './pages/login-page/login.component';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { GoogleAuthComponent } from './component/google-auth/google-auth.component';
import { PersonalPageComponent } from './pages/personal-page/personal-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { ChatComponent } from './component/chat/chat.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommentDialogComponent } from './component/comment-dialog/comment-dialog.component';
import { ModifyPostDialogComponent } from './component/modify-post-dialog/modify-post-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegistrationPageComponent,
    LoginComponent,
    GoogleAuthComponent,
    PersonalPageComponent,
    ConfirmationDialogComponent,
    ChatComponent,
    NavbarComponent,
    CommentDialogComponent,
    ModifyPostDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
