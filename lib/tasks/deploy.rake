# This is a temporary build script and makes the following assumptions:
# - The javascriptmvc directory is one directory up. For example, from this root directory: cd ../javascriptmvc
# - Two git remotes are assumed to exist:
# => heroku: git@heroku.com:javascriptmvc.git
# => staging: git@heroku.com:growing-mountain-3217.git //or any heroku instance you choose

# You can run from this app's root directory with:
# => rake deploy:staging //deploys to staging remote
# => rake deploy:production //deploys to heroku remote

# Optional commands(by default these do not run)
# => rake deploy:staging["crawl","examples"] //runs crawl and getjs for example applications. Array can be any combination of "crawl" and "examples".


require 'find'

namespace :option do
	task :crawl do
		announce 'Running crawl script...'

		Dir.chdir('../javascriptmvc') do
			sh './js jmvc/scripts/crawl.js'
		end

		echo 'Done.'
	end

	task :examples do
		announce 'Updating example applications...'

		Dir.chdir('public') do
			sh './js steal/getjs player'
			sh './js steal/getjs srchr'
			sh './js steal/getjs todo'
			sh './js steal/getjs contacts'
		end

		echo 'Done.'
	end
end

namespace :deploy do
	def announce(message)
		puts
		puts '========================================='
		puts message
		puts '========================================='
		puts
	end

	def echo(message)
		puts
		puts message
		puts
	end

	task :update do
		announce 'Updating source from git...'

		Dir.chdir('../javascriptmvc') do
			sh 'git checkout jmvc/docs.html'
			sh 'git pull origin master'
			sh 'git submodule update --recursive'
		end

		echo 'Done.'
	end

	task :build do
		announce 'Building docs and compressing site...'
		Dir.chdir('../javascriptmvc') do
			sh './js jmvc/scripts/doc.js'
			sh './js jmvc/site/scripts/build.js'
		end
		

		echo 'Done.'
	end

	task :copy do
		announce 'Copying files to local directory...'

		ignored_extensions = []
		ignored_files = ['.git', '.gitignore', '.DS_Store', '.gitmodules']

		Find.find('../javascriptmvc') do |file|
			basename = File.basename file
			dirname = File.dirname file
			extname = File.extname file

			if (File.directory?(file) && (/\.git/ =~ file).nil? || (/\.git/ =~ dirname).nil?) &&
				(!ignored_extensions.include?(extname) && !ignored_files.include?(basename))
					new_path = 'public/' + dirname.gsub(/\.\.\/javascriptmvc/, '').gsub(/^\//, '') + '/' + basename

					if File.directory? file
						FileUtils.rm_rf new_path
						FileUtils.mkdir new_path
					elsif
						FileUtils.cp file, new_path
					end
			end
		end

		echo 'Done.'
	end

	task :commit do
		announce 'Committing changes...'
		sh 'git add .'
		sh 'git commit -am "Updating from source."'

		echo 'Done.'

		announce 'Cleaning up git...'
		sh 'git fsck'
		sh 'git gc'
		sh 'git repack'

		echo 'Done.'
	end

	task :prepare => [:update, :build, :copy, :commit] do
		puts
		puts 'Preparing to deploy...'
		puts
	end

	task :staging => [:prepare] do
		announce 'Deploying to staging...'

		#a hack while we migrate to github
		sh 'git push staging master --force'
		echo 'Done.'
	end

	task :production => [:prepare] do
		announce 'Deploying to production...'

		sh 'git push heroku master --force'
		echo 'Done.'
	end
end