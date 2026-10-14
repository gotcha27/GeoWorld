
// Crée la table des catégories de quiz.
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategory1792000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`category\` (
        \`categoryId\` int NOT NULL AUTO_INCREMENT,
        \`name_category\` varchar(100) NOT NULL,
        \`code_category\` varchar(50) NOT NULL,
        \`description\` varchar(255) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`UQ_category_name\` (\`name_category\`),
        UNIQUE INDEX \`UQ_category_code\` (\`code_category\`),
        PRIMARY KEY (\`categoryId\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `category`");
  }
}
