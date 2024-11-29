//Class for handle users in app
import { faCircleDot, faOilCan, faUser } from "@fortawesome/free-solid-svg-icons";
import Permission from "./permission";


class User {


  constructor(id, username, userpassword, permission) {
    this.id = id;
    this.username = username;
    this.userpassword = userpassword;
    this.permission = permission;
  }
  setField(field, value) {
    this[field] = value;
  }
  getName() {
    return this.username;
  }

  getPassword() {
    return this.userpassword;
  }
  getPermission(){
    return this.permission;
  }
 
  getPermissionType(TypeMode, TypePerm){
    let comp = TypePerm << TypeMode;
    let res = 0;
    res = this.permission & comp; 
    if(res>0){
      return true;
    }else{
      return false;
    }
  }

  eraseAllPermission(){
    this.permission = this.permission & 0;
  }

  setAllPermission(TypeMode){
    let perm = Permission.READ | Permission.CREATE | Permission.MODIFY | Permission.DELETE; 
    perm = perm << TypeMode*4;
    this.permission = this.permission | perm;
  }


  getNamePermissions(){
    const name = [];
    if(this.getPermissionType(Permission.USERS, Permission.ALLTYPE)){
      name.push(faUser);
    }
    if(this.getPermissionType(Permission.TYRES, Permission.ALLTYPE)){
      name.push(faCircleDot);
    }
    if(this.getPermissionType(Permission.OIL, Permission.ALLTYPE)){
      name.push(faOilCan);
    }
    return name;
  }

}

export default User;