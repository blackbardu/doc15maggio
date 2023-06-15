import Form from "../components/Forms/FormDocenti";
import { Scrollbars } from 'react-custom-scrollbars-2';
const Matematica = () => {
  return (
    <Scrollbars className="scrollbars-container">
        <div className="title"> Matematica</div>
        <Form pageName="matematica"></Form>
    </Scrollbars>
)
  };
  
  export default Matematica;