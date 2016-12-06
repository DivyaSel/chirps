import {inject} from 'aurelia-framework';
import {DataServices} from './data-services';

@inject(DataServices)

export class Users { 
    constructor(data){
        this.data = data;
    }

setUser(user) {
        this.selectedUser = user;
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
  async followUser(userId, followId){
         if(userId && followId){
            var obj = {_id: followId};
            try{
                let serverResponse = await this.data.put(obj, this.data.USER_SERVICE + '/follow/' + userId);
                return serverResponse;
         } catch (error) {
                console.log(error);
                return undefined;
            }
        }
    }
     async save(user){
        if(user){
            try{
                let serverResponse = await this.data.post(user, this.data.USER_SERVICE);
                return serverResponse;
             } catch (error) {
                console.log(error);
                return undefined;
            }
        }
    }
    async findUser(){
    let serverResponse = await this.users.getPersonScreenName(this.searchScreenName);
    this.notMe = true;
    if(serverResponse && !serverResponse.error) {
      let response = await this.chirps.getUsersChirps(serverResponse._id);
        if (response.error) {
          this.wallMessage = "Error retrieving chirps";
        }
     }
  }
}