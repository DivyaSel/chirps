import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {Chirps} from '../resources/data/chirps';
import {Users} from '../resources/data/users';

@inject(Router,AuthService,Chirps,Users)
export class Wall 
{
  DATE_FORMAT_TABLE = "MMM Do YYYY";

 constructor(router,auth,chirps,users)
 {
     this.router = router;
     this.message = 'Chirps';
     this.chirps = chirps;
     this.users = users;
     this.auth = auth;
     this.newChirp;
     this.wallMessage="";
     this.saveStatus="";
 }
async activate() {
    await this.getChirps();
    }

async getChirps() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.users.setUser(this.user);
    let serverResponse = await this.chirps.getUsersChirps(this.user._id);
    if (serverResponse.error) {
      this.wallMessage = "Error retrieving chirps";
    }
}
async findUser(){
    let serverResponse = await this.users.getPersonScreenName(this.searchScreenName);
    this.notMe = true;
    if(!serverResponse.error) {
      //line 37!!!
      this.users.setUser(serverResponse);//to find user by screenName  
      await this.chirps.getUsersChirps(serverResponse._id);
    }
  }

  async openUser(screenName){
    let serverResponse = await this.users.getPersonScreenName(screenName);
    this.notMe = true;
    if(!serverResponse.error) {
      this.users.setUser(serverResponse);  
      await this.chirps.getUsersChirps(serverResponse._id);
    }
    }

async follow(){
    await this.users.followUser(this.user._id, this.users.selectedUser._id);
  }

 async home(){
    this.notMe = false;
    await this.chirps.getUsersChirps(this.user._id);
  }


 async chirp() {
    if (this.newChirp) {
      var chirp = {
        chirp: this.newChirp,
        user: this.user._id,
        chirpAuthor: this.user._id
      }
      let serverResponse = await this.chirps.saveChirp(chirp);
      if (serverResponse && !serverResponse.error) {
        this.newChirp = "";
        this.saveStatus = "";
         this.chirps.chirpArray[0].chirpAuthor = new Object();
         this.chirps.chirpArray[0].chirpAuthor = {email : this.user.email,firstName: this.user.firstName,lastName: this.user.lastName, screenName: this.user.screenName};
         //let serverResponse = await this.chirps.getUsersChirps(this.user._id);
      } else {
        this.saveStatus = "Error saving chirp";
      }
    }
  }
like(index){
    this.chirps.like(this.chirps.chirpArray[index]._id);
    this.chirps.chirpArray[index].likes++;
  }

  async reChirp(chirp){
    var newChirp = {
      chirp: chirp.chirp,
      user: this.user._id,
      reChirp: true,
      chirpAuthor: this.user._id
    };
    let serverResponse = await this.chirps.saveChirp(newChirp);
      if (serverResponse && !serverResponse.error) {
           this.saveStatus = "";
          this.chirps.chirpArray[0].chirpAuthor = new Object();
         this.chirps.chirpArray[0].chirpAuthor = {email : this.user.email,firstName: this.user.firstName,lastName: this.user.lastName, screenName: this.user.screenName};
      } else {
        this.saveStatus = "Error saving chirp"; 
     }
  }

  logout(){
    sessionStorage.removeItem('user');
    this.auth.logout();
}

home(){
    this.router.navigate('home');
}
}