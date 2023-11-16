import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { SettingsComponent } from './logic/settings/settings.component';
import { BattlefieldModule } from './battlefield/battlefield.module';
import { DevToolsComponent } from './logic/dev-tools/dev-tools.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, BattlefieldModule],
  declarations: [AppComponent, HelloComponent, SettingsComponent, DevToolsComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
