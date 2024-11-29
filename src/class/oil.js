class Oil{
  constructor(id, brand, model, type, capacity, stock, location, ref, pvp, desc){
    this.id = id;
    this.brand = brand;
    this.model = model;
    this.type = type;
    this.capacity = capacity;
    this.stock = stock;
    this.location = location;
    this.ref = ref;
    this.pvp = pvp;
    this.desc = desc;
    this.isEmpty = this.isEmpty.bind(this);
    this.getColorFromLocation = this.getColorFromLocation.bind(this);
  }

   isEmpty(){
    if(
      this.brand=== "" ||
      this.model === "" ||
      this.type === "" ||
      this.capacity.toString() === "0" ||
      this.capacity.toString() === "" ||
      this.stock.toString() === "" ||
      this.location.toString() === "" || 
      this.desc < 0 || this.desc > 100){
      return true;
    }else{
      return false;
    }
  }
  getColorFromLocation () {
    switch (this.location) {
      case "rasiga":
        return "#325c96";
      case "sumagrib":
        return "#32963c";
      default:
        break;
    }

  }



}export default Oil