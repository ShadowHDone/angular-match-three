import { Component, OnInit } from '@angular/core';

const DEV_TOOLS_LOCAL_STORAGE_TOKEN = 'DEV_TOOLS_LOCAL_STORAGE_TOKEN';

@Component({
  selector: 'app-dev-tools',
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.css'],
})
export class DevToolsComponent implements OnInit {
  open = false;

  constructor() {}

  ngOnInit() {
    this.open = JSON.parse(localStorage.getItem(DEV_TOOLS_LOCAL_STORAGE_TOKEN));
  }

  minimizeToggle() {
    this.open != this.open;
    localStorage.setItem(
      DEV_TOOLS_LOCAL_STORAGE_TOKEN,
      JSON.stringify(this.open)
    );
  }
}
