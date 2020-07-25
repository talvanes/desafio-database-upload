import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterTransactionsTableValueColumnToDouble1595693841121
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Modify column 'value' type to 'double'
    await queryRunner.changeColumn(
      'transactions',
      'value',
      new TableColumn({
        name: 'value',
        type: 'real',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback column 'value' type to 'decimal(10,2)'
    await queryRunner.changeColumn(
      'transactions',
      'value',
      new TableColumn({
        name: 'value',
        type: 'decimal(10,2)',
      }),
    );
  }
}
