const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String,required: true},
    date: {type: Date, default: Date.now}
    
},{
    timestamps: true // Almacena la fecha de creacion
});

// Metodos del esquema
userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
}

userSchema.methods.matchPassword = async function (password) {
    const comp = await bcrypt.compare(password, this.password);
    return comp;
}




module.exports = mongoose.model('User', userSchema);