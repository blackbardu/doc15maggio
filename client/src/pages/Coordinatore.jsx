import React from 'react';
import { NavLink } from 'react-router-dom';

const Coordinatore = () => {
  return (
    <div>
      <div className="title">Coordinatore</div>
      <NavLink to="/tabelle" className="btn btn-success">Compila le tabelle</NavLink>
    </div>
  );
};

export default Coordinatore;
