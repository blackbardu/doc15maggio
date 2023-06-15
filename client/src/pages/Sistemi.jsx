import Form from "../components/Forms/FormDocenti";
import { Scrollbars } from 'react-custom-scrollbars-2';
const Sistemi = () => {
  return (
    <Scrollbars className="scrollbars-container">
        <div className="title"> Sistemi e reti</div>
        <Form pageName="sistemi"></Form>
        
    </Scrollbars>
)
  };
  
  export default Sistemi;