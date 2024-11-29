import { sha256 } from "js-sha256";

class Utils {
  static toasts = [];
  static listeners = [];
  static offline_mode = false;

  static superpass =  process.env.REACT_APP_API_SUPER_PASS;
  static usecache = false;

  // Simply check a password for testing PWA Tyres implementation
  // TODO: Testing implementation for PWA. Works Partially. 
  // Delete this var and give user correct permissions ot put it in backend.
  static checkSuperUserPass(pass){

    if(sha256(pass) === this.superpass){
      return true;
    }
    return false;
  }

  static addToast(message, type) {
    this.toasts.push({ id: Date.now() + this.toasts.length, message, type, show: true });
    this.notifyListeners();
  }

  static deleteToast(toast) {
    this.toasts = this.toasts.filter(item => item !== toast);
    this.notifyListeners();
  }

  static subscribe(listener) {
    this.listeners.push(listener);
  }

  static unsubscribe(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  static notifyListeners() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  static formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  static getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  static formatNumberWithComma(number) {
    return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  static getDecorationLog(operation){
    let result;
    switch (operation) {
      case "Crear":
        result = "#C5F7BA";
        break;
      case "Eliminado":
        result = "#F7BABA"
        break;
      case "Cambio":
        result = "#F7F3BA"
        break;
      case "Modificado":
        result = "#BAD3F7"
        break;
        
    
      default:
        break;
    }

    return result;

  }
}

export default Utils;