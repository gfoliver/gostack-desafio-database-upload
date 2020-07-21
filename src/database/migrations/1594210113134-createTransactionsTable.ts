import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createTransactionsTable1594210113134 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "transactions",
            columns: [
                { 
                    name: "id", 
                    type: "varchar", 
                    generationStrategy: "uuid", 
                    default: "uuid_generate_v4()",
                    isPrimary: true, 
                    isUnique: true 
                },
                { name: "title", type: "varchar" },
                { name: "type", type: "varchar" },
                { name: "value", type: "numeric" },
                { name: "category_id", type: "varchar" },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("transactions");
    }

}
