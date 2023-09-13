// import React,{useState} from "react"
import React from "react"
import MetaTags from 'react-meta-tags';
import { Col, Container, Row, Card, CardBody, CardTitle, Button, Modal, FormGroup, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
import { MDBDataTable } from "mdbreact"
import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import toastr from "toastr";
import "toastr/build/toastr.min.css";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/react-toastify.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const ItemSchema = yup.object({
  itemName: yup.string().required("please enter item Name").min(3, "ugu yaraan 3 xaraf").max(20, "ugu badnaan 20 xaraf"),
  Description: yup.string().required("please enter item Description").min(8, "ugu yaraan 8 xaraf").max(50, "ugu badnaan 50 xaraf"),
  Quantity: yup.number().required().typeError('soo geli quantitiga'),
  Price: yup.number().required().typeError('soo geli qiimaha ama priceka'),

});


const endPoint = `${process.env.REACT_APP_ENDPOINT}/items`
const Items = () => {
  const [menu, setMenu] = useState(false)
  const toggle = () => {
    setMenu(!menu)
  }
  const [apiData, setApiData] = useState([])
  const [isopen, setisopen] = useState(false)
  const [EditID, setEditID] = useState("")
  const [isEdit, setIsEdit] = useState(false)
  const [tim, setTim] = useState(new Date())


  const { register, handleSubmit, setValue, reset,
    formState: { errors }, } = useForm({ resolver: yupResolver(ItemSchema), });

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

        let { data } = await axios.get(endPoint,headers)
        console.log("data", data)
        setApiData(data)
        console.log(apiData)

      } catch (error) {
        console.log(error.message)
      }
    }
    onload()
  }, [tim])

  // const handleEdit = (data) => {
  //   // setisopen(true)
  //   console.log(data)

  // }

  const OnSubmitka = async (event) => {


    try {
      if (isEdit) {
        const newEndPoint = `${endPoint}/${EditID}`
        //return console.log(isEdit)
        let { data } = await axios.put(newEndPoint, event);
        setTim(new Date())
        if (data.status === 'Success') {
          // toast.success(data.message)
          toastr.success(data.message)
          reset();
          setTim(new Date());
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
          //toast.success(data.message);
          toastr.success(data.message);
          reset();
          setTim(new Date());
          setApiData([data.info, ...apiData,])
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
    setValue("itemName", e.itemName)
    setValue("Description", e.Description)
    setValue("Quantity", e.Quantity)
    setValue("Price", e.Price)
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
        label: "Item name",
        field: "itemName",
        sort: "asc",
        width: 150,
      },
      {
        label: "Description",
        field: "Description",
        sort: "asc",
        width: 270,
      },
      {
        label: "Quantity",
        field: "Quantity",
        sort: "asc",
        width: 200,
      },
      {
        label: "Price",
        field: "Price",
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
      data.action = (
        <div>
          {/* <button onClick={() => HandleEdit(data)} className='btn btn-primary'>Edit</button> */}
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
          <title>items |</title>
        </MetaTags>
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Items Component</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">Welcome to Items</li>
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
                  Items Form
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
                              onValidSubmit={(e,v)=>{
                                  console.log("xogta",v);

                              }}
                              > */}
              <div className="modal-body">


                <form onSubmit={handleSubmit(OnSubmitka)}>
                  <div class="row">
                    <div class="form-group col-md-12">
                      <label for="inputEmail4">itemname</label>
                      <input type="text" class="form-control" id="inputEmail4" placeholder="Enter itemname"
                        {...register("itemName")}
                      />
                      <p>
                        {errors.itemName && (
                          <span className="text-danger">{errors.itemName.message}</span>
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

                  <div class="row">
                    <div class="form-group col-md-6">
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

                    <div class="form-group col-md-6">
                      <label for="inputEmail4">Price</label>
                      <input type="number" class="form-control" id="inputEmail4" placeholder="Enter price"
                        {...register("Price")}
                      />
                      <p>
                        {errors.Price && (
                          <span className="text-danger">{errors.Price.message}</span>
                        )}
                      </p>


                    </div>
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
                {/* <ToastContainer/> */}


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
                        <Button onClick={() => tog_standard()} className='btn btn-success mb-3 '>+ Add Items</Button>
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

export default Items