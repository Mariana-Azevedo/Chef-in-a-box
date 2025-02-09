import User from '#models/user'
import { createUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  index(){

  }
  
  create({ view }: HttpContext) {
    return view.render('pages/criarConta')
  }

   async store({request, response }: HttpContext) {
     const payload = await request.all()
     const data = await createUserValidator.validate(payload)

     const user = new User()
     user.merge(data)
     await user.save()
     return response.redirect().toRoute('auth.create')
   }

  public async patch({ request, response, params }: HttpContext) {
    const userId = params.id;

    try {
      // Busca o usuário ou lança erro se não encontrado
      const user = await User.findOrFail(userId);

      // Atualiza os dados diretamente usando `merge`
      const payload = request.all();
      const updatedData = await createUserValidator.validate(payload)
      user.merge(updatedData);

      console.log(updatedData.fullName)

      // Salva as alterações
      await user.save();

      return response.redirect().toRoute('users.profile', {id: user.id})

    } catch (error) {
      console.error(error);
      return response.status(500).json({
        error: 'Erro ao atualizar o usuário.',
        details: error.message,
      });
    }
  }

  public async profile({ view, params, auth }: HttpContext) {
    console.log(params.id)
    // const userId = params.id;
    const {user} = auth

    const returnUser ={
      fullName: user?.fullName,
      email: user?.email,
      id: user?.id,
    } 
    
    return view.render('pages/user/profile', { returnUser })
  }


  public async admin({ params, response, view }: HttpContext) {
    try {
      // Encontre o usuário pelo ID fornecido
      const user = await User.findOrFail(params.id);

      // Atualize o papel do usuário para "admin"
      user.admin = true;
      await user.save();

      return view.render('pages/user/permissions');

      return response.status(200).send({ message: `Usuário ${user.fullName} agora é administrador.` });
    } catch (error) {
      return response.status(400).send({ error: 'Erro ao promover o usuário a admin.', details: error.message });
    }

   }

  public async listNonAdmins({ response }: HttpContext) {
    const nonAdmins = await User.query().whereNot('role', 'admin');
    return response.status(200).send(nonAdmins);
  }
  
  
  
}

