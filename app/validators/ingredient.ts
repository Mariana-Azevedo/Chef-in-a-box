import vine from '@vinejs/vine'

export const createIngredientValidator = vine.compile(
    vine.object({
        name: vine.string().trim(),
        description: vine.string().trim(),
        unit: vine.string().trim(),
        price: vine.number(),
        image: vine.string().trim(),
        quantity: vine.number(),
    })
  )