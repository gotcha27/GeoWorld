
// Ajoute les premières catégories de quiz.
import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertInitialCategories1792000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`category\` (\`name_category\`, \`code_category\`, \`description\`)
      VALUES
        ('Capitales', 'CAPITALS', 'Trouver la capitale d’un pays ou territoire'),
        ('Drapeaux', 'FLAGS', 'Reconnaître le drapeau d’un pays ou territoire'),
        ('Monnaies', 'CURRENCIES', 'Identifier la monnaie utilisée par un pays ou territoire')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM \`category\`
      WHERE \`code_category\` IN ('CAPITALS', 'FLAGS', 'CURRENCIES')
    `);
  }
}
