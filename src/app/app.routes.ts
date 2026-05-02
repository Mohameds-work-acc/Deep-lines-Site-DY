import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { SectorsComponent } from './pages/sectors/sectors.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { BlogListComponent } from './pages/blogs/blog-list.component';
import { BlogSingleComponent } from './pages/blog-single/blog-single.component';
import { BecomeSupplierComponent } from './pages/become-supplier/become-supplier.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomePage},
    {path:'about-us' , component:AboutUsComponent },
    {path: 'services', component: SectorsComponent},
    {path: 'solutions', component: ProductsComponent},
    {path:'projects', component:ProjectsComponent} ,
    {path: 'blogs', component: BlogListComponent},
    {path: 'blog/:id', component: BlogSingleComponent},
    {path: 'become-supplier', component: BecomeSupplierComponent},
    {path: 'contact', component: ContactUsComponent},
    {path: '**', redirectTo: 'home'}
];
