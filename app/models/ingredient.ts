import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Recipe from './recipe.js'


export default class Ingredient extends BaseModel {

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare description: string

    @column()
    declare unit: string

    @column()
    declare price: number

    @column()
    declare image: string

    @column()
    declare imageType: string

    @manyToMany(() => Recipe, {
        pivotTable: 'recipe_ingredients', 
        pivotColumns: ['quantity'],
    })
    declare recipes: ManyToMany<typeof Recipe>

    @column()
    declare stock: number
    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}