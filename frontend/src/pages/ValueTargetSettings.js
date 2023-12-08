import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faCartArrowDown, faChartPie, faChevronDown, faClipboard, faCommentDots, faDownload, faFileAlt, faMagic, faPlus, faRocket, faStore, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, Form, Tab ,Nav } from '@themesberg/react-bootstrap';

import ExcelJs from "exceljs";
import axios from "axios";
import ValueTargetFormModal from './Modals/ValueTargetAddForm';
import { ValuetargetsTable} from "../components/ValueTargetTable";
import { useChat } from "../api/context";

export default () => {
  const instance = axios.create({baseURL:'http://localhost:5000/api/avm'});
  const {val, task, setTask, valType, setValType} = useChat();
  const [showValueTargetModal, setShowValueTargetModal] = useState(false);
  const [searchInd, setSearchInd] = useState("")
  const [valResult, setValResult] = useState([]);
  const [type, setType] = useState("") //for add form
  const [searchPH, setSearchPH] = useState("")
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteInd, setDeleteInd] = useState(false)



  const handleViewDeletion = () =>{
    setDeleteInd(!deleteInd)
  }
  const handleSearchIndChange = (e) => {
    setSearchInd(e.target.value)
  };

  useEffect(()=>{
    handleViewValueTarget(task)
  },[task])

  useEffect(()=>{
    console.log("get valType changed")
    handleViewValueTarget(valType) //from table, changing status
  },[val, valType])

  const handleExcelUploadSubmit = async () => {
    const formData = new FormData();
  };

  const handleSingleAdd = (task) => {
    console.log(task)
    setType(task)
    setShowValueTargetModal(true);
    
  };

  const handleCloseValueTargetModal = () => {
    setShowValueTargetModal(false);
  };

  const handleSaveValueTarget = (ValueTargetData) => {
    // Handle the logic to save the ValueTarget data
    console.log("Value Target Data:", ValueTargetData);
    setShowValueTargetModal(false);
  };

  const handleExceldownload = async () => {
    const workbook = new ExcelJs.Workbook(); // 創建試算表檔案
    const sheet = workbook.addWorksheet('價值標的'); //在檔案中新增工作表 參數放自訂名稱

		sheet.addTable({ // 在工作表裡面指定位置、格式並用columsn與rows屬性填寫內容
	    name: 'table名稱',  // 表格內看不到的，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
	    ref: 'A1', // 從A1開始
	    columns: [{ name: '標的種類(只可填"顧客"、"原料"或"產品")' }, { name: '標的代碼' }, { name: '標的名稱' }],
        rows: [
            ["顧客", 'C001', '小刀測試1'],
            ["原料", 'M001', '小刀測試2'],
            ["產品", 'P001', '小刀測試3']
        ]
		});

	  workbook.xlsx.writeBuffer().then((content) => {
		const link = document.createElement("a");
	    const blobData = new Blob([content], {
	      type: "application/vnd.ms-excel;charset=utf-8;"
	    });
	    link.download = '價值標的.xlsx';
	    link.href = URL.createObjectURL(blobData);
	    link.click();
	  });
      
  }

const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
};

const handleUpload = () => {
  if (!selectedFile) {
      alert('請選擇一個Excel檔案');
      return;
  }

  const formData = new FormData();
  formData.append('excelFile', selectedFile);

  
  instance.post('/upload_target', formData, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  })
  .then(function (response) {
      // 處理成功的回應
      alert('上傳成功');
      console.log('上傳成功', response.data);
  })
  .catch(function (error) {
      // 處理錯誤
      alert('上傳失敗，請重新上傳');
      console.error('上傳失敗', error);
  });
};
  const handleViewValueTarget= async (task) => {
    console.log("task", task)
    switch(task){
      case "原料":{
        setValResult(await instance.get('/sel_value_target_material'));
        setType("原料")
        setSearchPH("搜尋原料")
        break;
      }
      case "顧客":{
        setValResult(await instance.get('/sel_value_target_customer'));
        setType("顧客")
        setSearchPH("搜尋顧客")
        break;
      }
      case "產品":{
        setValResult(await instance.get('/sel_value_target_product'));
        setSearchPH("搜尋產品")
        setType("產品")
        break;
      }
      case "部門":{
        setValResult(await instance.get('/sel_value_target_department'));
        setType("部門")
        setSearchPH("搜尋部門")
        console.log(valResult)
        break;
      }
      default:{
        break;
      }
    }
  }

  const valueTarg = ['原料', "顧客", "產品", "部門"]

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <h2 className="fw-bold">
          價值標的設定
        </h2>
      </div>
      <Tab.Container defaultActiveKey="upload">
        <Row>
          <Col xs={12} xl={10}>
            {/* Nav for Tabs */}
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="upload">上傳</Nav.Link>
              </Nav.Item>
              {valueTarg.map((val)=>( 
                <Nav.Item onClick={() => {handleViewValueTarget(val)}}>
                  <Nav.Link eventKey={val}>{val}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            {/* Tab Content */}
            <Tab.Content>
              <Tab.Pane eventKey="upload">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <Col xs={12} xl={5}>
                    <Form.Group>
                      <Form.Label>上傳excel</Form.Label>
                      <Form.Control type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                    </Form.Group>
                  </Col>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-3">
                <Col xs={12} xl={5}>
                <Button icon={faFileAlt} className="me-2" variant="primary" onClick={handleExceldownload}>
                  <FontAwesomeIcon icon={faDownload} className="me-2" />
                  下載範例
                </Button>
                <Button icon={faFileAlt} className="me-2" variant="primary" onClick={handleUpload}>
                    <FontAwesomeIcon icon={faUpload} className="me-2" />
                    上傳
                </Button>
                </Col>
                </div>
              </Tab.Pane>

              {valueTarg.map((val) =>(
                <Tab.Pane eventKey={val}>
                  <div className="d-flex flex-wrap flex-md-nowrap align-items-center py-3">
                    <Form className="d-flex me-2" style ={{position: "Absolute", top: 170, right: 7, width:300 }} >
                      <Form.Control
                        type="search"
                        placeholder={searchPH} 
                        className="me-2"
                        aria-label="Search"
                        onChange={handleSearchIndChange}
                        value={searchInd}
                      />
                    </Form>
                    <Button icon={faFileAlt} className="me-2" variant="primary" onClick={() => handleSingleAdd(val)}>
                      <FontAwesomeIcon icon={faPlus} className="me-2" />單筆新增
                    </Button>
                    &nbsp;&nbsp;  
                    <Button icon={faFileAlt} className="me-2" variant="primary" onClick={handleViewDeletion}>
                      <FontAwesomeIcon  className="me-2" />{!deleteInd?type === "原料"?"查看未顯示原料":type === "產品"?"查看未顯示產品":type === "顧客"?"查看未顯示顧客":"查看未顯示部門":type === "原料"?"查看顯示原料":type === "產品"?"查看顯示產品":type === "顧客"?"查看顯示顧客":"查看顯示部門"}
                      {/* {type === "原料"?"原料":type === "產品"?"產品":type === "顧客"?"顧客":"部門"} */}
                    </Button>
                    <br></br>
                  </div>
                  <ValuetargetsTable valueTarget={valResult} type ={val} search ={searchInd} deleteInd ={deleteInd}/>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Supplier Form Modal */}
      <ValueTargetFormModal
        show={showValueTargetModal}
        type={type}
        onClose={handleCloseValueTargetModal}
        onSave={handleSaveValueTarget}
        
      />
    </>
  );
};

