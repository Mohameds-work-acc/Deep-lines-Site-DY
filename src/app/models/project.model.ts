export interface GetBlogUserDto {
  id?: number;
  Id?: number;
  name: string;
  email: string;
}

export interface GetSectorWithProjectDto {
  id: number;
  title: string;
}

export interface GetProjectsDto {
  id: number;
  title: string;
  description: string;
  imagePublicId?: string | null;
  imageUrl?: string | null;
  projectName?: string | null;
  clientName?: string | null;
  canDisplayClientName: boolean;
  projectValue?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  scopeOfWork?: string | null;
  keyAchievements?: string[] | null;
  locationName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  sector?: GetSectorWithProjectDto | null;
  author?: GetBlogUserDto | null;
  updatedBy?: GetBlogUserDto | null;
}

export type GetProjectsDTO = GetProjectsDto;
export type Project = GetProjectsDto;
