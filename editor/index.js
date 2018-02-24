/**
 * @desc 编辑器
 * @date 2017-05-17
 */
import uuid from 'uuid'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import './styles.less'
//import {QN_URL} from '../../config'

//import { uploadFile } from '../../mixins/qiniu'

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      display: 'none',
      big: 'editor',
    }
    this.tr = 0
    this.td = 0
    this.type = ''
    this.width = 100
    this.name = ''
    this.key = ''
  }

  componentWillReceiveProps(nextProps) {
    if(!!nextProps.text && (nextProps.text!== this.props.text)){
      this.innerHTML(nextProps.text)
    }
  }

  textChange(a, b) {
    b ?
    document.execCommand(a, false, b)
    :
    document.execCommand(a, true, null)
  }

  //插入表格
  innerTable() {
    let t
    this.mainText.focus()
    if(this.tr > 0 && this.td > 0) {
      t = `<table>`
      for(let i = 0;i < this.tr; i++){
        t += `<tr>`
        for(let j = 0;j < this.td;j++){
          t += `<td></td>`
        }
        t += `</tr>`
      }
      t += `</table>`
      //console.log(t)
      this.textChange('insertHTML', t)
    }
    this.setState({
      display: 'none'
    })
  }

  innerHTML(t) {
    this.mainText.innerHTML = t
  }

  getCont() {
    this.props.handleText(this.mainText.innerHTML)
  }

  //选择图片
  handleSelectImg(e) {
    this.type = 'table'
    //console.log('a',e.target.files)
    e.preventDefault()
    this.files = e.target.files
    if(this.files) {
      const name = this.files[0].name.split('.')
      this.key = uuid.v4()+"."+name[name.length-1]
      //打开输入宽度的对话框
      this.setState({
        display: 'block'
      })
    }
    //e.target.value=''
  }

  //图片上传
  innerImg() {
    console.log('上传地址请自己配哦')
    // if(this.width === null) {null}
    // else {
    //   this.setState({display:'none'})
    //   uploadFile(this.files[0], this.key, (progress) => {
    //     // 上传进度已完成
    //     if (progress === 1) {
    //       let pic = `${QN_URL}${this.key}`
    //       //console.log(pic,this.width)
    //       this.mainText.focus()
    //       pic = `<img src = ${pic} width=${this.width}/>`
    //       this.textChange('insertHTML', pic)
    //     }
    //   }).then().catch(() => { console.error('上传失败') })
    // }
  }

  handleShow(e) {
    if(e.target.className === 'hidden') {
      this.setState({
        display: 'none',
      })
    }
  }

  renderContent() {
    return (
      <div className={this.state.big}>
      <div className="toolbar">
        <select
          style={{ margin: '5px' }}
          defaultValue="5"
          onChange={e => this.textChange('fontSize', e.target.value)}
        >
          <option value="1">1号字</option>
          <option value="2">2号字</option>
          <option value="3">3号字</option>
          <option value="4">4号字</option>
          <option value="5">5号字</option>
          <option value="6">6号字</option>
          <option value="7">7号字</option>
        </select>
      字体颜色:<input
        type="color"
        ref={(ref) => { this.color = ref }}
        style={{ margin: '0 5px', width: '20px', height: '20px' }}
        onChange={() => {
          this.textChange('foreColor', this.color.value),
          this.color.value='#000000'
        }}
      />
      背景颜色:<input
        type="Color"
        ref={(ref) => { this.hiliteColor = ref }}
        style={{ margin: '0 5px', width: '20px', height: '20px' }}
        onChange={() => {
          this.textChange('hiliteColor', this.hiliteColor.value),
          this.hiliteColor.value='#ffffff'
        }}
      />
      <button
        className='tableButton'
        onClick={() => {
          this.type = 'img'
          this.setState({display:'block'})
        }}
      >插入表格</button>
        <p style={{ float: 'right', paddingTop: '4px' }}>
          <input type="image" src="/../img/格式刷.png" onClick={() => this.textChange('removeFormat')} />
          <input type="image" src="/../img/left.png" onClick={() => this.textChange('justifyLeft')} />
          <input type="image" src="/../img/justify.png" onClick={() => this.textChange('justifyFull')} />
          <input type="image" src="/../img/center.png" onClick={() => this.textChange('justifyCenter')} />
          <input type="image" src="/../img/right.png" onClick={() => this.textChange('justifyRight')} />
          <input type="image" src="/../img/B.png" onClick={() => this.textChange('bold')} />
          <input type="image" src="/../img/I.png" onClick={() => this.textChange('italic')} />
          <input type="image" src="/../img/删除线.png" onClick={() => this.textChange('strikeThrough')} />
          <input type="image" src="/../img/下划线.png" onClick={() => this.textChange('underline')} />
          <input type="image" src="/../img/重做.png" onClick={() => this.textChange('redo')} />
          <input type="image" src="/../img/撤销.png" onClick={() => this.textChange('undo')} />
          <input
            type="image" src="/../img/全屏.png"
            onClick={() => {
              this.state.big === 'editor' ?
                this.setState({ big: 'big' })
              :
                this.setState({ big: 'editor' })
            }}
          />
        </p>
        <div className="ry-upload">
          <p className="btn-inner">
            <Icon type="plus" />
          </p>
          <input
            type="file"
            onChange={e => this.handleSelectImg(e)}
            name = "file"
            accept="image/png,image/gif,image/jpeg,/image/jpg"
            className="btn-file"
          />
        </div>
      </div>
      <div
        contentEditable="true"
        className="main"
        ref={(ref) => { this.mainText = ref }}
      />
      </div>
    )
  }

  renderHidden() {
    if(this.type === 'table') {
      return (
        <div className='hidden' style={{display: this.state.display}} onClick={(e) => this.handleShow(e)}>
          <div className='hiddenContent' >
            <div className='hiddenTitle'>请输入图片的宽（数字，空则为100）：</div><br />
            <input className='inputLeft' onChange={e => this.width = e.target.value}/>像素<br />
            <button className='button' onClick={() => this.innerImg()}>确定添加</button>
          </div>
        </div>
      )
    }else {
      return (
        <div className='hidden' style={{display: this.state.display}} onClick={(e) => this.handleShow(e)}>
          <div className='hiddenContent' >
            <div className='hiddenTitle'>请输入表格的行数/列数（数字）：</div><br />
            <input className='inputLeft' onChange={e => this.tr = e.target.value}/>行
            <input className='inputRight' onChange={e => this.td = e.target.value}/>列<br />
            <button className='button' onClick={() => this.innerTable()}>确定添加</button>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="e">
        {this.renderContent()}
        <div className='hiddenBox' style={{display: this.state.display}}/>
        {this.renderHidden()}
      </div>
    )
  }
}

Editor.propTypes = {
  handleText: PropTypes.func,
  text: PropTypes.string,
}
Editor.defaultProps = {
  text: '',
  handleText: null,
}
export default Editor
