import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCategoriesTable1595619249914
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create 'categories' table schema
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop 'categories' table schema
    await queryRunner.dropTable('categories');
  }
}
