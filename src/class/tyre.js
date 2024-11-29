
class Tyre{
  constructor(id, brand, model, size, stock, iccv, type, visual, reserved){
  this.id = id;
  this.brand=brand;
  this.model = model;
  this.size=size;
  this.stock=stock;
  this.iccv=iccv;
  this.type=type;
  this.visual = visual;
  this.reserved = reserved;
  this.getVisualFromSize.bind(this);
  this.getColorFromType.bind(this);
  this.isEmpty.bind(this);
  this.cleanTyre.bind(this);

  }
  
  getId(){
    return this.id;
  }
  getBrand(){
    return this.brand;
  }

  getModel(){
    return this.model;
  }
  getSize(){
    return this.size;
  }
  getStock(){
    return this.stock;
  }
  getIccv(){
    return this.iccv;
  }
  getType(){
    return this.type;
  }
  getVisual(){
    return this.visual;
  }
  //return if some var is empty
 isEmpty(){
    if(this.brand.length === 0 ||
      this.model.length === 0||
      this.size.length === 0 ||
      this.stock === 0 ||
      this.iccv.length === 0 ||
      this.type.length === 0 ||
      this.visual.length === 0){
      return true;
    }else{
      return false;
    }

  }
  //clean tyre
  cleanTyre(){
    this.id = 0;
    this.brand = '';
    this.size = '';
    this.stock = 0;
    this.iccv = '';
    this.type = '';
    this.visual = '';
  }
  getColorFromType () {
    switch (this.type) {
      case "turismo":
        return "#325c96";
      case "4x4":
        return "#de92c5";
      case "agricola":
        return "#32963c";
      case "furgoneta":
        return "#8084ed";
      case "camion":
        return "#b780ed";
      case "moto":
        return "#3a916c";
      case "rft":
        return "#b5b5b5";
      case "quad":
        return "#ff4242";
      default:
        break;
    }

  }
  //000/00R00
  getVisualFromSize(){
    if(this.visual){
      if(this.visual==="Sin formato"){
        return this.size;
      }
      if(this.visual.length>0 && this.size.length>0){
        let result="";
        let visual_pos=0;
        for(let i=0;i<this.visual.length;i++){
          if(this.visual[i]==='0'){
            let character = this.size.charAt(visual_pos);
            result = result.concat(character);
            visual_pos++;
          }else{
            result = result.concat(this.visual.charAt(i));
          }
        }
        return result;
      }

    }
  }
  
} export default Tyre;