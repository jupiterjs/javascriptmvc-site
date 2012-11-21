require 'find'

def announce(message)
	puts
	puts '========================================================================'
	puts message
	puts '========================================================================'
	puts
end

def echo(message)
	puts
	puts message
	puts
end

def is_ignored(path, ignored)
	ignored.each do |ignore|
		if(path.include? ignore)
			return true
		end
	end

	return false
end

def copy_resources(path)
	ignored = ['.git', 'node_modules', '.DS_Store', '.gitignore', '.gitmodules']

	Find.find(path) do |file|
		basename = File.basename file
		dirname = File.dirname file

		new_path = 'public/' + dirname.gsub(/donejs(\/)?/, '') + '/' + basename
		new_path = new_path.gsub(/\/\//, '/')

		if(File.directory?(file) && !is_ignored(file, ignored))
			puts 'Copying: ' + new_path
			FileUtils.rm_rf new_path
			FileUtils.mkdir new_path
		elsif(!is_ignored(file, ignored))
			puts 'Copying: ' + new_path
			FileUtils.cp file, new_path
		end
	end
end

namespace :deploy do
	task :update do
		announce 'Pulling latest DoneJS-Site...'

		sh 'git pull git@github.com:jupiterjs/javascriptmvc-site.git donejs'
		sh 'git submodule update --init'

		sh 'cd donejs && git pull git@github.com:bitovi/donejs.git'
		sh 'cd donejs && git submodule update --init --recursive'

		sh 'cd examples/todo && git checkout master && git pull git@github.com:jupiterjs/cantodo.git master'
		sh 'cd examples/srchr && git checkout canjs && git pull git@github.com:jupiterjs/srchr.git canjs'
		sh 'cd examples/player && git checkout master && git pull git@github.com:jupiterjs/canplay.git master'
	end

	task :build do
		announce 'Building docs and compressing site...'

		Dir.chdir('donejs') do
			sh './js site/scripts/doc.js'
			sh 'npm install && cd can && grunt latest'
		end
	end

	task :crawl do
		announce 'Running crawl script...'

		Dir.chdir('donejs') do
			sh './js site/scripts/crawl.js'
		end

		echo 'Done.'
	end

	task :copy do
		announce 'Copying files to local directory...'

		copy_resources 'donejs'
		copy_resources 'examples/player'
		copy_resources 'examples/todo'
		copy_resources 'examples/srchr'
	end

	task :commit_site do
		announce 'Committing site changes...'

		sh 'cd donejs && git checkout .'

		sh 'git add . && git commit -am "Updating from source."'
		sh 'git push git@github.com:jupiterjs/javascriptmvc-site.git donejs'

		announce 'Cleaning up git...'
		sh 'git fsck'
		sh 'git gc'
		sh 'git repack'
	end

	task :prepare => [:update, :build, :copy, :commit_site] do
		puts
		puts 'Preparing to deploy...'
		puts
	end

	task :staging => [:prepare] do
		announce 'Deploying to staging...'

		#Adding force as the heroku source history is not relevant
		sh 'git push git@heroku.com:staging-donejs.git donejs:master --force'
	end

	task :production => [:prepare] do
		announce 'Deploying to production...'

		sh 'git push git@heroku.com:donejs.git donejs:master --force'
	end
end
