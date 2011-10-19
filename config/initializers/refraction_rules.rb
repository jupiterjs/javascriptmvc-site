Refraction.configure do |req|
  case req.path
    when %r{^\/docs\/(.*)\.html$} ; req.permanent! "/docs.html#!#{$1}"
  end
  case req.query
    when %r{^_escaped_fragment_=(.*)$} ; req.respond!(200, {'Content-Type' => 'text/html'}, File.read("public/html/#{$1}.html"))
  end
end