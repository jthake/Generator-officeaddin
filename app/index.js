'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');
var guid = require('uuid');

module.exports = yeoman.Base.extend({
	// The name `constructor` is important here
	constructor: function () {
		// Calling the super constructor is important so our generator is correctly set up
		yeoman.Base.apply(this, arguments);
		
		// Next, add your custom code
		this.option('coffee'); // This method adds support for a `--coffee` flag
	},
  
	init: function() {
		this.log(yosay('Welcome command line junkies to the Office add-in generator!'));
		this.templatedata = {};
	},
  
	askFor: function() {
		var done = this.async();
		
		var prompts = [{
		  type: 'list',
		  name: 'type',
		  message: 'What type of add-in do you want to create?',
		  choices: [{
		      name: 'Angular JS standalone web application',
		      value: 'angular'
		    }, {
		      name: 'Mail add-in',
		      value: 'mail'
		    }, {
		      name: 'Task Pane add-in',
		      value: 'taskpane'
		    }, {
		      name: 'Content add-in',
		      value: 'content'
		    }
		  ]
		}];
		
		this.prompt(prompts, function(props) {
			this.templatedata.type = props.type;
			done();
		}.bind(this));
	}
	,
	
	askForName: function() {
		var done = this.async();
		var prompts = [{
		  name: 'applicationName',
		  message: 'What\'s the name of your add-in?'
		}];
		this.prompt(prompts, function(props) {
		  this.templatedata.applicationName = props.applicationName;
		  done();
		}.bind(this));
	},
	

	askForTenant: function() {
		if (this.templatedata.type == 'angular')
		{
			var done = this.async();
			var prompts = [{
			  name: 'tenantName',
			  message: 'What\'s the name of your tenant?'
			}];
			this.prompt(prompts, function(props) {
			  this.templatedata.tenantName = props.tenantName;
			  done();
			}.bind(this));
		}
	},
	
	askForClientId: function() {
		if (this.templatedata.type == 'angular')
		{
			var done = this.async();
			var prompts = [{
			  name: 'clientId',
			  message: 'What\'s the Azure AD client id?',
			  default: guid.v4()
			}];
			this.prompt(prompts, function(props) {
			  this.templatedata.clientId = props.clientId;
			  done();
			}.bind(this));
		}
	},
  
	writing: function() {		
	    var projectsRoot = path.join(__dirname, '../templates/projects/');
	    this.sourceRoot(projectsRoot + this.templatedata.type);	
		
	    switch (this.templatedata.type) {	
	      case 'angular':
		    this.templatedata.startPage = "/index.html";
		    this.templatedata.startDir = "/";
			
	        this.fs.copy(this.sourceRoot() + '/index.html', this.templatedata.applicationName + '/index.html');
	        this.fs.copy(this.sourceRoot() + '/styles.css', this.templatedata.applicationName + '/styles.css');
	        this.fs.copy(this.sourceRoot() + '/assets', this.destinationPath(this.templatedata.applicationName + '/assets'));
	        this.fs.copy(this.sourceRoot() + '/controllers', this.destinationPath(this.templatedata.applicationName + '/controllers'));
	        this.fs.copy(this.sourceRoot() + '/scripts', this.destinationPath(this.templatedata.applicationName + '/scripts'));
	        this.fs.copy(this.sourceRoot() + '/views', this.destinationPath(this.templatedata.applicationName + '/views'));
			
			//inject the environment settings
			this.fs.copyTpl(this.sourceRoot() + '/scripts/app.js', this.templatedata.applicationName + '/scripts/app.js', this.templatedata);
			this.fs.copyTpl(projectsRoot + '/server.js', this.templatedata.applicationName + '/server.js', this.templatedata);
			this.fs.copyTpl(projectsRoot + '/package.json', this.templatedata.applicationName + '/package.json', this.templatedata);
	        break;
	
	      case 'mail':
		    this.templatedata.startPage = "/AppCompose/Home/home.html";
		    this.templatedata.startDir = "/AppCompose";

	        this.fs.copy(this.sourceRoot() +'/AppCompose/Home', this.destinationPath(this.templatedata.applicationName + '/AppCompose/Home'));
	        this.fs.copy(this.sourceRoot() +'/AppRead/Home', this.destinationPath(this.templatedata.applicationName + '/AppRead/Home'));
	        this.fs.copy(this.sourceRoot() +'/Content', this.destinationPath(this.templatedata.applicationName + '/Content'));
	        this.fs.copy(this.sourceRoot() +'/Images', this.destinationPath(this.templatedata.applicationName + '/Images'));
	        this.fs.copy(this.sourceRoot() +'/Scripts', this.destinationPath(this.templatedata.applicationName + '/Scripts'));
			
			//inject the environment settings
			this.fs.copyTpl(this.sourceRoot() + '/manifest.xml', this.templatedata.applicationName + '/manifest.xml', this.templatedata);
			this.fs.copyTpl(projectsRoot + '/server.js', this.templatedata.applicationName + '/server.js', this.templatedata);
			this.fs.copyTpl(projectsRoot + '/package.json', this.templatedata.applicationName + '/package.json', this.templatedata);
	        break;
			
	      case 'taskpane':
		    this.templatedata.startPage = "/App/Home/home.html";
		    this.templatedata.startDir = "/App";

	        this.fs.copy(this.sourceRoot() +'/App', this.destinationPath(this.templatedata.applicationName + '/App'));
	        this.fs.copy(this.sourceRoot() +'/Content', this.destinationPath(this.templatedata.applicationName + '/Content'));
	        this.fs.copy(this.sourceRoot() +'/Images', this.destinationPath(this.templatedata.applicationName + '/Images'));
	        this.fs.copy(this.sourceRoot() +'/Scripts', this.destinationPath(this.templatedata.applicationName + '/Scripts'));
			
			//inject the environment settings
			this.fs.copyTpl(this.sourceRoot() + '/manifest.xml', this.templatedata.applicationName + '/manifest.xml', this.templatedata);
			this.fs.copyTpl(projectsRoot + '/server.js', this.templatedata.applicationName + '/server.js', this.templatedata);
			this.fs.copyTpl(projectsRoot + '/package.json', this.templatedata.applicationName + '/package.json', this.templatedata);
	        break;
			
	      case 'content':
		    this.templatedata.startPage = "/App/Home/home.html";
		    this.templatedata.startDir = "/App";

	        this.fs.copy(this.sourceRoot() +'/App', this.destinationPath(this.templatedata.applicationName + '/App'));
	        this.fs.copy(this.sourceRoot() +'/Content', this.destinationPath(this.templatedata.applicationName + '/Content'));
	        this.fs.copy(this.sourceRoot() +'/Images', this.destinationPath(this.templatedata.applicationName + '/Images'));
	        this.fs.copy(this.sourceRoot() +'/Scripts', this.destinationPath(this.templatedata.applicationName + '/Scripts'));
			
			//inject the environment settings
			this.fs.copyTpl(this.sourceRoot() + '/manifest.xml', this.templatedata.applicationName + '/manifest.xml', this.templatedata);
			this.fs.copyTpl(projectsRoot + '/server.js', this.templatedata.applicationName + '/server.js', this.templatedata);
			this.fs.copyTpl(projectsRoot + '/package.json', this.templatedata.applicationName + '/package.json', this.templatedata);
	        break;
		}
	},

	end: function() {
		this.log('\r\n');
		this.log('Your project is now created, you can use the following commands to get going');
		this.log(chalk.green('    cd "' + this.templatedata.applicationName + '"'));
		this.log(chalk.green('    npm install'));
		this.log(chalk.green('    node server.js'));
		this.log('\r\n');
	}
   
});
