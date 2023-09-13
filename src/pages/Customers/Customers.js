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

const CustomerSchema = yup.object({
    C_Name: yup.string().required("please enter Customer Name").min(3, "ugu yaraan 3 xaraf").max(8, "ugu badnaan 8 xaraf"),
    C_Tell: yup.number().required().typeError('soogeli numberka'),
    // C_Tell: yup.number().required("please enter Costomer Tell").min(4, "ugu yaraan 4 labar").max(10, "ugu badnaan 10 lambar"),
    C_Gender: yup.string().required("please enter Costomer Gender").min(2, "ugu yaraan 2 xaraf").max(8, "ugu badnaan 3 xaraf"),
    C_Address: yup.string().required("please enter Costomer Address").min(3, "ugu yaraan 3 labar").max(8, "ugu badnaan 10 lambar"),

});


// let endPoint = 'http://localhost:2323/customers'
const endPoint = `${process.env.REACT_APP_ENDPOINT}/customers`

const Customers = () => {
    const [menu, setMenu] = useState(false)
    const toggle = () => {
        setMenu(!menu)
    }

    const [apiData, setapiData] = useState([])
    const [isopen, setisopen] = useState(false)
    const [tim, setTim] = useState(new Date())
    const [EditID, setEditID] = useState("")
    const [isEdit, setIsEdit] = useState(false)

    const { register, handleSubmit, setValue, reset,
        formState: { errors }, } = useForm({ resolver: yupResolver(CustomerSchema), });

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
                setapiData(data)
                console.log(apiData)

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
        setValue("C_Name", e.C_Name)
        setValue("C_Tell", e.C_Tell)
        setValue("C_Gender", e.C_Gender)
        setValue("C_Address", e.C_Address)
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
                field: "C_Name",
                sort: "asc",
                width: 150,
            },
            {
                label: "customer tell",
                field: "C_Tell",
                sort: "asc",
                width: 270,
            },
            {
                label: "customer gender",
                field: "C_Gender",
                sort: "asc",
                width: 200,
            },
            {
                label: "customer address",
                field: "C_Address",
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
                    <Button onClick={() => HandleEdit(data)} className='btn btn-primary text white' style={{backgroundColor:"#66bf9d",color:"white"}}><i className="ion ion-md-create font-size-16" /></Button>

                    <Button onClick={() => Deleting(data._id)} className='btn btn-danger me-5' style={{ marginLeft: "10px",backgroundColor:"#B1152D",color:"white" }}><i className="ion ion-md-trash font-size-16" /></Button>
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
                    <title>Customers |</title>
                </MetaTags>
                <Container fluid>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col md={8}>
                                <h6 className="page-title">Customers</h6>
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item active">Welcome to customers page</li>
                                </ol>
                            </Col>

                            <Col md="4">
                                <div className="float-end d-none d-md-block">

                                </div>
                            </Col>
                        </Row>

                        {/* MODAL */}
                        <Modal isOpen={isopen} toggle={() => { tog_standard() }}>
                            <div className="modal-header"style={{backgroundColor:"#66bf9d",color:"white"}}>
                                <h5 className="modal-title mt-0" id="myModalLabel">
                                    Customers Form
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
                            <div className="modal-body" style={{backgroundColor:"#304461",color:"white"}}>

                                <form onSubmit={handleSubmit(OnSubmitka)}>
                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label for="inputEmail4">CustomerName</label>
                                            <input type="name" class="form-control" id="inputEmail4" placeholder="Enter Customer Name"

                                                {...register("C_Name")}
                                            />
                                            <p>
                                                {errors.C_Name && (
                                                    <span className="text-danger">{errors.C_Name.message}</span>
                                                )}
                                            </p>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label>CustomerTell</label>
                                            <input type="number" class="form-control" placeholder="Enter Customer phone"

                                                {...register("C_Tell")}

                                            />
                                            <p>
                                                {errors.C_Tell && (
                                                    <span className="text-danger">{errors.C_Tell.message}</span>
                                                )}
                                            </p>

                                        </div>
                                    </div>

                                    <fieldset class="row mb-3 mt-3 ">
                                        {/* <legend class="col-form-label col-sm-2 pt-0">Gender</legend>
          <div class="col-sm-10">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" checked />
              <label class="form-check-label" for="gridRadios1">
                Male
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2" />
              <label class="form-check-label" for="gridRadios2">
                Female
              </label>
            </div>

          </div> */}
                                    </fieldset>
                                    <div class="form-group">
                                        <label for="inputAddress">Gender</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder="Enter Gender"

                                            {...register("C_Gender")}

                                        />
                                    </div>

                                    <p>
                                        {errors.C_Gender && (
                                            <span className="text-danger">{errors.C_Gender.message}</span>
                                        )}
                                    </p>

                                    <div class="form-group">
                                        <label for="inputAddress">AddressName</label>
                                        <input type="text" class="form-control" id="inputAddress" placeholder="Enter Address Name"

                                            {...register("C_Address")}

                                        />

                                        <p>
                                            {errors.C_Address && (
                                                <span className="text-danger">{errors.C_Address.message}</span>
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
                                                <Button onClick={() => tog_standard()} className='btn  mb-3 'style={{backgroundColor:"#304461",color:"white"}}>+ Add customer</Button>
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

export default Customers