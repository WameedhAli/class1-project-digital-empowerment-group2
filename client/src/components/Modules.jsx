import React, { Component} from 'react';
//import * as api from '../api/modules';
import { getModules, createModule, deleteModule, updateModule } from '../api/modules';
import Module from './Module'
import{ Button ,Modal} from 'react-bootstrap'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ModuleForm from './ModuleForm';
import AppHader from '../shared/AppHeader';
import Loader from '../shared/Loader';
import Model from 'react-modal';
import AdminBar from '../shared/AdminBar';
import classNames from 'classnames';



const SETP_EXPLANATION ='explanation';
const SETP_EXERCISE ='exercise';
const SETP_EVALUATION ='evaluation';


class Modules extends Component {
 state = {
      title:'',
      modules: [],
      activeModuleId: undefined,
      activeStep: SETP_EXPLANATION,
      isLoding: true,
      isAdmin: true,
      // show:false, 
      // explanation: '',
      // exercise: '',
      // evaluation: '',
      // content: '',
      // flag: '1',
     
          };

 

componentDidMount() {
 // this.setState({ loading: true });
   getModules().then((modules) => {
    let activeModuleId;
    if (modules.length > 0) {
      activeModuleId = modules[0]._id;
    }
      this.setState({  modules, activeModuleId, isLoding: false });
      //,loading: false
    });
  }



  addModule = e => {
    e.preventDefault();
   
    createModule(
      this.state.title, 
      this.state.explanation,
      this.state.exercise,
      this.state.evaluation)
    .then(newModule => {
      this.setState(state => ({ modules: [...state.modules, newModule], isAddingModule: false}));
    });
  };

  handeleSave = (module) => {
    const {explanation,exercise,evaluation}=this.state
    updateModule(module,explanation,exercise,evaluation).then((updatedModule) => {
      this.setState((previousState) => {
        const modules = [...previousState.modules];
        const index = modules.findIndex(mod => mod._id === module._id);
        modules[index] = updatedModule;
        return { modules  };
      })
    });
  };

  handleDelete =  id => { 
    deleteModule(id);
      this.setState({     
        modules:this.state.modules.filter( mod => mod._id!== id )
      });
    };

  handleTextChange=(e)=> {
    switch(this.state.flag){
      case 1: 
      this.setState({explanation:e,content:e})
      break;
      case 2:
      this.setState({exercise:e,content:e})
      break;
      case 3: 
      this.setState({evaluation:e,content:e})
      break;
   
  }
  
};

handelContentEvaluation=(e)=> {
    if (e.target.innerHTML === 'Explanation') {
      this.setState({
        content:this.state.explanation,
        flag: 1
      });
     
    }
    
    if (e.target.innerHTML === 'Exercise') {
      this.setState({
        content:this.state.exercise,
        flag: 2
      });
    } 
    if (e.target.innerHTML === 'Evaluation') {
      this.setState({
        content:this.state.evaluation,
        flag: 3
      });
  }
}

HandleDialoge=() =>{
  this.setState({ show: !this.state.show });
}





  handlingChange = e => {
    this.setState({
     title: e.target.value
   });
 };


  
  render() {
    const { isLoding, modules, isAdmin, isAddingModule } = this.state

    if (isLoding) {
        return <Loader fullscreen={true}/>;
    }

    const moduleComponents = modules.map(this._renderModule);
    return (
        <div>
            <AppHader/>
            {isAdmin && this._renderAdminBar()}
            {isAddingModule && this._renderAddMoudleForm()}
            <div className="module-list">
            {moduleComponents}
            </div>
        </div>
    );
}

_renderModule = module =>{
const {activeModuleId, activeStep }= this.state;
const isActive = module._id === activeModuleId;
return (
    <div className="module" key={module._id}>
        <div className="module__title">
           <h2>{module.title}</h2>
        </div>
        {isActive && (
             <div className="module__body">
                {this._renderStep('Explanation', 'module__explanation', module.explanation, activeStep === SETP_EXPLANATION)}
                {this._renderStep('Exercise', 'module__exercise', module.exercise,  activeStep === SETP_EXERCISE)}
                {this._renderStep('Evaluation', 'module__evaluation', module.evaluation,  activeStep === SETP_EVALUATION)}
            </div>
        )}
    </div>
);
};

_renderModule = module =>{
const {activeModuleId, activeStep }= this.state;
const isActive = module._id === activeModuleId;
return (
  <div className="module" key={module._id}>
      <div className="module__title">
         <h2>{module.title}</h2>
      </div>
      {isActive && (
           <div className="module__body">
              {this._renderStep('Explanation', 'module__explanation', module.explanation, activeStep === SETP_EXPLANATION)}
              {this._renderStep('Exercise', 'module__exercise', module.exercise,  activeStep === SETP_EXERCISE)}
              {this._renderStep('Evaluation', 'module__evaluation', module.evaluation,  activeStep === SETP_EVALUATION)}
          </div>
      )}
  </div>
);
};
_renderStep = (title, className, body, expended) => {
const stepBodyClass = classNames('module__step-body', className, { expended })
return (
  <div  className="module__step">
      <h3>{title}</h3>
      <div className={stepBodyClass}>
      <div dangerouslySetInnerHTML={{__html: body}}/>
      <button onClick={this.onNextStep}>Next Step</button>
      </div>
  </div>
);
};

onNextStep = () => {
const {activeStep } = this.state;
if (activeStep === SETP_EXPLANATION)  {
  this.setState({ activeStep: SETP_EXERCISE})
}else if (activeStep === SETP_EXERCISE)  {
  this.setState({ activeStep: SETP_EVALUATION})
} else if (activeStep === SETP_EVALUATION) {
  this.onNextModule();
}
};

onNextModule = () => {
const { modules, activeModuleId } = this.state;
const moduleIndex = modules.findIndex(module => module._id === activeModuleId);
const nextModule = modules[moduleIndex + 1];
let newModuleId;
if (nextModule) {
  newModuleId = nextModule._id;
}
this.setState({activeModuleId: newModuleId , activeStep:SETP_EXPLANATION});
};

_renderAdminBar = () => {
const actions = [{title: ' Add Module', handler:this.onAddMoudle}];
return <AdminBar actions={actions}/>;
};

onAddMoudle = () => {
this.setState({isAddingModule: true})
}
_renderAddMoudleForm = () => {
return <Model isOpen={true} ariaHideApp={false}>
  <ModuleForm
      onCancel={() => this.setState({isAddingModule: false})}
      onSubmit={module => this.addModule(module)}
      />
</Model>
}

}

export default Modules;