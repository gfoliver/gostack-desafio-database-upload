import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createCategoriesTable1594210848812 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "categories",
            columns: [
                { 
                    name: "id", 
                    type: "varchar", 
                    generationStrategy: "uuid", 
                    default: "uuid_generate_v4()", 
                    isPrimary: true, 
                    isUnique: true 
                },
                { name: "title", type: "varchar", isNullable: false },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("categories");
    }

}
