import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ingredients'


  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('stock')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) =>{
      table.dropColumn('stock')
    })
  }
}