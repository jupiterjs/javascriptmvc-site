#!/bin/sh

VERSION=$1

[ "x$VERSION" = "x" ] && echo "Usage: $0 version" && exit

# create a temp directory
DOWNLOAD=`mktemp -d -t jmvc`

(
cd $DOWNLOAD

# grab all the jmvc parts and sanitize their git files
wget -O- https://github.com/jupiterjs/javascriptmvc/tarball/v$VERSION | tar -xf -
JMVC=jupiterjs-javascriptmvc-*
rm $JMVC/{.gitignore,.gitmodules}

wget -O- https://github.com/jupiterjs/jquerymx/tarball/v$VERSION | tar -xf -
JQUERYMX=jupiterjs-jquerymx-*
rm $JQUERYMX/.gitignore

wget -O- https://github.com/jupiterjs/steal/tarball/v$VERSION | tar -xf -
STEAL=jupiterjs-steal-*
rm $STEAL/.gitignore

wget -O- https://github.com/jupiterjs/documentjs/tarball/v$VERSION | tar -xf -
DOCUMENTJS=jupiterjs-documentjs-*
rm $DOCUMENTJS/.gitignore

wget -O- https://github.com/jupiterjs/funcunit/tarball/v$VERSION | tar -xf -
FUNCUNIT=jupiterjs-funcunit-*
rm $FUNCUNIT/{.gitignore,.gitmodules}

wget -O- https://github.com/jupiterjs/syn/tarball/v$VERSION | tar -xf -
SYN=jupiterjs-syn-*
rm $SYN/.gitignore

# build the master download
	(
	BUILD=javascriptmvc-$VERSION
	mkdir $BUILD

	cp $JMVC/{README,MIT-LICENSE.txt,changelog.md,js,js.bat} $BUILD/

	cp -r $JQUERYMX $BUILD/jquery

	cp -r $STEAL $BUILD/steal

	cp -r $DOCUMENTJS $BUILD/documentjs

	cp -r $FUNCUNIT $BUILD/funcunit
	rm -rf $BUILD/funcunit/syn
	cp -r $SYN $BUILD/funcunit/syn

	cd $BUILD
	zip -r ../$BUILD.zip *
	)

# build the stealjs download
	(
	BUILD=stealjs-$VERSION
	mkdir $BUILD

	cp $JMVC/{js,js.bat} $BUILD/

	cp -r $STEAL $BUILD/steal

	cd $BUILD
	zip -r ../$BUILD.zip *
	)

# build the documentjs download
	(
	BUILD=documentjs-$VERSION
	mkdir $BUILD

	cp $JMVC/{js,js.bat} $BUILD/

	mkdir $BUILD/steal
	cp $STEAL/{steal,steal.production}.js $BUILD/steal
	cp -r $STEAL/{browser,dev,rhino} $BUILD/steal

	cp -r $DOCUMENTJS $BUILD/documentjs

	cd $BUILD
	zip -r ../$BUILD.zip *
	)

# build the funcunit download
	(
	BUILD=funcunit-$VERSION
	mkdir $BUILD

	cp $JMVC/{js,js.bat} $BUILD/

	mkdir $BUILD/steal
	cp $STEAL/{steal,steal.production}.js $BUILD/steal
	cp -r $STEAL/{browser,dev,rhino} $BUILD/steal

	cp -r $FUNCUNIT $BUILD/funcunit
	rm -rf $BUILD/funcunit/syn
	cp -r $SYN $BUILD/funcunit/syn

	cp $FUNCUNIT/template.html $BUILD/
	cp -r $FUNCUNIT/test/autosuggest $BUILD/demo

	sed -i '' -e 's|funcunit/test/autosuggest|demo|' \
	          -e 's|\.\./\.\./\.\./|\.\./|' \
	          -e 's|\.\./\.\./|\.\./funcunit/|' \
	              $BUILD/demo/*.{html,js}

	cd $BUILD
	zip -r ../$BUILD.zip *
	)
)

# copy the zips and clean up
mv $DOWNLOAD/javascriptmvc-$VERSION.zip .
mv $DOWNLOAD/stealjs-$VERSION.zip .
mv $DOWNLOAD/documentjs-$VERSION.zip .
mv $DOWNLOAD/funcunit-$VERSION.zip .

rm -rf $DOWNLOAD
