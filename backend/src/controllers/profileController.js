import Profile from "../models/profile.js";

class ProfileController {

    static async obtenerPerfil(req,res) {

        const userId = parseInt(req.params.id);

        if(isNaN(userId)) {
            return res.status(400).json({error: "El ID no es válido"});
        }


        try {

            const perfil = await Profile.getByUserId(userId);

            if(!perfil) {
                return res.status(400).json({error: "No se ha podido encontrar el usuario"});
            }

            res.status(200).json(perfil);

        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Error al obtener el perfil"});
        }
    }


    static async actualizarPefil(req,res) {
        
        const userId = parseInt(req.params.id);
        const { first_name, last_name1, last_name2, email } = req.body;

        if (isNaN(userId) || !first_name || !last_name1 || !email) {
            return res.status(400).json({ error: "Datos no válidos o incompletos" });
        }

        try {
            const result = await Profile.actualizarPerfil(userId, {
                
                first_name,
                last_name1,
                last_name2,
                email,
            });

        res.status(200).json({ success: true, updated: result.affectedRows });
        
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar el perfil" });
        }

  }
}

export default ProfileController;