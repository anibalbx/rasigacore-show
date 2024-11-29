/*About permissions:
  the permissions in the app are given by data bits 1-> enabled permission 0->disabled permission
  first data byte -> User permission [DELETE, MODIFY, CREATE, READ]
  second data bye -> Tyres permissions [DELETE, MODIFY, CREATE, READ]

  Example:
  0000 1111 -> All user permissions but no tyre 
  1111 0000 -> All tyre permissions but no user
  0001 0001 -> Only read user and read tyres

  The permissions are autenticated by backend
*/
class Permission {
  //Type permissions
  static READ = 1;
  static CREATE = 2;
  static MODIFY = 4;
  static DELETE = 8;
  static ALLTYPE = this.READ|this.CREATE|this.MODIFY|this.DELETE;
  //Mode of permissions
  static USERS = 0;
  static TYRES = 4;
  static OIL = 8;
}

export default Permission;