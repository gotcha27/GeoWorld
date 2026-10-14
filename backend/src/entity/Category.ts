
 // Représente une catégorie de quiz et les parties associées.
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Story } from "./Story";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ length: 100, unique: true })
  name_category: string;

  @Column({ length: 50, unique: true })
  code_category: string;

  @Column({ length: 255, nullable: true })
  description: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Story, story => story.category)
  stories: Story[];
}
