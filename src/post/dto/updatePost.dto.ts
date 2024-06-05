import { IsOptional } from 'class-validator';
export class UpdatePostDto {
  @IsOptional()
  readonly Title?: string;
  @IsOptional()
  readonly body?: string;
}
