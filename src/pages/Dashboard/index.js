import React, { useState } from "react"
import MetaTags from 'react-meta-tags';
import {
  Col, Container, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card,
  CardBody,
  Input
} from "reactstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import { useEffect } from "react"
import servicesIcon1 from "../../assets/images/services-icon/01.png";
import servicesIcon2 from "../../assets/images/services-icon/02.png";
import servicesIcon3 from "../../assets/images/services-icon/03.png";
import servicesIcon4 from "../../assets/images/services-icon/04.png";
const Dashboard = () => {
  const [menu, setMenu] = useState(false)
  const [apiData, setapiData] = useState([])
  const [latestapiData, setlatestapiData] = useState([])
  const toggle = () => {
    setMenu(!menu)
  }
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
        const epiEndPoint = "http://localhost:2323/summary";
        const LatestInvUrl = "http://localhost:2323/summary";
        const { data } = await axios.get(epiEndPoint,headers)
        setapiData(data)
        console.log("data", data)

      } catch (error) {
        console.log(error.message)
      }
    }
    onload()
    async function onloadka() {
      try {

        const LatestInvUrl = "http://localhost:2323/invoice/latestinvoice";
        const { data } = await axios.get(LatestInvUrl,headers)
        setlatestapiData(data)
        console.log("lates", data)

      } catch (error) {
        console.log(error.message)
      }
    }
    onloadka()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Dashboard |</title>
        </MetaTags>
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Dashboard</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">Welcome to Veltrix Dashboard</li>
                </ol>
              </Col>

              <Col md="4">
                <div className="float-end d-none d-md-block">

                </div>
              </Col>
            </Row>

            <Row>
              <Col xl={3} md={6}>
                <Card className="mini-stat  text-white" style={{backgroundColor:"#304461"}}>
                  <CardBody>
                    <div className="mb-4">
                      <div className="float-start mini-stat-img me-4">
                        <img src={servicesIcon1} alt="" />
                      </div>
                      <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                        Available Customers
                      </h5>
                      <h4 className="fw-medium font-size-24">
                        {apiData.numberOfcustomers}
                        <i className="mdi mdi-arrow-up text-success ms-2"></i>
                      </h4>

                    </div>
                    <div className="pt-2">
                      <div className="float-end">
                        <Link to="#" className="text-white-50">
                          <i className="mdi mdi-arrow-right h5"></i>
                        </Link>
                      </div>
                      <p className="text-white-50 mb-0 mt-1">Since last month</p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={3} md={6}>
                <Card className="mini-stat text-white"style={{backgroundColor:"#304461"}}>
                  <CardBody>
                    <div className="mb-4">
                      <div className="float-start mini-stat-img me-4">
                        <img src={servicesIcon2} alt="" />
                      </div>
                      <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                        Number OF Items
                      </h5>
                      <h4 className="fw-medium font-size-24">
                        {apiData.numberOfitems}
                        <i className="mdi mdi-arrow-down text-danger ms-2"></i>
                      </h4>

                    </div>
                    <div className="pt-2">
                      <div className="float-end">
                        <Link to="#" className="text-white-50">
                          <i className="mdi mdi-arrow-right h5"></i>
                        </Link>
                      </div>

                      <p className="text-white-50 mb-0 mt-1">Since last month</p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={3} md={6}>
                <Card className="mini-stat text-white"style={{backgroundColor:"#304461"}}>
                  <CardBody>
                    <div className="mb-4">
                      <div className="float-start mini-stat-img me-4">
                        <img src={servicesIcon3} alt="" />
                      </div>
                      <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                        Invoices
                      </h5>
                      <h4 className="fw-medium font-size-24">
                        {apiData.numberOfinvoices}
                        <i className="mdi mdi-arrow-up text-success ms-2"></i>
                      </h4>

                    </div>
                    <div className="pt-2">
                      <div className="float-end">
                        <Link to="#" className="text-white-50">
                          <i className="mdi mdi-arrow-right h5"></i>
                        </Link>
                      </div>

                      <p className="text-white-50 mb-0 mt-1">Since last month</p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={3} md={6}>
                <Card className="mini-stat  text-white"style={{backgroundColor:"#304461"}}>
                  <CardBody>
                    <div className="mb-4">
                      <div className="float-start mini-stat-img me-4">
                        <img src={servicesIcon3} alt="" />
                      </div>
                      <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                        Number of Users
                      </h5>
                      <h4 className="fw-medium font-size-24">
                        {apiData.numberOfusers}
                        <i className="mdi mdi-arrow-up text-success ms-2"></i>
                      </h4>

                    </div>
                    <div className="pt-2">
                      <div className="float-end">
                        <Link to="#" className="text-white-50">
                          <i className="mdi mdi-arrow-right h5"></i>
                        </Link>
                      </div>

                      <p className="text-white-50 mb-0 mt-1">Since last month</p>
                    </div>
                  </CardBody>
                </Card>
              </Col>

            </Row>

            <Row>
              <Col xl={12}>

                <Card>
                  <CardBody style={{backgroundColor:"#66bf9d"}}>
                    <h4 className="card-title mb-4 text-white">Latest Transaction</h4>
                    <div className="table-responsive">
                      <table className="table table-hover table-centered table-nowrap mb-0 text-white">
                        <thead>
                          <tr>
                            <th scope="col">InvoiceNum</th>
                            <th scope="col">CostomerName</th>
                            <th scope="col">ItemName</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">TotalAmount</th>
                            <th scope="col">Description</th>
                            <th scope="col">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {latestapiData?.map((data) => {
                            return (
                              <tr>
                                <td>{data.InvoiceNum}</td>
                                <td>
                                  <div>
                                    {data.C_ID.C_Name}
                                  </div>
                                </td>
                                <td> {data.Item_ID.itemName}</td>
                                <td> {data.Quantity}</td>
                                <td> {data.Price}</td>
                                <td> {data.TotalAmount}</td>
                                <td> {data.Description}</td>
                                <td> {data.Date}</td>
                                {/* <td>{data.Payment_Method}</td>
                          <td>{data.Payment_date=moment(data.Payment_date).format('LLL')}</td> */}
                              </tr>
                            )
                          })}

                        </tbody>
                      </table>
                    </div>
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

export default Dashboard