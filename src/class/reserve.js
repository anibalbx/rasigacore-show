class Reserve {
  constructor(id, idtyre, number, username, date, destination, pvp) {
    this.id = id;
    this.idtyre = idtyre;
    this.number = number;
    this.username = username;
    this.date = date;
    this.destination = destination;
    this.pvp = pvp;
  }

  isEmpty() {
    if (
      this.id === 0 ||
      this.idtyre === 0 ||
      this.number === "" ||
      this.username === "" ||
      this.date === "" ||
      this.destination === "" ||
      this.pvp === "") {
      return true;
    } else {
      return false;
    }
  }

  checkEmptyToAdd(){
    if (
      this.idtyre === 0 ||
      this.number === "" ||
      this.date === "" ||
      this.destination === "" ||
      this.pvp === "") {
      return true;
    } else {
      return false;
    }

  }



} export default Reserve