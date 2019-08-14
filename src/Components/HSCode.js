import React, { Component } from 'react';
import Modal from 'react-modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select'
var BFF_URL = 'http://localhost:8081/';
var Client_ID = '6e65ad20-d576-43f2-95fa-19daf959070d';
let END_POINT = 'hscode';

class HSCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hsHsCode: '',
            hsDescription: '',
            hsUnit: '',
            hsCountry: '',
            hsDuty: '',
            hsGenDuty: '',
            hsVAT: '',
            hsPAL: '',
            hsNBT: '',
            hsCess: '',
            hsExcise: '',
            hsSCL: '',
            fields: {}
        };
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.editClick = this.editClick.bind(this);

    }

    loadDropdown = (endPointUrl) => {
        let url = BFF_URL + endPointUrl;
        fetch(url)
            .then(res => res.json())
            .then((data) => {

                var arrOptions = [];
                if (endPointUrl === END_POINT) {
                    for (var k = 0; k < data.length; k++) {
                        arrOptions.push(<tr key={k}>
                            <td>{data[k].HsCode}</td>
                            <td>{data[k].Description}</td>
                            <td>{data[k].Unit}</td>
                            <td>{data[k].GenDuty}</td>
                            <td>{data[k].VAT}</td>
                            <td>{data[k].PAL}</td>
                            <td>{data[k].NTB}</td>
                            <td>{data[k].Cess}</td>
                            <td>{data[k].Excise}</td>
                            <td>{data[k].SCL}</td>
                            <td>{data[k].MType}</td>
                            <td><button className="delete" onClick={() => this.editClick(k - 1)} > Change </button></td>
                        </tr>);
                    }

                    this.setState({ hsCodeList: data });
                    this.setState({ hsCodeListOptions: arrOptions });
                } else if (endPointUrl === 'countries') {
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            arrOptions.push(<option value={key}> {data[key]} </option>);
                        }
                    }
                    this.setState({ countryCodeOptions: data });
                }
            })
            .catch(console.log)
    }
    handleClick(item) {
    }
    componentDidMount() {
        this.loadDropdown('countries');
        this.loadDropdown(END_POINT);
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }
    editClick(id) {

        this.setState({ isEditMode: true });
        var hscode = this.state.hsCodeList[id].HsCode
        var listOfcountries = this.state.countryCodeOptions;
        let url = BFF_URL + END_POINT + '/' + hscode;
        fetch(url)
            .then(res => res.json())
            .then((data) => {

                if (data.length !== 0) {
                    if (data) {

                        var arrCountrylist = [];
                        data.Countries.forEach(eachCountry);

                        function eachCountry(item, index) {
                            var code = item;
                            listOfcountries.forEach(eachValue);
                            function eachValue(item, index) {
                                if (code === item.value) {
                                    arrCountrylist.push(item)
                                }
                            }
                        }

                        this.setState({
                            hsHsCode: data.HsCode,
                            hsDescription: data.Description,
                            hsUnit: data.Unit,
                            hsDuty: data.GenDuty,
                            hsGenDuty: data.GenDuty,
                            hsVAT: data.VAT,
                            hsPAL: data.PAL,
                            hsNBT: data.NTB,
                            hsCess: data.Cess,
                            hsExcise: data.Excise,
                            hsSCL: data.SCL,
                            hsCountry: arrCountrylist
                        });
                        this.openModal();
                    }
                }
            })
            .catch(console.log)
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
        this.setState({
            hsHsCode: '',
            hsDescription: '',
            hsUnit: '',
            hsCountry: '',
            hsDuty: '',
            hsGenDuty: '',
            hsVAT: '',
            hsPAL: '',
            hsNBT: '',
            hsCess: '',
            hsExcise: '',
            hsSCL: '',
        });
    }

    handleChange = hsCountry => {
        this.setState({ hsCountry });
        console.log(`Option selected:`, hsCountry);
    };

    onSubmitClick(fields) {

        var arrCounties = [];
        var i;
        for (i = 0; i < this.state.hsCountry.length; i++) {
            arrCounties.push(this.state.hsCountry[i].value);
        }

        var METHOD = 'POST'

        if (this.state.isEditMode === true) {
            METHOD = 'PUT'
        }

        fetch(BFF_URL + END_POINT, {
            method: METHOD,
            body: JSON.stringify({
                HsCode: fields.hsHsCode,
                Description: fields.hsDescription,
                Unit: fields.hsUnit,
                GenDuty: fields.hsGenDuty,
                VAT: fields.hsVAT,
                PAL: fields.hsPAL,
                NTB: fields.hsNBT,
                Cess: fields.hsCess,
                Excise: fields.hsExcise,
                SCL: fields.hsSCL,
                MType: fields.Radio,
                Countries: arrCounties
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8", 'InitiatedBy': 'UAT USER', 'Client_ID': Client_ID
            }
        }).then(response => {
            this.setState({ isEditMode: false });
            if (response.status === 200 || response.status === 201) {
                alert('HS code is success fully saved');
            } else {
                alert('An error occurred while saving, please try again');
            }
            return;
        }).then(json => {
            this.setState({
                user: json
            });
        });
    }

    render() {

        return (
            <div className="row pr-3 pl-3">
                <div className="col-11 form-box mt-2 mb-4">
                    <div className="float-right">
                        <button type="button" onClick={this.openModal} className="btn btn-line-primary-bridge " data-toggle="modal" data-target=".bd-example-modal-lg" >Add HSCode</button>
                    </div>
                </div>
                <div>

                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}

                        contentLabel="HS Code">
                        <Formik
                            /*    initialValues={{
                                    hsHsCode: '',
                                    hsDescription: '',
                                    hsUnit: '',
                                    hsCountry: '',
                                    hsDuty: '',
                                    hsGenDuty: '',
                                    hsVAT: '',
                                    hsPAL: '',
                                    hsNBT: '',
                                    hsCess: '',
                                    hsExcise: '',
                                    hsSCL: ''
                                }}*/
                            validationSchema={Yup.object().shape({
                                hsHsCode: Yup.string()
                                    .required('HS code is required'),
                                hsDescription: Yup.string()
                                    .required('boolean  is required'),
                                hsUnit: Yup.string()
                                    .required('Unit is required'),
                                /* hsCountry: Yup.string()
                                     .required('Country is required'),*/
                                hsDuty: Yup.string()
                                    .required('Duty is required'),
                                hsGenDuty: Yup.number()
                                    .required('Gen Duty is required'),
                                hsVAT: Yup.number()
                                    .required('VAT is required'),
                                hsPAL: Yup.number()
                                    .required('PAL is required'),
                                hsNBT: Yup.number()
                                    .required('NBT is required'),
                                hsCess: Yup.number()
                                    .required('Cess is required'),
                                hsExcise: Yup.number()
                                    .required('Excise is required'),
                                hsSCL: Yup.number()
                                    .required('SCL is required')
                            })}
                            onSubmit={fields => {
                                this.onSubmitClick(fields);
                            }}
                            render={({ errors, status, touched }) => (
                                <Form>
                                    <div className=" col-12 form-box mt-4">   <h3 className="pb-3">HS Code</h3>  </div>
                                    <div className="row pr-3 pl-3">
                                        <div className="col-3 form-box mt-1">
                                            <div className="form-group">
                                                <label htmlFor="hsHsCode">Hs Code</label>
                                                <Field name="hsHsCode" type="text" value={this.state.hsHsCode} className={'form-control' + (errors.hsHsCode && touched.hsHsCode ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsHsCode" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="col-3 form-box mt-1">
                                            <div className="form-group">
                                                <label htmlFor="hsUnit">Unit</label>
                                                <Field name="hsUnit" type="text" value={this.state.hsUnit} className={'form-control' + (errors.hsUnit && touched.hsUnit ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsUnit" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className=" col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsCountry">Country</label>
                                                <Select name="hsCountry" value={this.state.hsCountry} onChange={this.handleChange} isMulti={true} options={this.state.countryCodeOptions} />
                                                <ErrorMessage name="hsCountry" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>

                                        <div className=" col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsDescription">Description</label>
                                                <Field name="hsDescription" value={this.state.hsDescription} type="text" className={'form-control' + (errors.hsDescription && touched.hsDescription ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsDescription" component="div" className="invalid-feedback" />
                                            </div>

                                        </div>


                                        <div className="col-6 form-box mt-2">

                                        </div>
                                        <div className=" col-12 form-box mt-4">   <h6 className="pb-3">Preferencial Duty</h6>  </div>
                                        <div className="col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsDuty">Duty</label>
                                                <Field name="hsDuty" type="text" value={this.state.hsDuty} className={'form-control' + (errors.hsDuty && touched.hsDuty ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsDuty" component="div" className="invalid-feedback" />
                                            </div>

                                        </div>

                                        <div className="col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsGenDuty">Gen Duty</label>
                                                <Field name="hsGenDuty" type="text" value={this.state.hsGenDuty} className={'form-control' + (errors.hsGenDuty && touched.hsGenDuty ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsGenDuty" component="div" className="invalid-feedback" />
                                            </div>

                                        </div>
                                        <div className="col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsVAT">VAT</label>
                                                <Field name="hsVAT" type="text" value={this.state.hsVAT} className={'form-control' + (errors.hsVAT && touched.hsVAT ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsVAT" component="div" className="invalid-feedback" />
                                            </div>

                                        </div>

                                        <div className="col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsPAL">PAL</label>
                                                <Field name="hsPAL" type="text" value={this.state.hsPAL} className={'form-control' + (errors.hsPAL && touched.hsPAL ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsPAL" component="div" className="invalid-feedback" />
                                            </div>

                                        </div>
                                        <div className="col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsNBT">NBT</label>
                                                <Field name="hsNBT" type="text" value={this.state.hsNBT} className={'form-control' + (errors.hsNBT && touched.hsNBT ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsNBT" component="div" className="invalid-feedback" />
                                            </div>

                                        </div>

                                        <div className="col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsCess">Cess</label>
                                                <Field name="hsCess" type="text" value={this.state.hsCess} className={'form-control' + (errors.hsCess && touched.hsCess ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hshsCessPAL" component="div" className="invalid-feedback" />
                                            </div>

                                        </div>

                                        <div className="col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsExcise">Excise</label>
                                                <Field name="hsExcise" type="text" value={this.state.hsExcise} className={'form-control' + (errors.hsExcise && touched.hsExcise ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsExcise" component="div" className="invalid-feedback" />
                                            </div>

                                        </div>

                                        <div className="col-6 form-box mt-2">
                                            <div className="form-group">
                                                <label htmlFor="hsSCL">SCL</label>
                                                <Field name="hsSCL" type="text" value={this.state.hsSCL} className={'form-control' + (errors.hsSCL && touched.hsSCL ? ' is-invalid' : '')} />
                                                <ErrorMessage name="hsSCL" component="div" className="invalid-feedback" />
                                            </div>

                                        </div>


                                        <div className="col-6 form-box mt-2">
                                            <label htmlFor="exampleFormControlSelect1">Type </label>
                                            <table>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio" name="Radio" id="weight" value="option1" checked></input>
                                                            <label class="form-check-label" htmlFor="value"> Weight</label>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio" name="Radio" id="values" value="option2"></input>
                                                            <label class="form-check-label" htmlFor="value">Values</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio" name="Radio" id="both" value="option3"></input>
                                                            <label class="form-check-label" for="both">Both</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div className=" col-6 form-box mt-2">
                                            <div className="form-group">
                                                <button type="button" className="btn btn-primary-bridge-close" onClick={this.closeModal} >Close</button>
                                                <button type="submit" className="btn btn-primary-bridge">Save </button>
                                            </div>
                                        </div>

                                    </div>

                                </Form>

                            )
                            }
                        />
                    </Modal>

                </div>
                <div className="col-lg-11 table-wraper">
                    <table className="table table-hover">
                        <thead className="material-table-th">
                            <tr>
                                <th scope="col">Hs Code</th>
                                <th scope="col">Description</th>
                                <th scope="col">Unit</th>
                                <th scope="col">GenDuty</th>
                                <th scope="col">VAT</th>
                                <th scope="col">PAL</th>
                                <th scope="col">NTB</th>
                                <th scope="col">Cess</th>
                                <th scope="col">Excise</th>
                                <th scope="col">SCL</th>
                                <th scope="col">MType</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.hsCodeListOptions}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default HSCode;