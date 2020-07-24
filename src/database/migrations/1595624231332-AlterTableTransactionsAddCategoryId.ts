import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterTableTransactionsAddCategoryId1595624231332
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create column 'category_id' of type 'uuid', 'nullable' on 'transactions'
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Create Foreign Key 'TransactionCategory' on 'transactions'
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionCategory',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop Foreign Key 'TransactionCategory' from 'transactions'
    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');

    // Drop column 'category_id' from 'transactions'
    await queryRunner.dropColumn('transactions', 'category_id');
  }
}
