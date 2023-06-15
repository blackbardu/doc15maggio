import Form from "../components/Forms/FormDocenti";
import { Scrollbars } from 'react-custom-scrollbars-2';
const GPOI = () => {
  return (
    <Scrollbars className="scrollbars-container">
        <div className="title"> GPOI</div>
        <Form pageName="gpoi"></Form>
    </Scrollbars>
)
  };
  
  export default GPOI;