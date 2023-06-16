import FormAllegati from "../components/Forms/FormAllegati";
import { Scrollbars } from 'react-custom-scrollbars-2';
const Allegati = () => {
  return (
    <Scrollbars className="scrollbars-container">
        <div className="title"> Allegati
        <FormAllegati></FormAllegati>
        </div>
    </Scrollbars>
)
  };
  
  export default Allegati;