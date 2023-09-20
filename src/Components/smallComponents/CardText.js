import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from 'react-bootstrap/Navbar';

export default function CardText({title, describe, button, location}) {

  return <Card className="col-11 col-md-5 m-2" style={{ background: '#343434' }}>
  <Card.Body>
    <Card.Title>{title}</Card.Title>
    <Card.Text>
      {describe}
    </Card.Text>
    <Navbar.Brand href={location}><Button className="col-12 col-md-12 col-lg-12 col-xl-5" variant="primary blueButton">{button}</Button></Navbar.Brand>
  </Card.Body>
</Card>

}