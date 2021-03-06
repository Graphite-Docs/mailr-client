import React, { setGlobal } from 'reactn';
import ConnectEmailService from './ConnectEmailService';
import { handleDelete } from '../helpers/emailTemplates';
import axios from 'axios';

export default class Emails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showConfirmDelete: false, 
        campaign: {}
      }
    }
    handleNewCampaign = async () => {
      await setGlobal({ newCampaign: true });
      document.getElementById('campaign-modal').style.display = "block";
      document.getElementById('dimmer').style.display = "block";
    }

    handleNewTemplate = async () => {
      await setGlobal({ showTemplate: true });
      document.getElementById('template-modal-new').style.display = "block";
      document.getElementById('dimmer').style.display = "block";
    }

    loadTemplate = async (id) => {
      console.log(id);
      const {templates} = this.global;
      const emailTemplate = await templates.filter(x => x.id === id)[0]
      console.log(emailTemplate);
      await setGlobal({ emailTemplate, showTemplate: true });
      document.getElementById('template-modal-new').style.display = "block";
      document.getElementById('dimmer').style.display = "block";
    }
    handleDelete = (templateId) => {
      handleDelete(templateId);
      this.setState({ showConfirmDelete: false });
    }

    loadCampaign = async (id) => {
      const { campaigns } = this.global;
      const campaign = campaigns.filter(x => x.id === id)[0];
      console.log(campaign);
      await this.setState({ campaign });
      document.getElementById('single-campaign-modal').style.display = "block";
      document.getElementById('dimmer').style.display = "block";
    }

    handleClose = () => {
      document.getElementById('single-campaign-modal').style.display = "none";
      document.getElementById('dimmer').style.display = "none";
      this.setState({ campaign: {} });
    }

    render() {
        const { emailConnected, templates, campaigns } = this.global;
        const { showConfirmDelete, campaign } = this.state;
        let singleCampaign = {name: "", recipients: []};
        campaign.recipients ? singleCampaign = campaign : singleCampaign = {name: "", recipients: []};
        return(
            <div className="content">
              {
                emailConnected ? 
                <div className="row">

                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h4>Templates <span style={{fontSize: "12px", position: "relative", top: "-5px", left: "10px"}}><button onClick={this.handleNewTemplate} className="btn btn-primary btn-round">New Template</button></span></h4>
                        <div className="table-responsive">
                          <table className="table">
                            <thead className=" text-primary">
                              <tr>
                                <th>
                                  Template Name
                                </th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                            {
                            templates.map(item => {
                              return (
                                <tr key={item.id}>
                                  <td>
                                    <span className="text-primary pointer" onClick={() => this.loadTemplate(item.id)}>{item.name ? item.name : "Untitled"}</span>
                                  </td>
                                  <td>{showConfirmDelete ? <span><span onClick={() => this.handleDelete(item.id)} className="delete pointer">Confirm?</span><span style={{marginLeft: "10px"}} onClick={() => this.setState({ showConfirmDelete: false })} className="pointer">Cancel</span></span> : <span className="pointer delete" onClick={() => this.setState({ showConfirmDelete: true })}>Delete</span>}</td>
                                </tr>
                              )
                            })
                          }
                          </tbody>
                          </table>
                        </div>
                      </div>
                    </div>   
                  </div>

                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h4>Email Campaigns <span style={{fontSize: "12px", position: "relative", top: "-5px", left: "10px"}}><button onClick={this.handleNewCampaign} className="btn btn-info btn-round">New Campaign</button></span></h4>
                        <div className="table-responsive">
                          <table className="table">
                            <thead className=" text-info">
                              <tr>
                                <th>
                                  Campaign Name
                                </th>
                                <th>
                                  Template Used
                                </th>
                                <th>List</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                            {
                            campaigns.map(item => {
                              return (
                                <tr key={item.id}>
                                  <td>
                                    <span className="text-primary pointer" onClick={() => this.loadCampaign(item.id)}>{item.name ? item.name : "Untitled"}</span>
                                  </td>
                                  <td>{item.template}</td>
                                  <td>{item.list}</td>
                                </tr>
                              )
                            })
                          }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>   
                  </div>

                  <div style={{display: "none"}} id='single-campaign-modal' className="custom-modal">
                      <button onClick={this.handleClose} style={{marginRight: "5px", float: "right"}} className="btn btn-round">X</button>
                      <h3>{campaign.name}</h3>
                      <p>Recipients</p>
                      <ul>
                        {singleCampaign.recipients.map(a => {
                          return(
                            <li key={a}>{a}</li>
                          )
                        })}
                      </ul>
                  </div>

                </div>  : 
                <ConnectEmailService />
              }
                      
              </div>
        )
    }
}