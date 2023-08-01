import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from 'react-bootstrap/Navbar';

export default function CardText({title, describe, button, location}) {

  return <Card className="col-6 col-md-6" style={{ width: '36rem', margin: '15px', background: '#343434' }}>
  <Card.Body>
    <Card.Title>{title}</Card.Title>
    <Card.Text>
      {describe}
    </Card.Text>
    <Navbar.Brand href={location}><Button variant="primary blueButton">{button}</Button></Navbar.Brand>
  </Card.Body>
</Card>

}