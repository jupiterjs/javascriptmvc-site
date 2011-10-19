Refraction.configure do |req|
  case req.query
    
    when %r{^_escaped_fragment_=(.*)$} ; req.respond!(200, {'Content-Type' => 'text/html'}, File.read("/html/#{$1}.html"))
  end
end