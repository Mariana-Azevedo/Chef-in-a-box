import Ingredient from '#models/ingredient';
import Recipe from '#models/recipe'
import { createIngredientValidator } from '#validators/ingredient';
import { createRecipeValidator } from '#validators/recipe';
import { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db'



export default class RecipesController{

  public async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10

    const query = Recipe.query().preload('ingredients', (ingredientQuery) => {
      ingredientQuery.select('id', 'price', 'stock').pivotColumns(['quantity']) // Inclua pivotColumns(['quantity'])
    })

    const recipes = await query.paginate(page, limit)
    
    // Calcular o preço total de cada receita
    const recipesWithPrices = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      cuisine: recipe.cuisine,
      image: recipe.image,
      totalPrice: (recipe.ingredients.reduce((acc, ingredient) => acc+ingredient.price*ingredient.$extras.pivot_quantity,0)) * 1.06

    }))

    return view.render('pages/home/index', { recipes: recipesWithPrices })
  }

  
  public async show({ params, view, response }: HttpContext) {
    const recipeId = params.id;
  
    try {
      // Busca a receita pelo ID e faz o preload dos ingredientes
      const recipe = await Recipe.query()
        .where('id', recipeId)
        .preload('ingredients', (ingredientQuery) => {
          ingredientQuery.select('id', 'name', 'price','unit','image').pivotColumns(['quantity']);
        })
        .first();
  
      // Verifica se a receita existe
      if (!recipe) {
        return response.status(404).send('Receita não encontrada.');
      }
  
      // Calcula o preço total da receita
      const totalPrice = recipe.ingredients.reduce(
        (total, ingredient) =>
          total + ingredient.price * ingredient.$extras.pivot_quantity,
        0
      );
  
      // Prepara os dados da receita para serem enviados à view
      const recipeDetails = {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        instructions: recipe.instructions,
        cuisine: recipe.cuisine,
        image: recipe.image,
        totalPrice,
        ingredients: recipe.ingredients.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.name,
          unit: ingredient.unit,
          price: ingredient.price,
          image: ingredient.image,
          quantity: ingredient.$extras.pivot_quantity,
        })),
      };
  
      // Renderiza a página com os detalhes da receita
      return view.render('pages/showRecipe', { recipe: recipeDetails });
    } catch (error) {
      console.error(error);
      return response.status(500).send('Erro ao buscar a receita.');
    }
  }
  
  

  async store({ request, response }: HttpContext) {

    
    const payload = request.only(['title', 'description','instructions','cuisine', 'image'])
    
    const data = await createRecipeValidator.validate(payload)
   
    const ingredients = request.input('ingredients') // Array com os ingredientes e suas quantidades
   
    try {
      // Verifica se a receita já existe pelo título
      const existingRecipe = await Recipe.findBy('title', data.title)
      if (existingRecipe) {
        return response.status(409).json({ error: 'Receita com esse título já existe' })
      }
  
      // Cria a nova receita
      const recipe = await Recipe.create(data)
    
      const ingredientData: { [key: number]: { quantity: number } } = {}
    
      for (const ingredient of ingredients) {

        const ingredientAuth = await createIngredientValidator.validate(ingredient)
        // Busca ou cria o ingrediente
        const ingredientInstance = await Ingredient.firstOrCreate(
          { name: ingredientAuth.name },
          { description: ingredientAuth.description, unit: ingredientAuth.unit, price: ingredientAuth.price, image: ingredientAuth.image }
        )
    
        // Armazena o ID e a quantidade para inserir na tabela de junção
        ingredientData[ingredientInstance.id] = { quantity: ingredientAuth.quantity }
      }
    
      // Associa os ingredientes à receita com as quantidades
      await recipe.related('ingredients').attach(ingredientData)
    
      // Carrega os ingredientes associados e retorna a receita completa
      await recipe.load('ingredients')
    
      return response.redirect().toRoute('recipes.index')
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao criar a receita' })
    }
  }

  async create({ view }: HttpContext) {
   
    return view.render('pages/createRecipe')

  }

  async destroy({ params, response}: HttpContext) {

    const recipeId = params.id;

    try {
      // Verifica se a receita existe
      const recipe = await Recipe.findOrFail(recipeId);
  
      // Apaga os registros relacionados na tabela recipe_ingredients diretamente
      await db.from('recipe_ingredients').where('recipe_id', recipeId).delete();
  
      // Apaga a receita
      await recipe.delete();
  
      return response.status(200).json({
        message: 'Receita e seus ingredientes foram apagados com sucesso.',
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        error: 'Erro ao apagar a receita.',
        details: error.message,
      });
    } 
  }

  public async stock({ view }: HttpContext) {

    try {
      // Busca todos os ingredientes do banco de dados
      const ingredients = await Ingredient.all()

      // Renderiza a view 'ingredients/index' passando os ingredientes
      return view.render('pages/stock', { ingredients })
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error)
      return view.render('errors/500', { error: 'Erro ao carregar os ingredientes.' })
    }
  }


  public async updateStock({ request, response }: HttpContext) {
    try {
      const ingredientsJson = request.input('ingredients') // Isso é uma string
      const ingredientsToUpdate = JSON.parse(ingredientsJson) as Array<{ id: number; stock: number }>
  
      if (!Array.isArray(ingredientsToUpdate)) {
        return response.status(400).json({
          status: 'error',
          message: 'A lista de ingredientes deve ser um array',
        })
      }
  
      for (const ingredient of ingredientsToUpdate) {
        console.log('Recebido do front-end:', ingredient)
        // Verifica se o objeto tem id e stock
        if (!ingredient.id || ingredient.stock === undefined) {
          return response.status(400).json({
            status: 'error',
            message: 'Cada ingrediente deve ter um id e um estoque',
          })
        }
  
        await Ingredient.query()
          .where('id', ingredient.id)
          .update({ stock: ingredient.stock })
      }
  
      return response.redirect().toRoute('recipes.stock')
  
    } catch (error) {
      console.error('Erro ao atualizar o estoque:', error)
      return {
        status: 'error',
        message: 'Erro ao atualizar o estoque. Verifique os logs do servidor.',
      }
    }
  }
  
  public async destroy({ params, response }: HttpContext) {
    const recipeId = params.id

    try {
      // Busca a receita pelo ID
      const recipe = await Recipe.findOrFail(recipeId)

      // Remove os relacionamentos na tabela `recipe_ingredients`
      await recipe.related('ingredients').detach()

      // Apaga a receita
      await recipe.delete()

      return response.status(200).json({ message: 'Receita e relacionamentos apagados com sucesso!' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Erro ao apagar a receita' })
    }
  }
}

  
  
