
 // Ajoute la clé étrangère entre les parties et les catégories.
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryToStory1792100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`story\`
      ADD COLUMN \`categoryId\` int NULL,
      ADD INDEX \`IDX_story_categoryId\` (\`categoryId\`),
      ADD CONSTRAINT \`FK_story_category\`
      FOREIGN KEY (\`categoryId\`)
      REFERENCES \`category\` (\`categoryId\`)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`story\`
      DROP FOREIGN KEY \`FK_story_category\`,
      DROP INDEX \`IDX_story_categoryId\`,
      DROP COLUMN \`categoryId\`
    `);
  }
}
