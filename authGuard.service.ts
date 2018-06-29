import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthGuardService {
    
    private readonly apiURL =  environment.apihost; 
    
    constructor( 
        private httpClient: HttpClient,
    ) {  
    }

    getCurrentUserRole(): any {  
        return this.httpClient.get<any>(`${this.apiURL}currentUser`)  
    }  


}