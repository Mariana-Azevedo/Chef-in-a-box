import vine from '@vinejs/vine'

/**
 * Validates the product's creation action
 */
export const createRecipeValidator = vine.compile(
    vine.object({
        title: vine.string().trim(),
        description: vine.string().trim(),
        instructions: vine.string().trim(),
        cuisine: vine.string().trim(),
        image: vine.string().trim(),
    })
)