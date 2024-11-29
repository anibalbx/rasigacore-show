import Tyre from "./tyre";
import Utils from "./utils";
import Oil from "./oil";
import { setItem, getItem } from "./db";
import User from "./user";
import Reserve from "./reserve";


class DatabaseService {
  constructor() {
    this.tyreurl = process.env.REACT_APP_API_TYRE_URL;
    this.sessionurl =  process.env.REACT_APP_API_SESSION_URL;
    this.userurl =  process.env.REACT_APP_API_USER_URL;
    this.oilurl =  process.env.REACT_APP_API_OIL_URL;
    this.reservationurl =  process.env.REACT_APP_API_RESERVATION_URL;
  }

  async getTyre(id) {
    try {
      const formData = new FormData();
      formData.append("operation", 2);
      formData.append("id", id);

      const response = await fetch(this.tyreurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al obtener los neumáticos');
      }
      const data = await response.json();
      const tyre = new Tyre(data[0].ID, data[0].MARCA, data[0].MODELO,
        data[0].MEDIDA, data[0].STOCK, data[0].ICCV, data[0].TIPO, data[0].VISUAL)
      return tyre;
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
      throw error;
    }
  }
  async getSearchTyres(search, value, order, nostock) {

    //Offline mode PWA
    if (Utils.offline_mode) {
      const cachedData = await getItem('Tyres');
      let filterdata;
      if (cachedData) {

        switch (search) {
          case 'MEDIDA':
            filterdata = cachedData.filter(obj => obj.MEDIDA === value);
            break;
          case 'MARCA':
            filterdata = cachedData.filter(obj => obj.MARCA.toLowerCase().includes(value.toLowerCase()));
            break;
          case 'MODELO':
            filterdata = cachedData.filter(obj => obj.MODELO.toLowerCase().includes(value.toLowerCase()));
            break;

          default:
            break;
        }

        switch (order) {
          case "MARCA":
            filterdata = filterdata.sort((a, b) => {
              if (a.MARCA < b.MARCA) return -1;
              if (a.MARCA > b.MARCA) return 1;
              return 0;
            });

            break;
          case "STOCK DESC":
            filterdata = filterdata.sort((a, b) => b.STOCK - a.STOCK);
            break;
          default:
            break;
        }


        if (!nostock) {
          filterdata = filterdata.filter(obj => obj.STOCK > 0);
        }
        const tyres = filterdata.map(obj => new Tyre(obj.ID, obj.MARCA,
          obj.MODELO, obj.MEDIDA, obj.STOCK, obj.ICCV, obj.TIPO, obj.VISUAL));

        return tyres;
      } else {
        Utils.addToast("Error de cache", "danger");
        return [];
      }
    }

    //Online mode
    try {
      nostock = nostock ? 1 : 0;
      const formData = new FormData();
      formData.append("operation", 7);
      formData.append("search", search);
      formData.append("value", value);
      formData.append("order", order);
      formData.append("nostock", nostock);

      const response = await fetch(this.tyreurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });

      if (response.status === 204) {
        return [];
      }
      if (!response.ok) {
        Utils.addToast("Error al obtener los neumáticos", "danger");
        return [];
      }
      const data = await response.json();


      const ids = data.map(tyre => tyre.ID);  
      let reservations = {};
      try {
        reservations = await this.getNumberReservationsArray(ids);  // Fetch all reservations in one call
      } catch (error) {
        Utils.addToast("Error fetching reservations", "danger");
      }

      const tyres=[];

      for (let i = 0; i < data.length; i++) {
        tyres.push(new Tyre(
          data[i].ID, 
          data[i].MARCA,
          data[i].MODELO, 
          data[i].MEDIDA, 
          data[i].STOCK, 
          data[i].ICCV, 
          data[i].TIPO,
          data[i].VISUAL, 
          reservations[i]));
        
      }

       return tyres;
    } catch (error) {
      Utils.addToast("Error de conexión", "danger");
      return [];
    }

  }
  async getTyres(nostock) {
    if (navigator.onLine) {
      try {
        nostock = nostock ? 1 : 0;
        const formData = new FormData();
        formData.append("operation", 3);
        formData.append("nostock", nostock);
        const response = await fetch(this.tyreurl, {
          method: 'POST',
          mode: "cors",
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Error al obtener los neumáticos');
        }
        const data = await response.json();
        const tyres = data.map(obj => new Tyre(obj.ID, obj.MARCA,
          obj.MODELO, obj.MEDIDA, obj.STOCK, obj.ICCV, obj.TIPO, obj.VISUAL));
        return tyres;
      } catch (error) {
        console.error('Error en la solicitud GET:', error);
        throw error;
      }

    }
  }
  //Function for load cache tyre from server. PWA Implementation
  async loadCache() {
    if (navigator.onLine) {
      try {
        const formData = new FormData();
        formData.append("operation", 3);
        formData.append("nostock", 1);
        const response = await fetch(this.tyreurl, {
          method: 'POST',
          mode: "cors",
          body: formData,
        });
        if (!response.ok) {
          Utils.addToast("Error al cargar cache", "danger");
        }
        const data = await response.json();
        await setItem('Tyres', data);
        let date = new Date();
        await setItem('Date', date);
      } catch (error) {
        console.error('Error en la solicitud GET:', error);
        Utils.addToast("Error " + error, "danger");
   
      }

    }
  }

  async addTyre(brand, model, size, stock, iccv, type, visual) {
    try {
      const formData = new FormData();
      formData.append("operation", 1);
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("size", size);
      formData.append("stock", stock);
      formData.append("iccv", iccv);
      formData.append("type", type);
      formData.append("visual", visual);

      const response = await fetch(this.tyreurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async editTyre(id, brand, model, size, stock, iccv, type, visual) {
    try {
      const formData = new FormData();
      formData.append("operation", 4);
      formData.append("id", id);
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("size", size);
      formData.append("stock", stock);
      formData.append("iccv", iccv);
      formData.append("type", type);
      formData.append("visual", visual);

      const response = await fetch(this.tyreurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async deleteTyre(id) {
    try {
      const formData = new FormData();
      formData.append("operation", 5);
      formData.append("id", id);
      const response = await fetch(this.tyreurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        this.deleteReserveTyre(id);
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log("Error en la solicitud POST:" + error);
      return false;
    }

  }
  async updateStockTyre(id, units) {
    try {
      const formData = new FormData();
      formData.append("operation", 6);
      formData.append("id", id);
      formData.append("units", units);

      const response = await fetch(this.tyreurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {

        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log('Error en la solicitud POST: ' + error);
      return false;
    }

  }
  async getLog() {
    try {
      const formData = new FormData();
      formData.append("operation", 8);
      const response = await fetch(this.tyreurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al obtener los neumáticos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
      throw error;
    }
  }
  async getTyreLogSearch(search, value, valuesec) {
    try {
      //Check if date and add +1 day
      if (search === "DATE") {
        let fecha = new Date(valuesec);
        fecha.setDate(fecha.getDate() + 1);
        valuesec = Utils.formatDate(fecha);
      }

      const formData = new FormData();
      formData.append("operation", 9);
      formData.append("search", search);
      formData.append("value", value);
      formData.append("valuesec", valuesec);

      const response = await fetch(this.tyreurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        Utils.addToast("Error al obtener Log", "danger");
        return [];
      }
      const data = await response.json();
      return data;
    } catch (error) {
      Utils.addToast("Error de conexión: " + error, "danger");
      return [];
    }
  }

  async getOilLogSearch(search, value, valuesec) {
    try {
      //Check if date and add +1 day
      if (search === "DATE") {
        let fecha = new Date(valuesec);
        fecha.setDate(fecha.getDate() + 1);
        valuesec = Utils.formatDate(fecha);
      }

      const formData = new FormData();
      formData.append("operation", 6);
      formData.append("search", search);
      formData.append("value", value);
      formData.append("valuesec", valuesec);

      const response = await fetch(this.oilurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        Utils.addToast("Error al obtener Log", "danger");
        return [];
      }
      const data = await response.json();
      return data;
    } catch (error) {
      Utils.addToast("Error de conexión: " + error, "danger");
      return [];
    }
  }

  async checkSession() {

    try {
      const response = await fetch(this.sessionurl, { method: "POST" });
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      Utils.addToast(error.message, "warning");
      return false;
    }
  }

  async updateUser(id, username, userpassword, userpermission) {

    try {
      //update bd, only updates pass if user gives one
      const formData = new FormData();

      formData.append("id", id);
      formData.append("username", username);
      if(userpassword!==""){
        formData.append("userpassword", userpassword);
      }
      formData.append("permissions", userpermission);
      formData.append("operation", 8);

      
      const response = await fetch(this.userurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });

      if (response.status === 201) {
        
        return true;

      } else {
       
        return false;
      }

    } catch (error) {
      
      return false;
      
    }

  }

  createUser(user, closeModal) {


    //insert bd
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("userpassword", user.userpassword);
    formData.append("permissions", user.permission);
    formData.append("operation", 2);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    fetch(this.userurl, requestOptions)
      .then((response) => {
        if (response.status === 201) {
          Utils.addToast("Usuario añadido", "success");
          closeModal();
        } else {
          Utils.addToast("Usuario no añadido compruebe usuario duplicado"+ 
            " y si ha ingresado correctamente los datos.", "danger");

        }
      })

      .catch((error) => {
        Utils.addToast("Error de red", "danger");

      });
  }
  async deleteUser(id) {
    try {
      const formData = new FormData();
      formData.append("operation", 9);
      formData.append("id", id);
      const response = await fetch(this.userurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log("Error en la solicitud POST:" + error);
      return false;
    }

  }

  async checkPermission(type, mode) {

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("mode", mode);
      formData.append("operation", 6);
  

      const response = await fetch(this.userurl, { 
        method: "POST",
        mode: "cors",
        body: formData, });


      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      Utils.addToast(error.message, "warning");
      return false;
    }
  }

  async getUsers(){
    try {
      const formData = new FormData();
      formData.append("operation", 7);
      const response = await fetch(this.userurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      const user = data.map(obj => new User(obj.ID ,obj.USERNAME,obj.PASSWORD,obj.PERMISSION));
      return user;
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
      throw error;
    }

  }


  login(user, checkReminder, navigate) {
    const formData = new FormData();

    formData.append('username', user.username);
    formData.append('userpassword', user.userpassword);
    formData.append('operation', 1);


    const requestOptions = {
      method: 'POST',
      body: formData
    };


    fetch(this.userurl, requestOptions)
      .then(response => {
        if (response.status === 200) {
          checkReminder();
          Utils.offline_mode = false;
          navigate("/MainMenuView");
        } else {
          Utils.addToast("Usario no encontrado", "danger");

        }
      })

      .catch(error => {
        Utils.addToast("Error de red", "danger");

      });
  }

  logout(navigate) {
    Utils.sessionuser = new User("","",0);
    if (!navigator.onLine) {
      navigate("/");
      return;
    }
    const formData = new FormData();

    formData.append('operation', 3);


    const requestOptions = {
      method: 'POST',
      body: formData
    };

    fetch(this.userurl, requestOptions)
      .then(response => {
        if (response.status === 200) {
          navigate("/");

        } else {
          Utils.addToast("Error cerrando sesion", "danger");

        }
      })

      .catch(error => {
        Utils.addToast("Error de red", "danger");


      });
  }

  checkSuperUser(pass, setActiveModal) {

    const formData = new FormData();

    formData.append('pass', pass);
    formData.append('operation', 4);


    const requestOptions = {
      method: 'POST',
      body: formData
    };


    fetch(this.userurl, requestOptions)
      .then(response => {
        if (response.status === 200) {
          setActiveModal(true);
        } else {
          Utils.addToast("Contraseña erronea", "danger");
        }
      })

      .catch(error => {
        Utils.addToast("Error de red", "danger");

      });

  }

  async addOil(brand, model, type, capacity,
    stock, location, reference, pvp, desc) {
    try {
      const formData = new FormData();
      formData.append("operation", 1);
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("type", type);
      formData.append("capacity", capacity);
      formData.append("stock", stock);
      formData.append("location", location);
      formData.append("reference", reference);
      formData.append("pvp", pvp);
      formData.append("desc", desc);

      const response = await fetch(this.oilurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getSearchOil(search, value, order, location, nostock) {
    try {
      nostock = nostock ? 1 : 0;
      const formData = new FormData();
      formData.append("operation", 2);
      formData.append("search", search);
      formData.append("value", value);
      formData.append("order", order);
      if (location.toString().length > 0) {
        formData.append("location", location);
      }
      formData.append("nostock", nostock);

      const response = await fetch(this.oilurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });

      if (response.status === 204) {
        return [];
      }
      if (!response.ok) {

        return [];
      }
      const data = await response.json();
      const oil = data.map(obj => new Oil(obj.ID, obj.MARCA,
        obj.MODELO, obj.TIPO, obj.LITROS, obj.STOCK, obj.UBICACION,
        obj.REFERENCIA, obj.PVP, obj.DESCUENTO));
      return oil;
    } catch (error) {
      return [];
    }
  }

  async updateOilUnits(id, units) {
    try {
      const formData = new FormData();
      formData.append("operation", 3);
      formData.append("id", id);
      formData.append("units", units);

      const response = await fetch(this.oilurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {

        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log('Error en la solicitud POST: ' + error);
      return false;
    }

  }
  async deleteOil(id) {
    try {
      const formData = new FormData();
      formData.append("operation", 4);
      formData.append("id", id);
      const response = await fetch(this.oilurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log("Error en la solicitud POST:" + error);
      return false;
    }

  }
  async getOil(id) {
    try {
      const formData = new FormData();
      formData.append("operation", 2);
      formData.append("id", id);

      const response = await fetch(this.oilurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al obtener los neumáticos');
      }
      const data = await response.json();
      const oil = new Oil(data[0].ID, data[0].MARCA,
        data[0].MODELO, data[0].TIPO, data[0].LITROS, data[0].STOCK, data[0].UBICACION,
        data[0].REFERENCIA, data[0].PVP, data[0].DESCUENTO)
      return oil;
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
      throw error;
    }
  }
  async updateOil(oil) {

    try {
      const fdata = new FormData();
      fdata.append("operation", 5);
      fdata.append("brand", oil.brand);
      fdata.append("model", oil.model);
      fdata.append("type", oil.type);
      fdata.append("stock", oil.stock);
      fdata.append("capacity", oil.capacity);
      fdata.append("location", oil.location);
      fdata.append("reference", oil.ref);
      fdata.append("pvp", oil.pvp);
      fdata.append("desc", oil.desc);
      fdata.append("id", oil.id);

      const respose = await fetch(this.oilurl, {
        method: 'POST',
        mode: "cors",
        body: fdata,
      });

      if (respose.status === 201) {
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }

  }

  async addReservation(idtyre, number, destination, date, pvp) {
    try {

      const formData = new FormData();
      formData.append("operation", 1);
      formData.append("idtyre", idtyre);
      formData.append("units", number);
      formData.append("date", date);
      formData.append("destination", destination);
      formData.append("pvp", parseFloat(pvp).toFixed(2));
      
      const response = await fetch(this.reservationurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getReservations(idtyre){
    try {
      const formData = new FormData();
      formData.append("operation", 2);
      formData.append("idtyre", idtyre);
      const response = await fetch(this.reservationurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al obtener las reserva');
      }
      const data = await response.json();
      const rese = data.map(obj => new Reserve(obj.ID, obj.ID_TYRE, parseInt(obj.NUMBER),
         obj.USER, obj.DATE, obj.DESTINATION, parseFloat(obj.PVP).toFixed(2)));
      return rese;
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
      throw error;
    }

  }

  async deleteReserve(id) {
    try {
      const formData = new FormData();
      formData.append("operation", 3);
      formData.append("id", id);
      const response = await fetch(this.reservationurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log("Error en la solicitud POST:" + error);
      return false;
    }

  }

  async editeservation(id, number, destination, date, pvp) {
    try {

      const formData = new FormData();
      formData.append("operation", 4);
      formData.append("id", id);
      formData.append("units", number);
      formData.append("date", date);
      formData.append("destination", destination);
      formData.append("pvp",  parseFloat(pvp).toFixed(2));
      
      const response = await fetch(this.reservationurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  
  async deleteReserveTyre(idtyre) {
    try {
      const formData = new FormData();
      formData.append("operation", 5);
      formData.append("idtyre", idtyre);
      const response = await fetch(this.reservationurl, {
        method: 'POST',
        body: formData,
      });
      if (response.status === 201) {
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log("Error en la solicitud POST:" + error);
      return false;
    }

  }

  async getNumberReservations(idtyre){
    try {
      const formData = new FormData();
      formData.append("operation", 6);
      formData.append("idtyre", idtyre);
      const response = await fetch(this.reservationurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al obtener las reserva');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
      throw error;
    }

  }

  async getNumberReservationsArray(ids){
    try {
      const formData = new FormData();
      formData.append("operation", 7);
      for (let i = 0; i < ids.length; i++) {
        formData.append("idtyres[]",  ids[i]);
      }
      const response = await fetch(this.reservationurl, {
        method: 'POST',
        mode: "cors",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al obtener las reserva');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
      throw error;
    }

  }



} export default DatabaseService