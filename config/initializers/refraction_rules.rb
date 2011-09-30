Refraction.configure do |req|
  case req.query
    when %r{^_escaped_fragment_=(.*)$} ; req.found! :path => "/html/#{$1}.html", :query => ""
  end
end