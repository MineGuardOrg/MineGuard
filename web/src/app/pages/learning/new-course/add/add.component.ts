import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatButtonModule, TranslateModule],
  templateUrl: './add.component.html',
  providers: [DatePipe],
})
export class AppAddCourseComponent {
  constructor() {}
}
