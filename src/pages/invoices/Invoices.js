import React from "react"
import MetaTags from 'react-meta-tags';
import { Col, Container, Row, Card, CardBody, CardTitle, Button, Modal, FormGroup, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
import { MDBDataTable } from "mdbreact"
import axios from "axios"
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const InvoiceSchema = yup.object({
  InvoiceNum: yup.number().required().typeError('soogeli numberka bonada'),
  C_ID: yup.string().required("please enter Customer ID"),
  Item_ID: yup.string().required("please enter item ID"),

  // itemName: yup.number().required().typeError('soogeli numberka'),
  // C_Tell: yup.number().required("please enter Costomer Tell").min(4, "ugu yaraan 4 labar").max(10, "ugu badnaan 10 lambar"),
  Quantity: yup.number().required().typeError('soo geli quantitiga'),
  Description: yup.string().required("please enter item Description").min(8, "ugu yaraan 8 xaraf").max(50, "ugu badnaan 50 xaraf"),

});

const Invoices = () => {
  const [menu, setMenu] = useState(false)
  const toggle = () => {
    setMenu(!menu)
  }
  let endPoint = 'http://localhost:2323/invoice'


  const [apiData, setApiData] = useState([])
  const [isopen, setisopen] = useState(false)
  const [tim, setTim] = useState(new Date())
  const [EditID, setEditID] = useState("")
  const [isEdit, setIsEdit] = useState(false)
  const [CustomerApi, setCustomerApi] = useState([])
  const [ItemsApi, setItemsApi] = useState([])

  const { register, handleSubmit, setValue, reset,
    formState: { errors }, } = useForm({ resolver: yupResolver(InvoiceSchema), });

    let token = localStorage.getItem('token')
    const headers = {
      headers: {
        "Content-Type":"application/json",
        "token":"token"
      },
    }
  useEffect(() => {
    async function onload() {
      try {
        let C_endPoint = 'http://localhost:2323/customers'
        let Item_endPoint = 'http://localhost:2323/items'
        let xogta = await axios.get(C_endPoint,headers)
        let datada = await axios.get(Item_endPoint,headers)
        let { data } = await axios.get(endPoint,headers)
        console.log("data", data)
        setApiData(data)
        // console.log(apiData)
        setCustomerApi(xogta.data)
        // console.log("cust",xogta.data)
        setItemsApi(datada.data)
        console.log("item",datada.data)

      } catch (error) {
        console.log(error.message)
      }
    }
    onload()
  }, [tim])

  const OnSubmitka = async (event) => {


    try {
      if (isEdit) {
        const newEndPoint = `${endPoint}/${EditID}`
        //return console.log(isEdit)
        let { data } = await axios.put(newEndPoint, event);
        setTim(new Date())
        if (data.status === 'Success') {
          toastr.success(data.message)
          setisopen(false)
        } else {
          toastr.error(data.message)
        }


        setIsEdit(false)
        reset();
        return data.message
      }

      else {
        //console.log(isEdit)
        let { data } = await axios.post(endPoint, event);
        const xogta = await data.status
        if (xogta === 'Success') {
          toastr.success(data.message);
          // setApiData([data.info, ...apiData,])
          setTim(new Date())
          reset();
          setisopen(false)
        } else {
          toastr.error(data.message);
          // reset();
        }

      }



    } catch (error) {
      toastr.error(error.message);

    }

  }


  const HandleEdit = (e) => {
    // e.preventDefault();
    console.log(e)
    setEditID(e._id)
    setValue("InvoiceNum", e.InvoiceNum)
    setValue("C_ID", e.C_ID._id)
    setValue("Item_ID", e.Item_ID._id)
    setValue("Quantity", e.Quantity)
    setValue("Description", e.Description)
    setIsEdit(true)
    setisopen(true)

}


const Deleting = async (id) => {
  Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
      if (result.isConfirmed) {

          const { data } = await axios.delete(`${endPoint}/${id}`);
          if (data.status === 'Success') {
              // Swal.fire(
              //     'Delete Error',
              //     'Your file has been deleted.',
              //     'danger'
              // )
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
            setTim(new Date());
          }
          else {
              // Swal.fire(
              //     'Deleted!',
              //     'Your file has been deleted.',
              //     'success'
              // )
              Swal.fire(
                'Delete Error',
                'Your file has been deleted.',
                'danger'
            )
              

          }


      }
  })
};


  const xogta = {
    columns: [
      {
        label: "InvoiceNum",
        field: "InvoiceNum",
        sort: "asc",
        width: 150,
      },
      {
        label: "CostomerName",
        field: "C_Name",
        sort: "asc",
        width: 270,
      },
      {
        label: "ItemName",
        field: "Item_Name",
        sort: "asc",
        width: 200,
      },
      {
        label: "Quantity",
        field: "Quantity",
        sort: "asc",
        width: 100,
      },
      {
        label: "Price",
        field: "Price",
        sort: "asc",
        width: 100,
      },
      {
        label: "TotalAmount",
        field: "TotalAmount",
        sort: "asc",
        width: 100,
      },
      {
        label: "Description",
        field: "Description",
        sort: "asc",
        width: 100,
      },
      {
        label: "Action",
        field: "action",
        sort: "asc",
        width: 100,
      },


    ],
    rows: apiData.map(data => {
      // console.log("mapka",data);
      data.C_Name=data.C_ID?.C_Name
      data.Item_Name=data.Item_ID?.itemName

      data.action = (
        <div className="d-flex">
          <Button onClick={() => HandleEdit(data)} className='btn btn-primary'><i className="ion ion-md-create font-size-16" /></Button>

          <Button onClick={() => Deleting(data._id)} className='btn btn-danger me-5' style={{ marginLeft: "10px" }}><i className="ion ion-md-trash font-size-16" /></Button>
        </div>
      )
      return data;
    })

  }

