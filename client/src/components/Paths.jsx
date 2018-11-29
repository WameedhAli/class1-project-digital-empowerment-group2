import React, { Component } from "react";
import * as api from '../api/paths';

import PathForm from './PathForm';
import AppHader from '../shared/AppHeader';
import Loader from '../shared/Loader';
import Modal from 'react-modal';
import AdminBar from '../shared/AdminBar';
import PathHeader from '../shared/PathHeader';

  class Paths extends Component {
    state = {
      title:'',
      paths: [],
      activePathId: undefined,
      isLoding: true,
      isAddingPath:false,
      isEditingPath:false,
      editingPath: null,
      searchString : '',
    }

    componentDidMount() {
      api.getPaths().then((paths) => {
        let activePathId;
        if (paths.length > 0) {
          activePathId = paths[0]._id;
        }
        this.setState({  paths, activePathId, isLoding: false });
      });
    }

    addPath = async path => {
      const newPath = await api.createPath(path);
      this.setState(state => ({ paths: [...state.paths, newPath],title:"", isAddingPath: false}));
    };

    handleDelete =  id => {
      api.deletePath(id);
        this.setState({
          paths:this.state.paths.filter( pat => pat._id!== id )
      });
    };

    updatePath = async (module) => {
      const updatedModule = await api.updatePath(module);
      this.setState((previousState) => {
        const modules = [...previousState.modules];
        const index = modules.findIndex(mod => mod._id === module._id);
        modules[index] = updatedModule;
        console.log(modules);
        return { modules, isEditingModule: false, editingModule: null  };
      })
    };

    searchItem = (event) => {
      const searchString = event.target.value
      this.setState({searchString : searchString})
    }

  render() {
    const { isLoding, paths, isAdmin, isAddingPath, isEditingPath, editingPath } = this.state
    // const filterPaths = this.state.Data.filter((paths) => {
    //   const regex = new RegExp(this.state.searchString, 'g')
    //     return regex.test(paths.paths)
    //   })
    if (isLoding) {
        return <Loader fullscreen={true}/>;
    }
    const pathComponents = paths.map(this._renderpath);
    return (
        <div>
            <AppHader/>
            <PathHeader/>
            <input className="Path__input" type='search' placeholder='Search Path' onChange={this.searchItem}/>
            <button  className="Path__button"  onClick={() =>this.onAddPath(paths)}> Add Path </button>
            {isAdmin && this._renderAdminBar()}
            {isAddingPath && this._renderAddPathForm()}
            {isEditingPath && this._renderEditPathForm(editingPath)}
            <div className="path-list">
            {pathComponents}
            </div>
        </div>
    );
  }

  _renderpath = path =>{
    return (
      <div className="path" key={path._id}>
        <div className="path__title">
          <h2>{path.title}</h2>
            {path.completed && <span class='glyphicon glyphicon-ok'> Completed</span>}
            <button  className="Path-edit-delete__button"  onClick={() =>this.onEditPath(path)}> Copy </button>
            <button  className="Path-edit-delete__button"  onClick={() =>this.onEditPath(path)}> Edit </button>
            <button className = 'Path-edit-delete__button' onClick={() =>
              {if (window.confirm(`Are you sure you want to delete "${path.title}"? `)) this.handleDelete( path._id);}}> Delete </button>
        </div>
      </div>
    );
  };

  _renderAdminBar = () => {
    const actions = [{title: ' Add path', handler:this.onAddPath}];
    return <AdminBar actions={actions}/>;
  };

  onAddPath = () => {
    this.setState({isAddingPath: true})
  }

  _renderAddPathForm = () => {
    return <Modal isOpen={true} ariaHideApp={false}>
      <PathForm
        onCancel={() => this.setState({isAddingPath: false})}
        onSubmit={path => this.addPath(path)}
        buttonTitle="Add path"
      />
    </Modal>
  }

  onEditPath = (path) => {
    this.setState({isEditingPath: true,  editingPath: path})
  }

  _renderEditPathForm = (path) => {
    return <Modal isOpen={true} ariaHideApp={false}>
      <PathForm
          path={path}
          onCancel={() => this.setState({isEditingPath: false, editingPath: null})}
          onSubmit={path => this.updatePath(path)}
          buttonTitle="Edit path"
      />
      </Modal>
    }
  }

  export default Paths;
