export interface Comment {
    id: number;
    comment: string;
    customer_name: string;
    customer_email: string;
    published_data: string;
    blogId: number;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  imagePublicId : string;
  imageUrl : string;
  author?: {
    Id: number;
    name: string;
    email: string;
  };
  updatedBy?: {
    Id: number;
    name: string;
    email: string;
  };
  published_date: string; 
  comments?: Comment[];
}
