import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import demoImg from './images/timg.jpg';
import erweimaImg from './images/erweima.png';
import './search.less';
import '../../common/index'

class Search extends Component {
  render() {
    return (
      <div className="search-text">
        <img src={demoImg} />
        <img src={erweimaImg} alt=""/>
        <div className="search-text">Search Test 22 520</div>
      </div>
    )
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)