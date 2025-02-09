import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Ingredient from './ingredient.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Cart extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @manyToMany(() => Ingredient, {
        pivotTable: 'carts_ingredients', 
        pivotColumns: ['quantity'],
    })
    declare ingredients: ManyToMany<typeof Ingredient>
    
    @column()
    declare userId: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
