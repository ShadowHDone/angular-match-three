import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattlefieldComponent } from './battlefield.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BattlefieldComponent],
  exports: [BattlefieldComponent],
})
export class BattlefieldModule {}
