import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
<div class="branding">
  <img
    src="./assets/images/magh.png"
    class="align-middle m-2"
    alt="logo"
    style="width: 220px; height: auto;"
  />
</div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
