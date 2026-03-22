import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';
import { CommonModule } from '@angular/common';
import { StripHtmlPipe } from '../../pipes/strip-html.pipe.';




@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
    imports: [CommonModule, StripHtmlPipe]
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;
    
    this.blogService.getAll().subscribe({
      next: (data) => {
        this.blogs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load articles. Please check your connection and try again.';
        this.loading = false;
        
        
      }
    });
  }

  navigateToBlog(id: number): void {
    this.router.navigate(['/blog', id]);
  }

  getReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/g).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  }


}
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
