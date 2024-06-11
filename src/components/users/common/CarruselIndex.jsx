import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import PicProducto from './PicProducto';
import 'bootstrap/dist/css/bootstrap.min.css';


function CarruselIndex() {
  return (
    <Carousel fade sx= {{width:'100%', }}>
      <Carousel.Item>
        <PicProducto text="First slide" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <PicProducto text="Second slide" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <PicProducto text="Third slide" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarruselIndex;