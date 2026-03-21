import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog, Comment } from '../../models/blog.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-single',
  templateUrl: './blog-single.component.html',
  styleUrls: ['./blog-single.component.css'],
  imports: [CommonModule, FormsModule, SafeHtmlPipe , RouterLink]
})
export class BlogSingleComponent implements OnInit {
  blog: Blog | null = null;
  relatedBlogs: Blog[] = [];
  loading = false;
  error: string | null = null;
  newCommentName = '';
  newCommentEmail = '';
  newCommentContent = '';
  submittingComment = false;
  allBlogs: Blog[] = [];
  shareUrl: string = '';
  shareTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.shareUrl = window.location.href;
    this.loadAllBlogs();
  }
  shareOnTwitter(): void {
    const text = encodeURIComponent(this.blog?.title || 'Check out this article');
    const url = encodeURIComponent(this.shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    }

    shareOnLinkedIn(): void {
        const url = encodeURIComponent(this.shareUrl);
        const title = encodeURIComponent(this.blog?.title || '');
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, '_blank', 'width=600,height=500');
    }

    shareOnFacebook(): void {
        const url = encodeURIComponent(this.shareUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    }

    shareByEmail(): void {
        const subject = encodeURIComponent(this.blog?.title || 'Check out this article');
        const body = encodeURIComponent(`I thought you might find this interesting:\n\n${this.shareUrl}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }

    copyToClipboard(): void {
    navigator.clipboard.writeText(this.shareUrl).then(() => {
        
        alert('Link copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy link');
    });
    }
  loadAllBlogs(): void {
    this.loading = true;
    
    this.blogService.getAll().subscribe({
      next: (data) => {
        this.allBlogs = data;
        this.loadBlogById();
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.error = 'Failed to load article';
        this.loading = false;
      }
    });
  }

  loadBlogById(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (isNaN(id)) {
      this.error = 'Invalid article ID';
      this.loading = false;
      return;
    }
    
    this.blogService.getById(id).subscribe({
      next: (data) => {
        this.blog = data;
        this.loadRelatedBlogs();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blog:', err);
        this.error = 'Article not found';
        this.loading = false;
      }
    });
  }

  loadRelatedBlogs(): void {
    if (this.blog && this.allBlogs.length > 0) {
      this.relatedBlogs = this.allBlogs
        .filter(b => b.id !== this.blog?.id)
        .slice(0, 2);
    }
  }

  getReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/g).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  getHeadings(content: string): string[] {
    const headingRegex = /<h2>(.*?)<\/h2>/g;
    const headings: string[] = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(match[1]);
    }
    
    return headings;
  }

  scrollToHeading(heading: string): void {
    const element = document.querySelector(`h2:contains("${heading}")`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  submitComment(): void {
    if (!this.newCommentName.trim() || !this.newCommentContent.trim() || !this.newCommentEmail.trim()) {
      return;
    }
    
    this.submittingComment = true;
    
    const commentData = {
      comment: this.newCommentContent,
      customer_name: this.newCommentName,
      customer_email: this.newCommentEmail,
      blogId: this.blog?.id
    };

    this.blogService.addComment(commentData).subscribe({
      next: () => {
        this.newCommentName = '';
        this.newCommentEmail = '';
        this.newCommentContent = '';
        this.submittingComment = false;
        this.loadBlogById();
      },
      error: (err) => {
        console.error('Error submitting comment:', err);
        this.submittingComment = false;
      }
    });
  }

  navigateToBlog(id: number): void {
    this.router.navigate(['/blog', id]);
    window.scrollTo(0, 0);
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }
}