const tog_standard = () => {
    setisopen(!isopen)
    setIsEdit(false)
    reset()
}
let closeTirtir = () => {
    setisopen(!isopen)
    setIsEdit(false)
    reset()
  }


  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Invoices |</title>
        </MetaTags>
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Invoices</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">Welcome to Invoice page</li>
                </ol>
              </Col>

              <Col md="4">
                <div className="float-end d-none d-md-block">

                </div>
              </Col>
            </Row>

            {/* MODAL */}
            <Modal isOpen={isopen} toggle={() => { tog_standard() }}>
              <div className="modal-header">
                <h5 className="modal-title mt-0" id="myModalLabel">
                  Invoice Form
                </h5>
                <button
                  type="button"
                  // onClick={() => {
                  //     setmodal_standard(false)
                  // }}
                  // onClick={() => setisopen(false)}
                  onClick={() => tog_standard()}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              {/* <AvForm className="needs-validation"
                        onValidSubmit={(e, v) => {
                            console.log("xogta", v);

                        }}
                    > */}
              <div className="modal-body">

                <form onSubmit={handleSubmit(OnSubmitka)}>
                  <div class="row">
                    <div class="form-group col-md-12">
                      <label for="inputEmail4">Invoicenumber</label>
                      <input type="number" class="form-control" id="inputEmail4" placeholder="Enter invoice number"
                        {...register("InvoiceNum")}
                      />
                      <p>
                        {errors.InvoiceNum && (
                          <span className="text-danger">{errors.InvoiceNum.message}</span>
                        )}
                      </p>
                    </div>

                  </div>

                  <div class="row">
                    {/* <div class="form-group col-md-6">
                      <label for="inputEmail4">Customer ID</label>
                      <input type="text" class="form-control" id="inputEmail4" placeholder="Enter Customer ID"
                        {...register("C_ID")}
                      />
                      <p>
                        {errors.C_ID && (
                          <span className="text-danger">{errors.C_ID.message}</span>
                        )}
                      </p>
                    </div> */}
                      <div class="form-group col-md-6">
                      <select type="select" class="form-control" name="className" id="exampleInputPassword1" placeholder="" {...register("C_ID")}>
                        <option value="">Choose Costomer</option>
                        {CustomerApi?.map(data => {
                          return <option value={data._id}>{data.C_Name}</option>

                          
                        

                        })}

                      </select>
                      {/* <p>
                                    {errors.Emp_ID && (
                                        <span className="text-danger">{errors.Emp_ID.message}</span>


                                    )}

                                </p> */}
                    </div>

                    {/* <div class="form-group col-md-6">
                      <label for="inputEmail4">Item ID</label>
                      <input type="text" class="form-control" id="inputEmail4" placeholder="Enter Item ID"
                        {...register("Item_ID")}
                      />
                      <p>
                        {errors.Item_ID && (
                          <span className="text-danger">{errors.Item_ID.message}</span>
                        )}
                      </p>
                    </div> */}
                        <div class="form-group col-md-6">
                      <select type="select" class="form-control" name="className" id="exampleInputPassword1" placeholder="" {...register("Item_ID")}>
                        <option value="">Choose Item</option>
                        {ItemsApi?.map(data => {
                          return <option value={data._id}>{data.itemName}</option>
                          

                          
                        

                        })}

                      </select>
                      {/* <p>
                                    {errors.Emp_ID && (
                                        <span className="text-danger">{errors.Emp_ID.message}</span>


                                    )}

                                </p> */}
                    </div>

                  </div>
                  <div class="row">
                    <div class="form-group col-md-12">
                      <label for="inputEmail4">Quantity</label>
                      <input type="number" class="form-control" id="inputEmail4" placeholder="Enter quantity"
                        {...register("Quantity")}
                      />
                      <p>
                        {errors.Quantity && (
                          <span className="text-danger">{errors.Quantity.message}</span>
                        )}
                      </p>
                    </div>

                  </div>

                  <div class="form-group">
                    <label for="exampleFormControlTextarea1">Description</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder='Enter Description'
                      {...register("Description")}
                    />
                    <p>
                      {errors.Description && (
                        <span className="text-danger">{errors.Description.message}</span>
                      )}
                    </p>
                  </div>

                  <div className='row'>
                    <div className='col-md-12'>

                      {/* <button type="submit" className={`btn w-100 mt-3  mt-4  ${isEdit ? `btn-success` : `btn-primary`}  `}>

                        {
                          isEdit ? 'Update' : 'Save'
                        }
                      </button> */}

                    </div>
                  </div>
                </form>
                {/* <ToastContainer></ToastContainer> */}


              </div>

              <div className="modal-footer">
                <button 
                  type="button"
                  // onClick={() => {
                  //     tog_standard()
                  // }}
                  // onClick={() => setisopen(false)}
                  onClick={() => closeTirtir()}
                  className="btn btn-danger text-white waves-effect mt-1"
                  data-dismiss="modal"
                >
                  Close
                </button>

                <button onClick={handleSubmit(OnSubmitka)} className={`btn mt-1   ${isEdit ? `btn-success` : `btn-primary`}  `}>

                        {
                          isEdit ? 'Update' : 'Save'
                        }
                      
                      </button>
                
              </div>
              {/* </AvForm> */}
            </Modal>

            {/* DatatableRow */}
            <Row className='mt-4'>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <CardTitle className="h4">Default Datatable </CardTitle>

                    <Row>
                      <Col className='col-10'></Col>
                      <Col className='col-2'>
                        <Button onClick={() => tog_standard()} className='btn btn-success mb-3 '>+ Add Invoice</Button>
                      </Col>
                    </Row>

                    <MDBDataTable responsive bordered data={xogta} />
                    {/* ubaas datada so diyarisey */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>

  )
}

export default Invoices