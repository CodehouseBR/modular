//Initialize modules
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
 
//Codes directory
var codes = 'src/*.js';
var libs = './lib/*/dist/*.js'

//To validade code syntax
gulp.task('validate', function() {
	gulp.src(files)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});
 
//Criamos outra tarefa com o nome 'dist'
gulp.task('dist', function() {
 
// Carregamos os arquivos novamente
// E rodamos uma tarefa para concatenação
// Renomeamos o arquivo que sera minificado e logo depois o minificamos com o `uglify`
// E pra terminar usamos o `gulp.dest` para colocar os arquivos concatenados e minificados na pasta build/
gulp.src(files)
.pipe(concat('./src'))
.pipe(rename('app.min.js'))
.pipe(uglify())
.pipe(gulp.dest('./src'));
});
 
//Criamos uma tarefa 'default' que vai rodar quando rodamos `gulp` no projeto
gulp.task('default', function() {
 
// Usamos o `gulp.run` para rodar as tarefas
// E usamos o `gulp.watch` para o Gulp esperar mudanças nos arquivos para rodar novamente
gulp.run('lint', 'dist');
gulp.watch(files, function(evt) {
gulp.run('lint', 'dist');
});
});