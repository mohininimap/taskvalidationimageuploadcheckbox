import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './home.css';
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ImportExportRoundedIcon from "@mui/icons-material/ImportExportRounded";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import FormDialogue from './components/Dialog';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button from '@mui/material/Button';

const initialValue={name:"",karat:"",weight:"",price:"",image:''}
function Home() {

  const [tableData, setTableData] = useState(false)
  const [formData, setFormData] = useState(initialValue)
  const url = `http://localhost:5000/product`
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = useState(1);
  const [selectfield, selectSetField] = useState();

  useEffect(() => {
    getUsers()
  }, [])
  const getUsers = () => {
    fetch(url).then(resp => resp.json()).then(resp => setTableData(resp))
  }

  const handleFormSubmit=(setNameError)=>{
   
if(formData.id){
  alert("Product updated successfully")


  fetch(url+`/${formData.id}`,{method:"PUT",body:JSON.stringify(formData),headers:{
    'content-type':"application/json",
   
  }}).then(resp=>resp.json())
  .then(resp=>{
    handleClose()
    getUsers()
   
  })
}else{



fetch(url,{method:"POST",body:JSON.stringify(formData),headers:{

  'content-type':"application/json"
}}).then(resp=>resp.json())
.then(resp=>{
  console.log("resp"+JSON.stringify(resp.name.length))
  
if(resp.name.length!==0 || resp.karat.length!==0 || resp.weight.length!==0 ||resp.price.length!==0 ){
  alert("Product added successfully")
}
  handleClose()
  getUsers()
  
})
}
  }

  const handleDelete=(id)=>{
    const confirm=window.confirm("Are you sure you want to delete this row",id)
    if(confirm){
      fetch(url+`/${id}`,{method:"DELETE"}).then(resp=>resp.json()).then(resp=>getUsers())

    }
  }
  const handleUpdate=(data)=>{
    setFormData(data)
    handleClickOpen()
  }


  
  const onChange=(e,err)=>{

   if(e.target.name=="name"){
e.target.value.length===0
  ?err(true):err(false)
   }

   if(e.target.name=="karat"){
e.target.value>24?err(true):err(false)
   }

   
   if(e.target.name=="weight"){
    e.target.value.length===0
      ?err(true):err(false)
       }

   if(e.target.name=="price"){
   e.target.value.length===0
    ?err(true):err(false)
      }
    
const value =
      e.target.type === "file" ? e.target.files[0] : e.target.value;
    
      setFormData({
        ...formData,
      [e.target.name]:e.target.value ,
   
      image:e.target.type === "file" &&"./"+e.target.files[0].name
    
   
    });
 console.log(" e.target"+ value)
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialValue)
  };

  const selectPageHandler = (selectedPage) => {
    console.log("*********" + selectedPage);
    if (selectedPage >= 1 && selectedPage <= tableData.length / 10) 
      setPage(selectedPage);
  };
  return (
    <>

<div class="row top-div">
 
    <div class="col-lg-7">
    <p className="title-product text-end ">Products List</p>
    </div>
   
    <div class="col-lg-5 addproduct-div text-end">
<Button size="small" className="btn-addproduct" onClick={handleClickOpen} variant="outlined" startIcon={<AddIcon size="small"/>}>
        Add Product
      </Button>
    </div>
  </div>

      <div>
        
        
        <table className="table table-bordered caption-top producttable">
       
          <thead>
            <tr>

              <th scope="col">
                <input type="checkbox" />
              </th>
              <th scope="col">ID</th>
              <th scope="col">NAME</th>
              <th scope="col">KARAT</th>
              <th scope="col">WEIGHT</th>
              <th scope="col">PRICE</th>
              <th scope="col">IMAGE</th>
              <th scope="col">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {
              tableData && tableData.map((item) => (
                // tableData && tableData.slice(page * 10 - 10, page * 10).map((item) => (

                <tr key={item?.id}>

                  <>
                    <th scope="row">   <input type="checkbox" checked={item.image?true:false} /></th>


                    <th scope="row">{item?.id}</th>
                    <td>{item?.name}</td>
                    <td>{item?.karat}</td>
                    <td>{item?.weight}</td>
                    <td>{item?.price}</td>
                    <td>
                      <img  src={item.image.length>0?item.image:""} height="20px"   />
                    </td>
                    <td>

{/* 
                      <Fab
                        size="small"
                        onClick={() =>handleDelete(item.id)}
                        aria-label="delete"
                      > */}
                        <DeleteIcon onClick={() =>handleDelete(item.id)} size="small" color="error" />
                      {/* </Fab> */}

                      {/* <Fab
                        sx={{ marginLeft: "12px" }}
                        size="small"
                        onClick={() =>handleUpdate(item)}


                        aria-label="add"
                      > */}
                        <EditIcon className="editicon" onClick={() =>handleUpdate(item)} size="small" color="primary" />
                      {/* </Fab> */}

                    </td>

                  </>

                </tr>

              ))
            }

          </tbody>

        </table>
        <FormDialogue open={open} handleClose={handleClose} data={formData}  onChange={onChange} handleFormSubmit={handleFormSubmit} />
        <div>
        {tableData.length && tableData.length > 0 && (
          <div className="pagination">
            <span onClick={() => selectPageHandler(page - 1)}
            className={page>1?"":"pagination__disable"}
            >
            <ArrowBackIosIcon/>
            </span>
            {
              //so its give a new in a array inside this products =>100
              [...Array(Math.floor(tableData.length / 10))].map((_, i) => {
                //i start from 0
                return (
                  <span
                    //current index and page is match then
                    className={page === i + 1 ? "pagination__selected" : ""}
                    onClick={() => selectPageHandler(i + 1)}
                    key={i}
                  >
                    {i + 1}
                  </span>
                );
              })
            }

            <span onClick={() => selectPageHandler(page + 1)}
            className={page<Math.floor(tableData.length / 10)?"":"pagination__disable"}
            >
         <ArrowForwardIosIcon/>
              </span>
          </div>
        )}
      </div>
      </div>

    </>
  );
}

export default Home;
