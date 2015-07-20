var models = require('../models/models.js');


// GET /quizes/statistic
exports.index = function(req, res) {
    
 var estadisticas = {
		numPreguntas: 0,numComentarios : 0,comentariosMedios: 0,sinComentarios: 0,conComentarios: 0
	};
 var index,j=0;
 models.Quiz.findAll().then(
     function(quizes){
         estadisticas.numPreguntas=quizes.length;
         models.Comment.findAll({where: ["publicado = TRUE "]}).then(
             function (comments){
                estadisticas.numComentarios=comments.length;
//                models.sequelize.query('select count(*) n from "Quizzes" where "id" in (select distinct Q."id" from "Quizzes" Q join "Comments" C on (Q."id" = C."QuizId"))').then(
//                models.sequelize.query('select distinct Q."id" as quiz_dist from "Quizzes" Q join "Comments" C on (Q."id" = C."QuizId")').then(
              
//                    console.log ("+++SIN COMENTARIO: "+ consulta[0].n + " -[" + consulta.length + "]");
                    models.Quiz.findAll({include: [ { model: models.Comment, as: models.Comment.tableName, required: true ,where: ["publicado = TRUE "]}]}).then(
                    function (consulta){
                        estadisticas.conComentarios=consulta.length;
                        estadisticas.sinComentarios=estadisticas.numPreguntas-estadisticas.conComentarios;
                        estadisticas.comentariosMedios=(estadisticas.numComentarios/estadisticas.numPreguntas).toFixed(2);
                        res.render('quizes/statistic', {estadisticas: estadisticas, errors: []}); 
                });
             }
         )
       
         
     })

}