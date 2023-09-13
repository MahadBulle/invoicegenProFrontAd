// import React,{useState} from "react"
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

const UserSchema = yup.object({
  CustomerID: yup.string().required("please enter Customer ID"),
  username: yup.string().required("please enter username or password").min(5, "ugu yaraan 5 xaraf").max(30, "ugu badnaan 30 xaraf"),
  password: yup.string().required("please geli passwordka")



});

const Users = () => {
  const [menu, setMenu] = useState(false)
  const toggle = () => {
    setMenu(!menu)
  }
  let endPoint = 'http://localhost:2323/users'

  const { register, handleSubmit, setValue, reset,
    formState: { errors }, } = useForm({ resolver: yupResolver(UserSchema), });
  const [apiData, setapiData] = useState([])
  const [isopen, setisopen] = useState(false)
  const [tim, setTim] = useState(new Date())
  const [EditID, setEditID] = useState("")
  const [isEdit, setIsEdit] = useState(false)
  const [CustomerApi, setCustomerApi] = useState([])

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
        let xogta = await axios.get(C_endPoint,headers)
        let { data } = await axios.get(endPoint,headers)
        console.log("data", data)
        setapiData(data)
        // console.log(apiData)
     
        console.log("koow",xogta.data)
        setCustomerApi(xogta.data)


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
          // setapiData([data.info, ...apiData,])
          setTim(new Date())
          reset();
        } else {
          toastr.error(data.message);
          reset();
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
    setValue("CustomerID", e.CustomerID?.C_Name)
    setValue("username", e.username)
    setValue("password", e.password)
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
          Swal.fire(
            'Delete Error',
            'Your file has been deleted.',
            'danger'
          )
        }
        else {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          setTim(new Date());

        }


      }
    })
  };

  const xogta = {
    columns: [
      {
        label: "customer name",
        field: "Customername",
        sort: "asc",
        width: 150,
      },
      {
        label: "username",
        field: "username",
        sort: "asc",
        width: 270,
      },
      // {
      //   label: "password",
      //   field: "password",
      //   sort: "asc",
      //   width: 200,
      // },
      {
        label: "UserStatus",
        field: "UserStatus",
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
      data.Customername = data.CustomerID?.C_Name
      data.action = (
        <div>
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
          <title>Users |</title>
        </MetaTags>
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Users</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">Welcome to Users page</li>
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
                  Users Form
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
                    {/* <div class="form-group col-md-12">
                      <label for="inputEmail4">CustomerID</label>
                      <input type="text" class="form-control" placeholder="Enter CustomerID"
                        {...register("CustomerID")}
                      />
                      <p>
                        {errors.CustomerID && (
                          <span className="text-danger">{errors.CustomerID.message}</span>
                        )}
                      </p>
                    </div> */}
                    <div class="form-group col-md-12">
                      <select type="select" class="form-control" name="className" id="exampleInputPassword1" placeholder="" {...register("CustomerID")}>
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

                  </div>

                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="inputEmail4">Username or email</label>
                      <input type="email" class="form-control" placeholder="Username or email"
                        {...register("username")}
                      />
                      <p>
                        {errors.username && (
                          <span className="text-danger">{errors.username.message}</span>
                        )}
                      </p>

                    </div>
                    <div class="form-group col-md-6">
                      <label for="inputPassword4">Password</label>
                      <input type="password" class="form-control" placeholder="Password"
                        {...register("password")}
                      />
                      <p>
                        {errors.password && (
                          <span className="text-danger">{errors.password.message}</span>
                        )}
                      </p>

                    </div>
                    {/* <div class="form-group col-md-12">
                      <select type="select" class="form-control" name="className" id="exampleInputPassword1" placeholder="" {...register("CustomerID")}>
                        <option value="">Select Customer</option>
                        {CustomerApi?.map(data => {
                         return <option value={data._id}>{data.C_Name}</option>

                          
                        

                        })}

                      </select>
                   
                    </div> */}

                  </div>
                  {/* <div class="row">
                    <div class="form-group col-md-12">
                        <label for="inputEmail4">UserStatus</label>
                        <input type="text" class="form-control" id="inputEmail4" placeholder="Enter quantity" />
                    </div>

                </div> */}

                  <div className='row'>
                    <div className='col-md-12'>
                      {/* 
                        <button type="submit" className={`btn w-100 mt-3  mt-4  ${isEdit ? `btn-success` : `btn-primary`}  `}>

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
                        <Button onClick={() => tog_standard()} className='btn btn-success mb-3 '>+ Add user</Button>
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

export default Users