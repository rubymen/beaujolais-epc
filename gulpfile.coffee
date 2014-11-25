require('dotenv').load()

gulp        = require('gulp')
runSequence = require('run-sequence')
clean       = require('gulp-clean')
connect     = require('gulp-connect')
modRewrite  = require('connect-modrewrite')
sftp        = require('gulp-sftp')
usemin      = require('gulp-usemin')
jade        = require('gulp-jade')
stylus      = require('gulp-stylus')
uglify      = require('gulp-uglify')
minifyCss   = require('gulp-minify-css')
wiredep     = require('wiredep').stream

paths =
  jade: 'app/**/*.jade'
  stylus: 'app/styles/**/*.styl'
  images: 'app/images/**/*'
  fonts: 'app/fonts/**/*'

gulp.task 'clean', ->
  gulp.src('dist', read: false)
      .pipe(clean())

gulp.task 'connect', ->
  connect.server
    root: 'dist'
    livereload: true
    port: 8081
    middleware: (connect) ->
      [
        modRewrite ['!\\.html|\\.js|\\.css|\\.png|\\.jpg$ /index.html [L]']
        connect().use(
          '/bower_components'
          connect.static('./bower_components')
        )
        connect.static('app')
      ]

gulp.task 'usemin', ->
  gulp.src('dist/index.html')
      .pipe(usemin
        css: [minifyCss()]
        js: [uglify()]
      )
      .pipe(gulp.dest('dist'))

gulp.task 'jade', ->
  gulp.src(paths.jade)
      .pipe(jade())
      .pipe(gulp.dest('dist'))

gulp.task 'stylus', ->
  gulp.src(paths.stylus)
      .pipe(stylus(use: require('nib')()))
      .pipe(gulp.dest('dist/styles'))
      .pipe(connect.reload())

gulp.task 'images', ->
  gulp.src(paths.images)
      .pipe(gulp.dest('dist/images'))

gulp.task 'fonts', ->
  gulp.src(paths.fonts)
      .pipe(gulp.dest('dist/fonts'))

gulp.task 'bower', ->
  gulp.src('app/index.jade')
      .pipe(wiredep(ignorePath: /\.\.\//))
      .pipe(gulp.dest('app'))

gulp.task 'watch', ->
  gulp.watch(paths.jade, ['jade'])
  gulp.watch(paths.stylus, ['stylus'])
  gulp.watch(paths.images, ['images'])
  gulp.watch(paths.fonts, ['fonts'])


gulp.task 'deploy', ->
  runSequence 'clean', 'bower', ['jade', 'stylus', 'images', 'fonts'], 'usemin', ->
    gulp.src('dist/**/*')
        .pipe(sftp
          host: process.env.SERV_HOST
          user: process.env.SERV_USER
          key: process.env.SERV_KEY
          remotePath: process.env.SERV_PATH
        )

gulp.task 'default', ->
  runSequence 'clean', 'bower', ['jade', 'stylus', 'images', 'fonts'], ['connect', 'watch']
