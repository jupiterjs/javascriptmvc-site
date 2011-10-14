require 'find'

namespace :deploy do
	task :update do
		puts '==================================='
		puts 'Updating source from git...'
		puts '==================================='

		Dir.chdir('../javascriptmvc') do
			sh 'git pull origin master'
			sh 'git submodule update --recursive'
		end
	end

	task :build do
		puts '==================================='
		puts 'Building docs...'
		puts '==================================='

		Dir.chdir('../javascriptmvc') do
			sh './js jmvc/scripts/docs.js'
		end
	end

	task :copy do
		puts '==================================='
		puts 'Copying files to local directory...'
		puts '==================================='

		ignored_extensions = ['.jar', '.bat']
		ignored_files = ['.git', '.gitignore', 'js', '.DS_Store', '.gitmodules']

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
	end

	task :commit do
		puts '==================================='
		puts 'Committing changes...'
		puts '==================================='

		#sh 'git commit -am "Updating from source."'
	end

	task :prepare => [:update, :build, :copy, :commit] do
		puts '==================================='
		puts 'Preparing to deploy...'
		puts '==================================='
	end

	task :staging => [:prepare] do
		puts '==================================='
		puts 'Deploying to staging...'
		puts '==================================='

		#sh 'git push staging master'
	end

	task :production => [:prepare] do
		puts '==================================='
		puts 'Deploying to production...'
		puts '==================================='

		#sh 'git push heroku master'
	end
end