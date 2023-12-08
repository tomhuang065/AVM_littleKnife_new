
import React from "react";
import axios from 'axios';
import {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import {  Card, Button, Table } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { useChat } from "../api/context";
import { Routes } from "../routes";


const ValueChange = ({ value, suffix }) => {
  const valueIcon = value < 0 ? faAngleDown : faAngleUp;
  const valueTxtColor = value < 0 ? "text-danger" : "text-success";

  return (
    value ? <span className={valueTxtColor}>
      <FontAwesomeIcon icon={valueIcon} />
      <span className="fw-bold ms-1">
        {Math.abs(value)}{suffix}
      </span>
    </span> : "--"
  );
};

export const AccountTable = (props) => {
  const instance = axios.create({baseURL:'http://localhost:5000/api/avm'});
  const [orig, setOrig] = useState("") 
  const {stat, setStat} = useChat();

  const Acc = props.accounts
  const Search = props.search
  const deleteInd = props.deleteInd

  useEffect(()=>{
    // console.log(stat)
    if(orig !== ''){
      handleEditAccount(stat)
    }
    setOrig("")    
  },[stat])


  const handleChangeState = (orig, status) =>{
    // console.log(orig, status)
    setOrig(orig)
    if(status === 1){
      setStat(false)
    }
    else{
      setStat(true)
    }

  }

  const handleEditAccount = async(stat)=>{
    // console.log("editacc", stat)
    const jsonData = {
      orig: `${orig}`,
      status:`${stat}`,
    };
    const response = await instance.post('/mod_account_subjects', {
      ID:JSON.stringify(jsonData)
    }
    )

    alert(response.data);
    setStat(null)
  }


 
      
  const TableRow = (props) => {
    const { third, third_subjects_cn, third_subjects_eng, fourth, fourth_subjects_cn, fourth_subjects_eng,status} = props;

    return (
      <tr>
        <td>
          <Card.Link as={Link} to={Routes.Invoice.path} className="fw-normal">
            {third}
          </Card.Link>
        </td>
        <td>
          <span className="fw-normal">
            {third_subjects_cn}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {fourth}
          </span>
        </td>
        <td>
          <span className={`fw-normal`}>
          {fourth_subjects_cn}
          </span>
        </td>
        <td>
          <span className={`fw-normal`}>
            {status === 1? "顯示":"未顯示"}
          </span>
        </td>
        <td>
          <Button variant="outline-primary" onClick={() => {handleChangeState(fourth, status)}}>變更</Button>
        </td> 
        
      </tr>
    );
  };

  return (
  <div>
    {typeof(Acc)=== 'undefined' ?<div></div>:<Card border="light" className="overflow-auto table-wrapper table-responsive shadow-sm" style ={{width:"120%"}}>
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center table-striped">
          <thead>
            <tr>
              <th className="border-bottom">三階代碼</th>
              <th className="border-bottom">三階科目中文名稱</th>
              {/* <th className="border-bottom">三階科目英文名稱</th> */}
              <th className="border-bottom">四階代碼</th>
              <th className="border-bottom">四階科目中文名稱</th>
              {/* <th className="border-bottom">四階科目英文名稱</th> */}
              <th className="border-bottom">顯示狀態</th>
              <th className="border-bottom">編輯顯示狀態</th>
            </tr>
          </thead>
          <tbody>
            {deleteInd?Acc.filter((acc) => (acc.status === 0)&&(acc.third_subjects_cn.includes(Search) ||
                                 acc.third_subjects_cn.includes(Search) ||
                                //  acc.fourth_subjects_eng.includes(Search) ||
                                 acc.fourth_subjects_cn.includes(Search) ||
                                 String(acc.third).includes(Search) ||
                                 String(acc.fourth).includes(Search))
                                 ).map(t => <TableRow className = "overflow-auto" key={`transaction-${t.id}`} {...t} />)
                      :Acc.filter((acc) => (acc.status === 1)&& (acc.third_subjects_cn.includes(Search) ||
                                 acc.third_subjects_cn.includes(Search) ||
                                //  acc.fourth_subjects_eng.includes(Search) ||
                                 acc.fourth_subjects_cn.includes(Search) ||
                                 String(acc.third).includes(Search) ||
                                 String(acc.fourth).includes(Search))
                      ).map(t => <TableRow className = "overflow-auto" key={`transaction-${t.id}`} {...t} />)}

          </tbody>
        </Table>
      </Card.Body>
    </Card>} 
  </div>
    
  );
};

