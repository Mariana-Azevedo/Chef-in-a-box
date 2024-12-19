import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const RecipesController = () => import('#controllers/recipes_controller')
const CartsController = () => import('#controllers/carts_controller')


router.on('/').render('pages/home/home').as('home.show').use(middleware.silent());//criar controller
// router.get('/new', [RecipesController, 'create']).as('recipes.create').use([middleware.auth(), middleware.admin()]);

router.get('/login', [AuthController, 'create']).as('auth.create')
router.post('/login', [AuthController, 'store']).as('auth.store')
router.get('/logout', [AuthController, 'destroy']).use(middleware.auth()).as('auth.destroy')

router.post('/cart/store',[CartsController, 'store']).as('cart.store').use(middleware.auth());
router.get('/cart',[CartsController, 'index']).as('cart.index').use(middleware.auth());
router.put('/cart/destroy',[CartsController, 'destroy']).as('cart.destroy').use(middleware.auth());
router.post('/cart/payment',[CartsController, 'payment']).as('cart.payment').use(middleware.auth());

router.get('/test-protected', async ({ auth, response }) => {
  if (auth.isAuthenticated) {
    return response.json({ message: 'Rota protegida acessada com sucesso!', user: auth.user });
  } else {
    return response.unauthorized({ error: 'Usuário não autenticado' });
  }
}).use(middleware.auth());


router
  .group(() => {
    router.get('/create', [UsersController, 'create']).as('users.create')
    //router.get('/:id', [UsersController, 'show']).where('id', router.matchers.number()).as('show')
    router.post('/', [UsersController, 'store']).as('users.store')
    router.post('/:id', [UsersController, 'patch']).as('users.patch').use(middleware.auth());
    router.get('/admin', [UsersController, 'admin']).as('users.admin').use(middleware.admin());
    router.get('/:id', [UsersController, 'profile']).as('users.profile').use(middleware.auth());
  })
  .prefix('users')


router
  .group(() => {
    router.get('/new', [RecipesController, 'create']).as('recipes.create').use([middleware.auth(), middleware.admin()]);
    router.get('/', [RecipesController, 'index']).as('recipes.index').use(middleware.silent());
    router.get('/:id', [RecipesController, 'show']).as('recipes.show').use(middleware.silent());
    router.post('/', [RecipesController, 'store']).as('recipes.store').use(middleware.auth());
    router.delete('/:id',[RecipesController, 'destroy']).as('recipes.destroy' ).use(middleware.auth());
    //router.get('/stock',[RecipesController, 'stock']).as('recipes.stock' ).use(middleware.auth());
  })
  .prefix('recipes')

  router.get('/stock',[RecipesController, 'stock']).as('recipes.stock').use([middleware.auth(), middleware.admin()]);
  router.post('/stock/update',[RecipesController, 'updateStock']).as('recipes.updateStock').use([middleware.auth(), middleware.admin()]);


  // router.get('/home', ({view}) => {
  //   return view.render('pages/home.edge')
  // })

  // router.get('/permissoes', ({view}) => {
  //   return view.render('pages/user/permissions.edge')
  // })


  
  // router.get('/cart', ({view}) => {
  //   return view.render('pages/products/cart.edge')
  // })
 
  //router.get('/criarConta', [RecipesController, 'index']).as('criarConta.edge')

  router.get('/test', async () => {
    return 'Rota funcionando!'
  })

