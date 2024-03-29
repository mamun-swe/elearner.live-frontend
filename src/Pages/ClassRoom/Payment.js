import React, {useEffect, useState} from 'react';
import '../../Components/styles/payment.scss';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {apiURL} from '../../utils/apiURL';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Collapse from 'react-bootstrap/Collapse';
import Loader from '../../Components/Loading';
import {useForm} from "react-hook-form";

const Payment = () => {
    const {courseId} = useParams();
    const [bar1, setBar1] = useState(true);
    const [bar2, setBar2] = useState(false);
    const [bar3, setBar3] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState();
    const [trxNo, setTrxNo] = useState();
    const [paymentStatus, setPaymentStatus] = useState(0);
    const [learnerId, setLearnerId] = useState();
    const [courseInfo, setCourseInfo] = useState({});
    const [cost, setCost] = useState(0.0185);
    const [video, setVideo] = useState(false);
    const [ppt, setPpt] = useState(false);
    const {handleSubmit} = useForm();

    const selectBox = (enrollmentStep) => {
        setPaymentStatus(enrollmentStep.paymentStatus)
        if (enrollmentStep.step == '2') {
            setBar1(false);
            setBar2(true);
            setBar3(false);
        } else if (enrollmentStep.step == '1') {
            setBar1(true);
            setBar2(false);
            setBar3(false);
        } else if (enrollmentStep.step == '3') {
            setBar1(false);
            setBar2(false);
            setBar3(true);
        }
    };

    const goBox2 = () => {
        setBar1(false);
        setBar2(true);
        setBar3(false);
        //Update Step
        updateStep('2')
    };
    const goBox3 = () => {

        setBar1(false);
        setBar2(false);
        setBar3(true);
        //TODO: replace current paid amount
        updatePaymentDetails(paymentMethod, trxNo, '0.0');
        updateStep('3')
    };
    const onChangePaymentMethod = event => {
        setPaymentMethod(event.target.value);
        if (event.target.value === 'bkash') {
            setCost(0.0185)
        }
        if (event.target.value === 'rocket') {
            setCost(0.018)
        }
        if (event.target.value === 'nogod') {
            setCost(0.018)
        }
    };

    const paymentAccounts = (amount, percent) => {
        let total = parseInt(amount) + parseInt(percent) + 1;
        return total
    };

    useEffect(() => {
        let userId = localStorage.getItem('loggedLearnerId');
        setLearnerId(userId);
        const header = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        };
        const fetchCourseInfo = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiURL}courses/${courseId}`);
                if (response.status === 200) {
                    setCourseInfo(response.data);
                    setLoading(false)
                }
            } catch (error) {
                if (error) console.log(error)
            }
        };

        const getEnrollmentStep = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiURL}learners/courses/${courseId}/enrollmentStep`, header);
                selectBox(response.data);
                setLoading(false)
            } catch (error) {
                if (error) console.log(error)
            }
        };

        fetchCourseInfo();
        getEnrollmentStep()

    }, [courseId]);

    const updateStep = async (step) => {
        try {
            setLoading(true);
            const header = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };

            let data = {'HTTP_CONTENT_LANGUAGE': 'en-US'};
            axios.put(`${apiURL}learners/courses/${courseId}/enrollment/${step}`, data, header);

            setLoading(false)
        } catch (error) {
            if (error) console.log(error)
        }
    };

    const updatePaymentDetails = async (paymentMethod, trxId, paidAmount) => {
        try {
            setLoading(true);
            const header = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };

            let data = {'paymentMethod': paymentMethod, 'paymentTrxId': trxId, 'paid': paidAmount};
            axios.put(`${apiURL}learners/courses/${courseId}/enrollment/payment`, data, header);

            setLoading(false)
        } catch (error) {
            if (error) console.log(error)
        }
    };

    const onChangePaymentTrxNumber = event => {
        setTrxNo(event.target.value)
    };

    const onChangePromoKey = event => {

        if(event.target.value.length == 8)
        {
            console.log(event.target.value);
            //TODO : show course price after discount
        }
    };


    return (
        <div className="payment p-4">
            {loading ? <Loader/> :
                <div data-aos="fade-zoom">
                    <div className="bar-line">
                        <div className="d-flex">
                            <div className="flex-fill">
                                <div className={bar1 ? "line-box fill-color shadow-sm" : "line-box"}>
                                    <p className="mb-0">Course Details</p>
                                </div>
                            </div>
                            <div className="flex-fill px-2">
                                <div className={bar2 ? "line-box fill-color shadow-sm" : "line-box"}>
                                    <p className="mb-0">Payment</p>
                                </div>
                            </div>
                            <div className="flex-fill">
                                <div className={bar3 ? "line-box fill-color shadow-sm" : "line-box"}>
                                    <p className="mb-0">Status</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {
                        bar1 ?
                            // Selected Course Info
                            <div className="content-box selected-course">
                                <h5 className="mb-0">Learner Info.</h5>
                                <p className="mb-4">Learner ID: {learnerId}</p>

                                <table className="table table-sm table-borderless">
                                    <tbody>
                                    <tr>
                                        <td><h6>Course Name: </h6></td>
                                        <td><h6>{courseInfo.courseName}</h6></td>
                                    </tr>
                                    <tr>
                                        <td><h6>Course Section: </h6></td>
                                        <td><h6>{courseInfo.courseSectionName}</h6></td>
                                    </tr>
                                    <tr>
                                        <td><h6>Course duration: </h6></td>
                                        <td><h6>{courseInfo.courseTotalDurationInDays}</h6></td>
                                    </tr>
                                    <tr>
                                        <td><h6>Course instructor: </h6></td>
                                        <td><h6 className="text-capitalize">{courseInfo.courseInstructorName}</h6></td>
                                    </tr>
                                    <tr>
                                        <td><h6>Course cost: </h6></td>
                                        <td><h6>{courseInfo.coursePriceInTkWithOffer} Tk.</h6></td>
                                    </tr>
                                    </tbody>
                                </table>

                                <div className="text-right">
                                    <button type="button" className="btn text-white next-btn" onClick={goBox2}>Next
                                    </button>
                                </div>
                            </div>


                            : bar2 ?
                            // Payment
                            <div className="content-box payment-box">
                                <form>
                                    <div className="row">
                                        <div className="col-12 col-lg-6">

                                            {/* Payment Method */}
                                            <div className="form-group mb-3">
                                                <p className="label mb-0">By,</p>
                                                <select
                                                    name="paymentWay"
                                                    className="form-control shadow-none"
                                                    onChange={onChangePaymentMethod}>
                                                    <option value="bkash">Bkash</option>
                                                    <option value="rocket">Rocket</option>
                                                    <option value="nogod">Nogod</option>
                                                </select>
                                            </div>
                                            {/* Promo Offer Code */}
                                            <div className="form-group mb-3">
                                                <p className="label mb-0">Promo key</p>
                                                <input
                                                    type="text"
                                                    name="trxId"
                                                    onChange={onChangePromoKey}
                                                    className="form-control shadow-none"
                                                />
                                            </div>

                                            {/* TrxId */}
                                            <div className="form-group mb-3">
                                                <p className="label mb-0">TrxId</p>
                                                <input
                                                    type="text"
                                                    name="trxId"
                                                    onChange={onChangePaymentTrxNumber}
                                                    className="form-control shadow-none"
                                                />
                                            </div>

                                            <div className="payment-to">
                                                <h6>Payment To,</h6>
                                                <p>bKash: 01988841890</p>
                                                <p>Rocket: 019888418907</p>
                                                <p>Nogod: 01988841890</p>
                                            </div>
                                        </div>
                                        {/* Payment Details Show */}
                                        <div className="col-12 col-lg-6">
                                            <div className="accounts">
                                                <div className="d-flex">
                                                    <div>
                                                        <p className="mb-0">Course fee:</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <p>{courseInfo.coursePriceInTkWithOffer} Tk</p></div>
                                                </div>
                                                <div className="d-flex">
                                                    <div>
                                                        <p className="mb-0">Transaction fee:</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <p>{cost} * {courseInfo.coursePriceInTkWithOffer} Tk</p></div>
                                                </div>
                                                <div className="border my-1"></div>
                                                <div className="d-flex">
                                                    <div>
                                                        <p className="mb-0">Total:</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <p>{paymentAccounts(courseInfo.coursePriceInTkWithOffer, cost * courseInfo.coursePriceInTkWithOffer)} Tk</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 pt-3 text-right">
                                            <button className="btn text-white next-btn" onClick={goBox3}>Next</button>
                                        </div>
                                    </div>
                                </form>
                            </div>


                            : bar3 ?
                                // Status
                                <div className="content-box selected-courses">
                                    {/*//TODO: replace amazing Pending or Success UI Design*/}
                                    <p>box 3</p>
                                </div>
                                : null
                    }
                </div>
            }


            {/* Class Information Box */}
            {paymentStatus ?

                <div className="classes-information py-4">
                    <div className="text-center py-4">
                        <h4>My Course Details</h4>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <Tabs defaultActiveKey="class1" transition={false}>

                                <Tab eventKey="class1" title="class 1">
                                    <div className="pt-3">
                                        {/* Video Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setVideo(!video)}
                                                aria-controls="collapse-1"
                                                aria-expanded={video}
                                            >
                                                <p className="mb-0">Video Notes</p>
                                            </div>

                                            <Collapse in={video}>
                                                <div className="card-body" id="collapse-1">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/videos?videoId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>
                                        {/* PPT Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setPpt(!ppt)}
                                                aria-controls="collapse-1"
                                                aria-expanded={ppt}
                                            >
                                                <p className="mb-0">PPT Notes</p>
                                            </div>

                                            <Collapse in={ppt}>
                                                <div className="card-body" id="collapse-1">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/ppts?pptId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>

                                    </div>
                                </Tab>

                                <Tab eventKey="class2" title="class 2">
                                    <div className="pt-3">
                                        {/* Video Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setVideo(!video)}
                                                aria-controls="collapse-2"
                                                aria-expanded={video}
                                            >
                                                <p className="mb-0">Video Notes</p>
                                            </div>

                                            <Collapse in={video}>
                                                <div className="card-body" id="collapse-2">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/videos?videoId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>
                                        {/* PPT Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setPpt(!ppt)}
                                                aria-controls="collapse-2"
                                                aria-expanded={ppt}
                                            >
                                                <p className="mb-0">PPT Notes</p>
                                            </div>

                                            <Collapse in={ppt}>
                                                <div className="card-body" id="collapse-2">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/ppts?pptId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>

                                    </div>
                                </Tab>


                                <Tab eventKey="class3" title="class 3">
                                    <div className="pt-3">
                                        {/* Video Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setVideo(!video)}
                                                aria-controls="collapse-3"
                                                aria-expanded={video}
                                            >
                                                <p className="mb-0">Video Notes</p>
                                            </div>

                                            <Collapse in={video}>
                                                <div className="card-body" id="collapse-1">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/videos?videoId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>
                                        {/* PPT Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setPpt(!ppt)}
                                                aria-controls="collapse-3"
                                                aria-expanded={ppt}
                                            >
                                                <p className="mb-0">PPT Notes</p>
                                            </div>

                                            <Collapse in={ppt}>
                                                <div className="card-body" id="collapse-3">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/ppts?pptId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>

                                    </div>
                                </Tab>

                                <Tab eventKey="class4" title="class 4">
                                    <div className="pt-3">
                                        {/* Video Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setVideo(!video)}
                                                aria-controls="collapse-4"
                                                aria-expanded={video}
                                            >
                                                <p className="mb-0">Video Notes</p>
                                            </div>

                                            <Collapse in={video}>
                                                <div className="card-body" id="collapse-4">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/videos?videoId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>
                                        {/* PPT Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setPpt(!ppt)}
                                                aria-controls="collapse-4"
                                                aria-expanded={ppt}
                                            >
                                                <p className="mb-0">PPT Notes</p>
                                            </div>

                                            <Collapse in={ppt}>
                                                <div className="card-body" id="collapse-4">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/ppts?pptId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>

                                    </div>
                                </Tab>

                                <Tab eventKey="class5" title="class 5">
                                    <div className="pt-3">
                                        {/* Video Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setVideo(!video)}
                                                aria-controls="collapse-5"
                                                aria-expanded={video}
                                            >
                                                <p className="mb-0">Video Notes</p>
                                            </div>

                                            <Collapse in={video}>
                                                <div className="card-body" id="collapse-5">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/videos?videoId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>
                                        {/* PPT Notes */}
                                        <div className="card toggle-card border-0 shadow-sm rounded-0 mb-3">
                                            <div
                                                className="card-header border-0"
                                                onClick={() => setPpt(!ppt)}
                                                aria-controls="collapse-5"
                                                aria-expanded={ppt}
                                            >
                                                <p className="mb-0">PPT Notes</p>
                                            </div>

                                            <Collapse in={ppt}>
                                                <div className="card-body" id="collapse-5">
                                                    <a href="#"
                                                       target="_blank">https://www.elearners.live/ppts?pptId=live5015</a>
                                                </div>
                                            </Collapse>
                                        </div>

                                    </div>
                                </Tab>

                            </Tabs>
                        </div>
                    </div>
                </div>
                : null
            }


        </div>
    );


};

export default Payment;