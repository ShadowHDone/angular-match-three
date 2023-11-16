import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageService } from '../../storage/storage.service';

type settingsForm = {
  autosave: FormControl<boolean>;
};

@UntilDestroy()
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  settingsForm = new FormGroup<settingsForm>({
    autosave: new FormControl<boolean>(false),
  });

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    const settings = this.storageService.loadState().settings;
    this.settingsForm.patchValue(settings);
    this.settingsForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((settings) => {
        this.storageService.saveSettings(settings);
      });
  }
}
