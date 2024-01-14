import { Toast, ToastContainer} from 'react-bootstrap';

export default function ToastAddPizza({title, describe, background, time, show, hide}) {

  return <ToastContainer className="position-static">
  <Toast
    show={show}
    onClose={hide}
    delay={time} // Duration for which the toast will be visible (in milliseconds)
    autohide
    bg={background}
    style={{
      position: 'fixed',
      top: 'calc(70px)', // Adjust the position as needed
      left: '10px', // Adjust the left position as needed
      zIndex: 9, // Ensures the toast appears above other content
    }}
  >
    <Toast.Header variant="dark" className="d-flex justify-content-between"> {/* Use the bg prop to set the primary color */}
    <img
        src="PizzaIcon.png"
        className="rounded me-2"
        alt=""
        style={{ width: '25px', height: '25px' }} // Set the width and height to 10px
      />
      <strong className="mr-auto">{title}</strong>
    </Toast.Header>
    <Toast.Body>{describe}</Toast.Body>
  </Toast>
</ToastContainer>

}