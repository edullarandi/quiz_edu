// Definicion del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
 return sequelize.define(
  	'Quiz',
    { pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Pregunta"}}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Respuesta"}}
      },
		  tema: {
		    	type: DataTypes.ENUM,
		    	values: ['otros', 'humanidades', 'ocio', 'ciencia', 'tecnologia'],
		    	validate: { notEmpty: {msg: "·Falta Tema"}}
      }
    }
  );
}
