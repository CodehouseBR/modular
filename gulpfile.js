var gulp = require('gulp'),
	domSrc = require('gulp-dom-src'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-cssmin'),
	uglify = require('gulp-uglify'),
	htmlmin = require('gulp-htmlmin'),
	cheerio = require('gulp-cheerio');

gulp.task('css', function() {
	return domSrc({ file: 'index.html', selector: 'link', attribute: 'href' })
		.pipe(concat('style.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('dist/css/'));
});

gulp.task('js', function() {
	return domSrc({ file: 'index.html', selector: 'script', attribute: 'src' })
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/src/'));
});

gulp.task('html', function() {
	return gulp.src('index.html')

		.pipe(concat('index.html'))

		.pipe(cheerio(function($) {
			$('script').remove();
			$('link').remove();
			$('body').append('<script src="src/app.min.js"></script>');
			$('head').append('<link rel="stylesheet" href="css/style.min.css">');
		}))

		.pipe(htmlmin({ 
			collapseWhitespace: true,
			removeComments: true
		}))

		.pipe(gulp.dest('dist/'));
});

gulp.task('build', ['css','js','html']); 