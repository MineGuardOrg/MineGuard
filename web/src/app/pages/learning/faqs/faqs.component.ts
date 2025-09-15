import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatExpansionModule, TranslateModule],
  templateUrl: './faqs.component.html',
})
export class AppFaqsComponent {
  faqs = [
    {
      q: 'What is Teach U?',
      a: `Teach U is an online learning platform that provides a variety of courses and resources for educators. It aims to enhance the learning experience by offering interactive content and settings. It is widely used by the site owners to keep track of their website, make changes to their content, and more.`
    },
    {
      q: 'Do I need to pay to use Teach U?',
      a: `No, you don't have to pay. Teach U offers completely free courses.`
    },
    {
      q: 'What types of courses are available?',
      a: `The platform includes courses on a wide range of topics, including technology, occupations, education, and more.`
    },
    {
      q: 'Does Teach U have certifications?',
      a: `Yes, Teach U has its own certificates that we provide to users upon completion of their courses.`
    },
    {
      q: 'Can I upload and manage my own content?',
      a: `Yes, course instructors can create, upload, and manage their own courses, quizzes, and learning materials directly from their dashboard.`
    }
  ];
}
