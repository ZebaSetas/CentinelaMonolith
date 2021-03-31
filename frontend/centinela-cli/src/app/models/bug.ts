
import {State} from './state';
import { UserToList } from './user-to-list';
import { Environment } from './environment';
import { System } from './system';
import { stat } from 'fs';
import { Organization } from './organization';
import { environment } from '../../environments/environment.prod';
import { NbUser } from '@nebular/auth';

export class Bug {
    id: number;
    title: string;
    description:  string;
    severity: number;
    environment:Environment;    
    environmentId:number;
    state: State;    
    stateId:number;
    system:System;    
    user:UserToList;
    constructor(id: number, title: string, description: string, severity: number, state: State, system:System,environment:Environment, user:UserToList){
        this.id = id;
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.state = state;            
        this.stateId = state.id;
        this.system = system;        
        this.environment = environment;        
        this.environmentId = environment.id;   
        this.user = user;
    }
}
