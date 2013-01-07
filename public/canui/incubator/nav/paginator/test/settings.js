var path = new java.io.File(".").getCanonicalPath();
var browserURL = "file:///"+path.replace("\\", "/")+"/paginator/";

SeleniumDefaults = {
	// the domain where selenium will run
    serverHost: "localhost",
	// the port where selenium will run
    serverPort: 4444,
	// the domain/url where your page will run from (change if not filesystem)
    browserURL: browserURL
    //browserURL: "file:///C:/development/framework/funcunit/"
}

// the list of browsers that selenium runs tests on
SeleniumBrowsers = ["*firefox"]

EmailerDefaults = {
    host: "smtp.myserver.com",
    port: 25,
    from: "myemail@gmail.com",
    to: "myemail@gmail.com",
    subject: "Test Logs"
}