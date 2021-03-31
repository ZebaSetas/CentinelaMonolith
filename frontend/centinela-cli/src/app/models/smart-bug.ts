import { Bug } from './bug';
import { environment } from '../../environments/environment.prod';

export class SmartBug {    
    id:number;
    numberBug:string;
    title: string;    
    severity: number;
    developer: string;
    state: string;        
    system:string;
    environment:string;
    constructor(bug:Bug){                        
        this.id = bug.id;
        this.numberBug = "#"+bug.id;
        if(bug.title!=null) {
            this.title = bug.title.substring(0,30);
            if(bug.title.length>20){
                this.title += "...";
            }
        }        
        this.severity = bug.severity;
        if(bug.user != null){
            this.developer = bug.user.name.substring(0,30);
            if(bug.user.name.length > 30){
                this.developer += "...";
            }
        }
        else
            this.developer = '';
        if(bug.state!=null){
            this.state = bug.state.value;
        }
        if(bug.system!=null)this.system = bug.system.name;
        if(bug.environment!=null)this.environment = bug.environment.name;
    }
}
