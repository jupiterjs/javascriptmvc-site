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

namespace :deploy do
	task :update do
		announce 'Pulling latest DoneJS-Site...'

		sh 'git pull git@github.donejs/javascriptmvc-site.git'
		sh 'git submodule update --init --recursive'
		sh 'git submodule foreach git pull origin master'

		Dir.chdir('javascriptmvc') do
			sh 'git submodule update --init --recursive'
			sh 'git submodule foreach git pull origin master'
		end
	end

	task :build do
		announce 'Building docs and compressing site...'

		Dir.chdir('javascriptmvc') do
			sh './js jmvc/scripts/doc.js'
			sh './js jmvc/site/scripts/build.js'
			sh './js documentjs/jmvcdoc/scripts/build.js'
		end
	end

	task :jquerymx do
		announce 'Building jquerymx...'

		Dir.chdir('public') do
			sh './js jquery/build.js'
			sh './js jquery/buildAll.js'
		end
	end

	task :commit_jmvc do
		announce 'Committing JavaScriptMVC changes...'

		Dir.chdir('javascriptmvc') do
			sh 'git add .'
			sh 'git commit -m "Updating JavaScriptMVC with latest build. - Automated message from JavaScriptMVC-Site."'
			sh 'git push origin master'
		end
	end

	task :copy do
		announce 'Copying files to local directory...'

		ignored_extensions = []
		ignored_files = ['.git', '.gitignore', '.DS_Store', '.gitmodules']

		Find.find('javascriptmvc') do |file|
			basename = File.basename file
			dirname = File.dirname file
			extname = File.extname file

			#TODO: Simplify the below logic.
			if (File.directory?(file) && (/\.git/ =~ file).nil? || (/\.git/ =~ dirname).nil?) &&
				(!ignored_extensions.include?(extname) && !ignored_files.include?(basename))
					#puts dirname
					new_path = 'public/' + dirname.gsub(/javascriptmvc(\/)?/, '') + '/' + basename
					new_path = new_path.gsub(/\/\//, '/')

					puts new_path
					if File.directory? file
						FileUtils.rm_rf new_path
						FileUtils.mkdir new_path
					elsif
						FileUtils.cp file, new_path
					end
			end
		end
	end

	task :commit_site do
		announce 'Committing site changes...'
		sh 'git add .'
		sh 'git commit -m "Updating from source."'
		sh 'git push git@github.com:jupiterjs/javascriptmvc-site.git master'

		announce 'Cleaning up git...'
		sh 'git fsck'
		sh 'git gc'
		sh 'git repack'
	end

	task :prepare => [:update, :build, :commit_jmvc, :copy, :commit] do
		puts
		puts 'Preparing to deploy...'
		puts
	end

	task :staging => [:prepare] do
		announce 'Deploying to staging...'

		sh 'git push git@heroku.com:staging-javascriptmvc.git'
	end

	task :production => [:prepare] do
		announce 'Deploying to production...'

		sh 'git push git@heroku.com:javascriptmvc.git'
	end
end