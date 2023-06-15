import Form from "../components/Forms/FormDocenti";
import { Scrollbars } from 'react-custom-scrollbars-2';
const TPSIT = () => {
  return (
    <Scrollbars className="scrollbars-container">
        <div className="title"> TPSIT</div>
        <Form pageName="tpsit"></Form>
    </Scrollbars>
)
  };
  
  export default TPSIT;