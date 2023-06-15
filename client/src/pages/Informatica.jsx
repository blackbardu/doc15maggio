import Form from "../components/Forms/FormDocenti";
import { Scrollbars } from 'react-custom-scrollbars-2';
const Informatica = () => {
  return (
    <Scrollbars className="scrollbars-container">
        <div className="title"> Informatica</div>
        <Form pageName="informatica"></Form>
    </Scrollbars>
)
  };
  
  export default Informatica;