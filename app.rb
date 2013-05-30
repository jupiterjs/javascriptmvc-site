require "sinatra"
require "json"

set :static, true
set :public_folder, "public"

get "/" do
	File.read(File.join("public", "index.html"))
end

get "/docs/" do
	File.read(File.join("public/docs", "index.html"))
end

get "/docs" do
	redirect "/docs/"
end

get "/docs.html" do
	redirect "/docs/"
end