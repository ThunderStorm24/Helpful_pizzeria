import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function CardPhoto({photo, title, describe, button, location}) {

  return <Card className="col-4 col-md-4" style={{ width: '20rem', margin: '15px' }}>
  <Card.Img  variant="top" src={photo} />
  <Card.Body>
    <Card.Title>{title}</Card.Title>
    <Card.Text>
      {describe}
    </Card.Text>
    <Button variant="primary" className="blueButton" href={location}>{button}</Button>
  </Card.Body>
</Card>

}