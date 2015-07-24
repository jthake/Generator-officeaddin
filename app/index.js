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
		this.log(yosay('Welcome to the marvellous Office add-in generator!'));
		this.templatedata = {};
	},
  
	askFor: function() {
		var done = this.async();
		
		var prompts = [{
		  type: 'list',
		  name: 'type',
		  message: 'What type of add-in do you want to create?',
		  choices: [{
		      name: 'Angular JS based',
		      value: 'angular'
		    }, {
		      name: 'HTML based',
		      value: 'html'
		    }
		  ]
		}];
		
		this.prompt(prompts, function(props) {
			this.type = props.type;
			
			done();
		}.bind(this));
	},
	
	askForName: function() {
		var done = this.async();
		var app = '';
		switch (this.type) {
			case 'angular':
				app = 'angular';
				break;
			case 'html':
				app = 'html';
				break;
		}
		var prompts = [{
		  name: 'applicationName',
		  message: 'What\'s the name of your add-in?',
		  default: app
		}];
		this.prompt(prompts, function(props) {
		  this.applicationName = props.applicationName;
		  done();
		}.bind(this));
	},
	
	askForTenant: function() {
		var done = this.async();
		var prompts = [{
		  name: 'tenantName',
		  message: 'What\'s the name of your tenant?'
		}];
		this.prompt(prompts, function(props) {
		  this.templatedata.tenantName = props.tenantName;
		  done();
		}.bind(this));
	},
	
	askForClientId: function() {
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
	},
  
	writing: function() {
	    this.sourceRoot(path.join(__dirname, './templates/projects'));
	
	    switch (this.type) {	
	      case 'angular':
	        this.sourceRoot(path.join(__dirname, '../templates/projects/' + this.type));
	        this.fs.copy(this.sourceRoot() + '/index.html', this.applicationName + '/index.html');
	        this.fs.copy(this.sourceRoot() + '/styles.css', this.applicationName + '/styles.css');
	        this.fs.copy(this.templatePath('/assets'), this.destinationPath(this.applicationName + '/assets'));
	        this.fs.copy(this.templatePath('/controllers'), this.destinationPath(this.applicationName + '/controllers'));
	        this.fs.copy(this.templatePath('/scripts'), this.destinationPath(this.applicationName + '/scripts'));
	        this.fs.copy(this.templatePath('/views'), this.destinationPath(this.applicationName + '/views'));
			
			//inject the environment settings
			this.fs.copyTpl(this.templatePath('/scripts/app.js'), this.applicationName + '/scripts/app.js', this.templatedata);
	        break;
	
	      case 'html':
	        this.sourceRoot(path.join(__dirname, '../templates/projects/' + this.type));
	        this.fs.copy(this.sourceRoot() + '/index.html', this.applicationName + '/index.html');
	        break;
		}
	},

	end: function() {
		this.log('\r\n');
		this.log('Your project is now created, you can use the following commands to get going');
		this.log(chalk.green('    cd "' + this.applicationName + '"'));
		this.log('\r\n');
	}
   
});
