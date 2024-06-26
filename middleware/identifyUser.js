import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const identifyUser = async (req, res, next)=>{

    //verificar si hay token
    const { _token } = req.cookies
    if(!_token){
        req.user = null
        return next()
    }

    //comprobar el token sea valido
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const user = await User.scope('deletePassword').findByPk(decoded.id)
        if(user){
            req.user = user
        }
       return next();
    } catch (error) {
        console.log(error)
        return res.clearCookie('_token').redirect('/auth/inicio')
    }

}

export default identifyUser