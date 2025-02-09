import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recipe_ingredients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('quantity')
      table.integer('recipe_id').unsigned().references('recipes.id').onDelete('CASCADE')
      table.integer('ingredient_id').unsigned().references('ingredients.id').onDelete('CASCADE')
      table.unique(['recipe_id', 'ingredient_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}