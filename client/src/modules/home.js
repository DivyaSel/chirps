import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {Users} from '../resources/data/users';
import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules
} from 'aurelia-validation';
import {BootstrapFormRenderer} from '../resources/utils/bootstrap-form-renderer';

@inject(Router,AuthService,Users,ValidationControllerFactory)
export class Home
{
 constructor(router,auth,users,controllerFactory)
 {
     this.router = router;
     this.auth = auth;
     this.users = users;
     this.message = 'Chirps';
     this.loginError="";
     this.email;
     this.password;
     this.showLogon = true;
     this.registerError="";
     this.controller = controllerFactory.createForCurrentScope();
     this.controller.addRenderer(new BootstrapFormRenderer());  
 }

  login() {
    return this.auth.login(this.email, this.password)
      .then(response => {
          sessionStorage.setItem("user", JSON.stringify(response.user));
          this.loginError = "";
          this.router.navigate('wall');
      })
      .catch(error => {
        console.log(error);
        this.loginError = "Invalid credentials.";
      });
  };

  showRegister(){
    this.showLogon = !this.showLogon;
  }

  async save() {
    let result = await this.controller.validate();
    if (result.length === 0) {
      var user = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        screenName: this.screenName,
        password: this.password
      }
      let serverResponse = await this.users.save(user);
      if (!serverResponse.error) {
        this.registerError = "";
        this.showLogon = true;
      } else {
        this.registerError = "There was a problem registering the user."
      }
    }
  }

    async getPersonScreenName(name) {
        if(name){
            try {
                let serverResponse = await this.data.get(this.data.USER_SERVICE + "/screenName/" + name);
                return serverResponse;
            } catch (error) {
                console.log(error);
                return undefined;
            }
        }
    }
}

ValidationRules  
	.ensure(a => a.firstName).required()
	.ensure(a => a.lastName).required()  
	.ensure(a => a.email).required().email()  
	.ensure(a => a.screenName).required()
  .ensure(a => a.password).required()  
	.on(Home);
