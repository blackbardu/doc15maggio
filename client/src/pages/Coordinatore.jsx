import React from 'react';
import { NavLink } from 'react-router-dom';
import FormCoordinatore from '../components/Forms/FormCoordinatore'

const Coordinatore = () => {
  return (
    <div>
      <div className="title">Coordinatore</div>
      <NavLink to="/tabelle" className="btn btn-success">Compila le tabelle</NavLink>
      <FormCoordinatore pageName="coordinatore"></FormCoordinatore>
    </div>
  );
};

export default Coordinatore;
