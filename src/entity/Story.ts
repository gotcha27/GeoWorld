
 // Représente une partie jouée par un utilisateur.
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./User";
import { Question } from "./Question";
import { Category } from "./Category";

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  storyId: number;

  @Column()
  score: number;

  @Column()
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.stories)
  user: User;

  @OneToMany(() => Question, question => question.story)
  questions: Question[];

  @ManyToOne(() => Category, category => category.stories, { nullable: true })
  @JoinColumn({ name: "categoryId" })
  category: Category | null;
}
