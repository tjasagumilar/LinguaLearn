import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import './SeznamNalog.css';
import { FaLanguage, FaImages, FaRandom } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { auth } from '../../../Config/firebase';

const SeznamNalog = () => {

 
  return(
   <div>
      <Link to="/generirajNaloge">Go to Exercises</Link>
   </div> 
  )
};

export default SeznamNalog;

