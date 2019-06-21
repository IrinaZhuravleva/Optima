var syntax        = 'sass', // Syntax: sass or scss;
		gulpversion   = '4'; // Gulp version: 3 or 4

var gulp          = require('gulp'),
		// gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		htmlbeautify = require('gulp-html-beautify'),
		pug = require('gulp-pug'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		rsync         = require('gulp-rsync'),
		imageResize   = require('gulp-image-resize'),
		imagemin      = require('gulp-imagemin'),
		del           = require('del');

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

// Sass|Scss Styles
gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

// JS
gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/mmenu/js/jquery.mmenu.all.min.js',
		'app/libs/equalHeights/equalheights.js',
		'app/libs/fotorama/fotorama.js',
		'app/libs/selectize/js/standalone/selectize.min.js',
		'app/libs/owl.carousel/owl.carousel.min.js',
		
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

//PUG
gulp.task('pug', function(){
	return gulp.src('app/pug/*.pug')
		.pipe(pug())
		.pipe(htmlbeautify(htmlbeautifyOptions))
		.pipe(gulp.dest('app'))
		//важно
		.pipe(browserSync.reload({stream: true}))
});

var htmlbeautifyOptions = {
	"indent_size": 1,
	"indent_char": "	",
	"eol": "\n",
	"indent_level": 0,
	"indent_with_tabs": true,
	"preserve_newlines": false,
	"max_preserve_newlines": 10,
	"jslint_happy": false,
	"space_after_anon_function": false,
	"brace_style": "collapse",
	"keep_array_indentation": false,
	"keep_function_indentation": false,
	"space_before_conditional": true,
	"break_chained_methods": false,
	"eval_code": false,
	"unescape_strings": false,
	"wrap_line_length": 0,
	"wrap_attributes": "auto",
	"wrap_attributes_indent_size": 4,
	"end_with_newline": false
};

// HTML Live Reload

// gulp.task('code', function() {
// 	return gulp.src('app/*.html')
// 	.pipe(browserSync.reload({ stream: true }))
// });

// Deploy
gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

// Images @x1 & @x2 + Compression | Required graphicsmagick (sudo apt update; sudo apt install graphicsmagick)
// gulp.task('imgx1', function() {
// 	return gulp.src('app/img/_src/**/*.*')
// 	.pipe(imageResize({ width: '50%' }))
// 	.pipe(imagemin())
// 	.pipe(gulp.dest('app/img/@1x/'))
// });
// gulp.task('imgx2', function() {
// 	return gulp.src('app/img/_src/**/*.*')
// 	.pipe(imageResize({ width: '100%' }))
// 	.pipe(imagemin())
// 	.pipe(gulp.dest('app/img/@2x/'))
// });

// Clean @*x IMG's

// gulp.task('cleanimg', function() {
// 	return del(['app/img/@*'], { force:true })
// });

// If Gulp Version 3
if (gulpversion == 3) {

	gulp.task('img', ['imgx1', 'imgx2']);

	gulp.task('watch', ['styles', 'scripts', 'img', 'browser-sync'], function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
		gulp.watch('app/*.html', ['code']);
		gulp.watch('app/img/_src/**/*', ['img']);
	});
	gulp.task('default', ['watch']);

};

// If Gulp Version 4
if (gulpversion == 4) {

	// gulp.task('img', gulp.parallel('imgx1', 'imgx2'));

	gulp.task('watch', function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
		gulp.watch('app/pug/**/*.pug', gulp.parallel('pug'));
		// gulp.watch('app/*.html', gulp.parallel('code'));
		// gulp.watch('app/img/_src/**/*', gulp.parallel('img'));
	});
	gulp.task('default', gulp.parallel('styles', 'pug', 'scripts', 'browser-sync', 'watch'));
	// gulp.task('default', gulp.parallel('img', 'styles', 'pug', 'scripts', 'browser-sync', 'watch'));

};
