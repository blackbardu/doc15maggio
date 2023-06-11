import React from 'react';
import { NavLink } from 'react-router-dom';
import FormCoordinatore from '../components/Forms/FormCoordinatore'

const Coordinatore = () => {
  return (
    <div>
      <div className="title">Coordinatore</div>
      <NavLink to="/tabelle" className="btn btn-success">Compila le tabelle</NavLink>
      <br></br>
      <br></br>
      <NavLink to="/allegati" className="btn btn-success">Inserisci gli allegati</NavLink>
      <FormCoordinatore></FormCoordinatore>
    </div>
  );
};

export default Coordinatore;
