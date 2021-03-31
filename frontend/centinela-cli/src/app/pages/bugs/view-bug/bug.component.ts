import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Bug } from 'app/models/bug';
import { BugService } from '../../../services/bug.service';
import { NbToastrService } from '@nebular/theme';
import { LoginService } from '../../../services/login.service';
import { UserService } from '../../../services/user.service';
import { UserToList } from 'app/models/user-to-list';
import { FormControl } from '@angular/forms';
import { CentinelaToast } from '../../utils/centinela-toast';

@Component({
  selector: 'ngx-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.scss']
})
export class BugComponent implements OnInit {
  inputItemNgModel:String;
  textareaItemNgModel:String;
  inputItemFormControl = new FormControl();
  textareaItemFormControl = new FormControl();
  isAdmin:Boolean = true;
  editTitleText:String;
  bug:Bug;
  bugId:number;
  lala:number;
  title:string;
  system:string;
  environment:string;
  description:string;
  state:number;
  severity:number;
  developer: string;  
  cssTagCircle:string= "circle";
  circle:string;
  lastStatus:number;
  newState:string;
  editTitle:Boolean=false;
  editDesc:Boolean=false;
  users: Array<UserToList>;
  toast:CentinelaToast;


  constructor(private bugService: BugService, private currentRoute:ActivatedRoute,private route: Router, 
    private toastrService: NbToastrService, private loginService:LoginService, private userService: UserService) { 
      this.toast = new CentinelaToast(toastrService);
  }

  ngOnInit() {
    const id = this.currentRoute.snapshot.paramMap.get('id');   
    this.isAdmin = this.loginService.userIsAdmin();    
    this.bugService.getById(id).subscribe(bug=>{      
        if(bug===null) this.route.navigateByUrl('/error');
        else{                
          this.bug = bug;
          this.bugId = bug.id;
          this.title = bug.title;
          this.description = bug.description;
          this.state = bug.state.id;            
          this.severity = bug.severity;
          this.lastStatus = bug.state.id;        
          this.circle = this.cssTagCircle+bug.severity;                        
          if(bug.environment!=null ) this.environment = bug.environment.name;
          if(bug.system!=null) this.system = bug.system.name;       
          //else this.developer = "Sin asignación";   
          this.userService.getAll().subscribe(users=>{
          this.users = users;              
          if(bug.user!=null) this.developer = bug.user.name;       
  
          });
      
        }            
      },
      error=> { 
        this.route.navigateByUrl('/error');
      }  
    )
    
  }

  changeTitle(event){
    this.title = event.target.value; 
  }
  changeDescription(event){
    this.description = event.target.value; 
  }

  editTitleOnClick(){
    this.editTitle=true;
  }

  saveTitleOnClick(){
    this.editTitle=false;
    this.bug.title = this.title;
    this.updateBug();
  }

  editDescOnClick(){
    this.editDesc=true;
  }
  saveDescOnClick(){
    this.editDesc=false;
    this.bug.description = this.description;
    this.updateBug();
  }
  
  
  onMenuItemSelectedSeverity(idNewSeverity):void{    
    this.bug.severity = idNewSeverity;
    this.circle = this.cssTagCircle+idNewSeverity;      
    this.updateBug();
  }

  updateBug():void{
    this.bugService.updateBug(this.bug).subscribe(
      bugUpdated=>{
        if(bugUpdated!=null){
          this.toast.showToast(1, "Ok", "El error fué modificado con éxito" );          
          //this.lastStatus = idNewState;
        }
        else{          
          this.newState = "Fue resuelto";
          this.toast.showToast(3, "No Ok", "No se pudo modificar" );
        }
    },
      error=>{        
        this.newState = "Fue resuelto";
        this.toast.showToast(4, "No Ok", "Hubo un error al modificar" );
        
      }
    )
  }

  onMenuItemSelected(idNewState):void{    
    this.bug.state.id = idNewState;
    this.bug.stateId = idNewState;       
    this.updateBug();
  }

  onMenuUserSelected(newUser):void{    
    this.users.forEach(user => {
      if(newUser===user.name){
        this.bug.user = user;    
      }
    });    
    this.updateBug();
  }

}

