import './App.css';
import {Routes, Route} from "react-router-dom"
import LoginView from './view/LoginView';
import TyresView from './view/TyresView';
import CMTyreView from './view/CMTyreView';
import OptionsView from './view/OptionsView';
import DynamicToast from './components/DynamicToast';
import LogView from './view/LogView';
import OilView from './view/OilView';
import CMOilView from './view/CMOilView';
import MainMenuView from './view/MainMenuView';
import ReserveView from './view/ReserveView';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <LoginView /> } />
        <Route path="/TyresView" element={ <TyresView /> } />
        <Route path="/CMTyreView" element={ <CMTyreView /> } />
        <Route path="/OptionsView" element={ <OptionsView /> } />
        <Route path="/LogView" element={ <LogView /> } />
        <Route path='/OilView' element={<OilView/>} />
        <Route path='/CMOilView' element={<CMOilView/>} />
        <Route path='/MainMenuView' element={<MainMenuView/>} />
        <Route path='/ReserveView' element={<ReserveView/>} />

      </Routes>
      <DynamicToast />
    </div>
  );
}

export default App;
