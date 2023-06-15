import Form from '../components/Forms/FormDocenti'
import { Scrollbars } from 'react-custom-scrollbars-2';


const Italiano = () => {
  return (
      <Scrollbars className="scrollbars-container">
          <div className="title"> Italiano</div>
          <Form pageName="italiano"></Form>
      </Scrollbars>
  )
};

export default Italiano;