import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import ReactImage from "../assets/react.svg";
import MyImage from "../assets/photo.jpeg";

function View() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div style={{
        width: "40%",
        height: "300px",
        marginLeft: 0,
        marginRight: "auto",
        marginTop: "20px",
        marginBottom: "20px"
    }}>
      <Carousel activeIndex={index} onSelect={handleSelect} data-bs-theme="dark">
        <Carousel.Item>
          <img src={ReactImage} alt="React" className="d-block h-100" style={{
            objectFit: "contain",
            objectPosition: "center"
          }} />
        </Carousel.Item>
        <Carousel.Item>
          <img src={MyImage} alt="React" className="d-block h-100" style={{
            objectFit: "contain",
            objectPosition: "center"
          }} />
        </Carousel.Item>
        <Carousel.Item>
          <img src={ReactImage} alt="React" className="d-block h-100" style={{
            objectFit: "contain",
            objectPosition: "center"
          }} />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default View;
