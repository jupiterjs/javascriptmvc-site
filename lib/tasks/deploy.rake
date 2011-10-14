require 'find'

namespace :deploy do
	def print_status(message)
		puts
		puts '========================================='
		puts message
		puts '========================================='
		puts
	end

	task :update do
		print_status 'Updating source from git...'

		Dir.chdir('../javascriptmvc') do
			sh 'git checkout jmvc/docs.html'
			sh 'git pull origin master'
			sh 'git submodule update --recursive'
		end
	end

	task :build do
		print_status 'Building docs...'

		Dir.chdir('../javascriptmvc') do
			sh './js jmvc/scripts/doc.js'
		end
	end

	task :copy do
		print_status 'Copying files to local directory...'

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
						FileUtils.rm_rf new_path, :noop => false
						FileUtils.mkdir new_path, :noop => false
					elsif
						FileUtils.cp file, new_path, :noop => false
					end
			end
		end
	end

	task :commit do
		print_status 'Committing changes...'

		#sh 'git commit -am "Updating from source."'
	end

	task :prepare => [:update, :build, :copy, :commit] do
		print_status 'Preparing to deploy...'
	end

	task :staging => [:prepare] do
		print_status 'Deploying to staging...'

		#sh 'git push staging master'
	end

	task :production => [:prepare] do
		print_status 'Deploying to production...'

		#sh 'git push heroku master'
	end
end