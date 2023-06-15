import Form from "../components/Forms/FormDocenti";
import { Scrollbars } from 'react-custom-scrollbars-2';
const Ginnastica = () => {
  return (
    <Scrollbars className="scrollbars-container">
        <div className="title"> Scienze motorie</div>
        <Form pageName="ginnastica"></Form>
    </Scrollbars>
)
  };
  
  export default Ginnastica;